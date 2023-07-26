import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { EntryEntity, LogoutRequestPayload, Patient, PatientTableData, SessionStorageData } from 'src/app/@types';
import { LogoutService, PatientService } from 'src/app/shared/service';
import { calculateAge, getDataFromSessionStorage, getPersonName } from 'src/app/shared/util';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit {

  public displayedColumns: string[] = ['select', 'name', 'gender', 'age', 'dob'];
  public dataSource = new MatTableDataSource<PatientTableData>([]);
  public selection = new SelectionModel<PatientTableData>(true, []);

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public patientEntryList: Array<EntryEntity> = [];
  public isLoadingResults = true;
  private sessionStorageData: SessionStorageData;

  constructor(private patientService: PatientService, private router: Router,
    private logoutService: LogoutService) { }

  ngOnInit(): void {
    this.getPatientList();
    this.sessionStorageData = getDataFromSessionStorage();
  }

  getPatientList() {
    this.patientService.getPatientList().pipe(first()).subscribe({
      next: async (data: Patient) => {
        if (data.entry) {
          this.patientEntryList = data.entry;
          this.getDataForTable(this.patientEntryList);
          this.isLoadingResults = false;
        }
      },
      error: (error) => {
        this.isLoadingResults = false;
        console.log(error);
      }
    });
  }

  getDataForTable(patientEntryList: Array<EntryEntity>) {
    const dataSourceList: Array<PatientTableData> = [];
    patientEntryList.map((data: EntryEntity, index: number) => {
      const obj: PatientTableData = {
        name: getPersonName(data.resource),
        gender: data.resource.gender,
        age: calculateAge(data.resource.birthDate),
        dob: data.resource.birthDate,
        position: index + 1,
        patientId: data.resource.id
      }
      dataSourceList.push(obj);
    });
    this.dataSource = new MatTableDataSource<PatientTableData>(dataSourceList);
    this.selection = new SelectionModel<PatientTableData>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** The label for the radioButton on the passed row */
  radioLabel(row: PatientTableData): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSelectPatient(row: PatientTableData) {
    this.selection.toggle(row)
    const selectedPatient: EntryEntity | undefined = this.patientEntryList.find(patient => patient.resource.id === row.patientId);
    if (selectedPatient) {
      this.router.navigateByUrl('/dashboard', { state: { patient: selectedPatient } }).then(()=>{
        sessionStorage.setItem("patient", JSON.stringify(selectedPatient));
        localStorage.setItem("vt-demo-previousVisitedUrl", "/dashboard");
      });
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


