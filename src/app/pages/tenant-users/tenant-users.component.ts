import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { LogoutRequestPayload, SessionStorageData, TenantUser, TenantUserTableData, UserMenuAccessFromFHIrRequestPayload } from 'src/app/@types';
import { LogoutService, MenuService, UserService } from 'src/app/shared/service';
import { getDataFromSessionStorage, setThemColor } from 'src/app/shared/util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tenant-users',
  templateUrl: './tenant-users.component.html',
  styleUrls: ['./tenant-users.component.scss']
})
export class TenantUsersComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['select', 'facilityId', 'facilityName'];
  public dataSource = new MatTableDataSource<TenantUserTableData>([]);
  public selection = new SelectionModel<TenantUserTableData>(true, []);

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public isLoadingResults = true;
  private sessionStorageData: SessionStorageData;

  constructor(private menuService: MenuService, private userService: UserService, private router: Router,
    private logoutService: LogoutService) {
    this.sessionStorageData = getDataFromSessionStorage();
  }

  ngOnInit(): void {
    const tenantUsers = this.getTenantUserJsonObj();
    if (tenantUsers) {
      this.getDataForTable(tenantUsers.data);
      this.isLoadingResults = false;
    } else {
      this.isLoadingResults = false;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTenantUserJsonObj() {
    const tenantUserList = this.sessionStorageData.tenantUserList;
    if (tenantUserList) {
      return tenantUserList;
    } else {
      return null;
    }
  }

  getDataForTable(tenantUsers: Array<TenantUser>) {
    const dataSourceList: Array<TenantUserTableData> = [];
    tenantUsers.map((data: TenantUser, index: number) => {
      const obj: TenantUserTableData = {
        tenantId: data.tenantId,
        tenantName: data.tenantName,
        position: index + 1,
      }
      dataSourceList.push(obj);
    });
    this.dataSource = new MatTableDataSource<TenantUserTableData>(dataSourceList);
    this.selection = new SelectionModel<TenantUserTableData>(true, []);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** The label for the checkbox on the passed row */
  /** The label for the radioButton on the passed row */
  radioLabel(row: TenantUserTableData): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSelectPractitioner(row: TenantUserTableData) {
    this.selection.toggle(row);
    const tenantUsers = this.getTenantUserJsonObj();
    const tenantUser = tenantUsers && tenantUsers.data.find((user: TenantUser) => user.tenantId === row.tenantId);
    sessionStorage.setItem("tenantUserLoginInfo", JSON.stringify(tenantUser));
    this.sessionStorageData = getDataFromSessionStorage();
    this.getUserMenuAccessFromFHIrService();
    if (tenantUser) {
      this.afterTenantSelect(tenantUser, tenantUsers?.status);
    }
  }

  getUserMenuAccessFromFHIrService() {
    const tenantId = this.sessionStorageData.tenantUserLoginInfo?.tenantId;
    const userId = this.sessionStorageData.tenantUserLoginInfo?.id
    const businessKey = this.sessionStorageData.businessAndProcessDetails?.businessKey;
    const processId = this.sessionStorageData.businessAndProcessDetails?.processId;
    const processDefinitionId = this.sessionStorageData.businessAndProcessDetails?.processDefinitionId;

    if (tenantId && userId && businessKey && processId && processDefinitionId) {
      const requestPayload: UserMenuAccessFromFHIrRequestPayload = {
        tenantId: tenantId,
        userId: userId,
        businessKey: businessKey,
        processId: processId,
        processDefinitionId: processDefinitionId
      }

      this.menuService.getUserMenuAccessFromFHIrService(requestPayload).pipe(first()).subscribe({
        next: (data) => {
          sessionStorage.setItem("userAllMenuAccessResponse2", JSON.stringify(data.userAllMenuAccessResponse2));
        },
        error: (error) => {
          console.log(error);
        }
      });

      this.userService.getFHIrUrlByTenant({ tenantId }).pipe(first()).subscribe({
        next: (data) => {
          if (data[0].isActive && data[0].serverURL) {
            environment.fHirUrl = data[0].serverURL;
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }

  afterTenantSelect(tenantUser: TenantUser, status: boolean) {
    if (status) {
      if (tenantUser.userType === 'Practitioner') {
        this.router.navigate(['/patients']).then(() => {
          localStorage.setItem("vt-demo-previousVisitedUrl", "/patients");
          setThemColor(tenantUser.themeId);
        });
      }
    }
  }

  logout() {
    const key = this.sessionStorageData.businessAndProcessDetails?.businessKey;
    if (key) {
      const requestPayload: LogoutRequestPayload = {
        businessKey: key
      }
      this.logoutService.logoutUser(requestPayload);
    }
  }
}
