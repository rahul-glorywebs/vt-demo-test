import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { renderDash } from "dash-embedded-component";
import { Subscription, first } from 'rxjs';
import { EntryEntity, Frame, MenuWithSubMenu, RenderDashRqPayload, SessionStorageData } from 'src/app/@types';
import { DashboardService, MenuService, SnackbarService } from 'src/app/shared/service';
import { BIDEMO_INTERCORPVT_COM_DASHBOARD_TEST_SINGLELOAD, getDataFromSessionStorage, setThemColor } from 'src/app/shared/util';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private state$: any;
  public patient: EntryEntity;
  public src: SafeResourceUrl | null;
  private reportDataBehaviorSubjectSubscription: Subscription;
  private WorkFlowMenuDataBehaviorSubjectSubscription: Subscription;
  private smartAppSubmenuBehaviorSubjectSubscription: Subscription;
  public isTabFormVisible: boolean = false;
  public questionnaireForm: Array<any> = [];
  private sessionStorageData: SessionStorageData;
  public isResizeFrameVisible: boolean = false;
  public menuObject: MenuWithSubMenu | null;
  public isPlotlyReportVisible: boolean = false;

  constructor(private location: Location, private dashboardService: DashboardService,
    private menuService: MenuService, private sanitizer: DomSanitizer, private router: Router,
    private snackbarService: SnackbarService) {
    this.state$ = this.location.getState();
    if (this.state$.patient) {
      this.patient = this.state$.patient;
    } else {
      // router.navigate(['/patient']);
    }
  }

  ngOnInit(): void {
    this.reportDataBehaviorSubjectSubscription = this.dashboardService.renderDashPayloadBehaviorSubject.subscribe(res => {
      if (res) {
        this.src = null;
        this.isTabFormVisible = false;
        this.isResizeFrameVisible = false;
        this.isPlotlyReportVisible = true;
        setTimeout(() => {
          renderDash({ url_base_pathname: BIDEMO_INTERCORPVT_COM_DASHBOARD_TEST_SINGLELOAD }, 'dash-app', res);
        });
      } else {
        this.isPlotlyReportVisible = false;
      }
    });

    this.WorkFlowMenuDataBehaviorSubjectSubscription = this.dashboardService.WorkFlowMenuDataBehaviorSubject.subscribe(res => {
      if (res) {
        this.src = null;
        this.isResizeFrameVisible = false;
        this.showFrameForm(res.qInfo, res.type);
      } else {
        this.isTabFormVisible = false;
      }
    });

    this.sessionStorageData = getDataFromSessionStorage();
    const themeId = this.sessionStorageData.tenantUserLoginInfo?.themeId;
    if (themeId) {
      setThemColor(themeId);
    }

    this.smartAppSubmenuBehaviorSubjectSubscription = this.dashboardService.smartAppSubmenuBehaviorSubject.subscribe(res => {
      if (res) {
        this.src = null;
        this.isPlotlyReportVisible = false;
        this.isTabFormVisible = false;
        this.menuObject = res;
        this.isResizeFrameVisible = true;
      } else {
        this.menuObject = null;
        this.isResizeFrameVisible = false;
      }
    });
  }

  showFrameForm(qInfo: Frame, type: number) {
    this.isPlotlyReportVisible = false;
    this.src = null;
    if (!qInfo.f_type || (qInfo.f_type == "ExternalURL" && !qInfo.f_externalurl) || (qInfo.f_type == "App" && qInfo.f_desc == '[]')) {
      this.isTabFormVisible = false;
      this.snackbarService.openSnackBar("Frame definition not found", "Close", "error-snackbar");
    } else if (qInfo.f_type === "Report") {
      if (!qInfo.reportId) {
        this.snackbarService.openSnackBar("Frame definition not found", "Close", "error-snackbar");
        this.isTabFormVisible = false;
      } else {
        this.isPlotlyReportVisible = true;
        this.menuService.showFrameForm(qInfo.reportId).pipe(first()).subscribe({
          next: (data) => {
            const patientUserId = this.sessionStorageData.patientUserId;
            const themeId = this.sessionStorageData.tenantUserLoginInfo?.themeId
            const userType = this.sessionStorageData.tenantUserLoginInfo?.userType;
            const fhirId = this.sessionStorageData.tenantUserLoginInfo?.fhirId;
            if (patientUserId && themeId && data && qInfo.reportId) {
              const reqPayload: RenderDashRqPayload = {
                pId: patientUserId,
                rId: qInfo.reportId.toString(),
                rName: data[0].schemaName,
                themeId: themeId?.toString(),
                queryType: data[0].queryType,
                user: `${userType}/${fhirId}`
              }
              console.log(reqPayload);
              renderDash({ url_base_pathname: BIDEMO_INTERCORPVT_COM_DASHBOARD_TEST_SINGLELOAD }, 'dash-app', reqPayload);
            }
          },
          error: (error) => {
            console.log(error);
          }
        })
      }
    } else {
      this.src = null;
      let externalUrl;
      if (qInfo.f_externalurl) {
        externalUrl = JSON.stringify(qInfo.f_externalurl).replace(/\"/g, "");
        if (!qInfo.openInNewTab) {
          console.log("here...");
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(externalUrl);
        } else {
          window.open(externalUrl);
        }
      } else {
        this.isPlotlyReportVisible = false;
      }
      if (externalUrl === 'null' || externalUrl === "" || externalUrl === undefined) {
        this.isPlotlyReportVisible = false;
        if (type == 5) {
          const desc = JSON.parse(qInfo.f_desc);
          this.questionnaireForm = desc;
          this.isTabFormVisible = true;
          this.isResizeFrameVisible = false;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.reportDataBehaviorSubjectSubscription && this.reportDataBehaviorSubjectSubscription.closed;
    this.reportDataBehaviorSubjectSubscription && this.reportDataBehaviorSubjectSubscription.unsubscribe();
    this.WorkFlowMenuDataBehaviorSubjectSubscription && this.WorkFlowMenuDataBehaviorSubjectSubscription.closed;
    this.WorkFlowMenuDataBehaviorSubjectSubscription && this.WorkFlowMenuDataBehaviorSubjectSubscription.unsubscribe();
    this.smartAppSubmenuBehaviorSubjectSubscription && this.smartAppSubmenuBehaviorSubjectSubscription.closed;
    this.smartAppSubmenuBehaviorSubjectSubscription && this.smartAppSubmenuBehaviorSubjectSubscription.unsubscribe();
  }

}
