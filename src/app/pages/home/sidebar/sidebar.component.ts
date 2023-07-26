import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map } from 'rxjs/operators';
import { EntryEntity, Frame, MenuWithSubMenu, RenderDashRqPayload, ReportSubMenu, SessionStorageData, SmartSubMenuI, UserWiseMenuWiseAccessDetailsRqPayload, WorkFlowSubMenu } from 'src/app/@types';
import { DashboardService, MenuService, PatientQuestionnaireService } from 'src/app/shared/service';
import { MENU_TYPE_SMART_APP, MENU_TYPE_SMART_APP_RESPONSE, getDataFromSessionStorage } from 'src/app/shared/util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('selectedPatient') patient: EntryEntity | null;
  @ViewChild('menuSearchInput', { read: ElementRef }) private menuSearchInput: ElementRef;

  private sessionStorageData: SessionStorageData;
  private questionnaireResponseSubjectSubscription: Subscription;
  private consentsByPatientSubjectSubscription: Subscription;
  public menus: Array<MenuWithSubMenu> = [];
  public filteredMenus: Array<MenuWithSubMenu> = [];
  public removeCollapsedClass: boolean = false;

  constructor(private menuService: MenuService, private dashboardService: DashboardService,
    private patientQuestionnaireService: PatientQuestionnaireService) { }

  ngOnInit(): void {
    this.patient && sessionStorage.setItem("patientUserId", this.patient.resource.id);
    this.sessionStorageData = getDataFromSessionStorage();
    this.setInitialValueToSubject();
    const userAllMenuAccessResponse2 = this.sessionStorageData.userAllMenuAccessResponse2;
    if (userAllMenuAccessResponse2) {
      this.menus = userAllMenuAccessResponse2;
      this.filteredMenus = userAllMenuAccessResponse2;
    }
  }

  ngAfterViewInit(): void {
    const menuToggleButtons = Array.from(document.getElementsByClassName("button-toggle-menu") as HTMLCollectionOf<HTMLButtonElement>);
    menuToggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(".left-side-wrap")?.classList.toggle("side-menu-open");
        document.querySelector(".right-side-wrap")?.classList.toggle("open-sidebar-menu");
        document.querySelector(".top-menu-wrap")?.classList.toggle("open-sidebar-menu");
      });
    });

    const menuCloseButtons = Array.from(document.getElementsByClassName("button-toggle-menu-close") as HTMLCollectionOf<HTMLButtonElement>);
    menuCloseButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", () => {
        document.querySelector(".left-side-wrap")?.classList.remove("side-menu-open");
        document.querySelector(".right-side-wrap")?.classList.remove("open-sidebar-menu");
        document.querySelector(".top-menu-wrap")?.classList.remove("open-sidebar-menu");
      })
    });

    this.menuSearchInput.nativeElement.value = "";
    const searchTerm = fromEvent<any>(this.menuSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged()
    );
    searchTerm.subscribe(term => {
      if (term) {
        this.removeCollapsedClass = true;
      } else {
        this.removeCollapsedClass = false;
      }
      this.filteredMenus = this.filterWorkflowAndReportMenus(term, this.menus);
    });
  }

  renderSmartAppSubMenu(menu: MenuWithSubMenu, index: number) {
    this.removeActiveClass();
    this.removeActiveClass();
    this.removeSmartAppMenuActiveClass();
    const a = document.getElementById(`smart-app-menu-${index}`);
    a?.classList.remove("collapsed");
    switch (menu.menuType) {
      case "Apps":
        this.getTenantQuestionnaire(menu);
        return;
      case "Responses":
        this.getMenuFromQuestionnaireResponse(menu);
        return;
      case "Consents":
        this.getMenuConsentsByPatientId(menu);
        return;
      default:
        return
    }
  }

  getTenantQuestionnaire(menu: MenuWithSubMenu) {
    const tenantId = this.sessionStorageData.tenantUserLoginInfo?.tenantId;
    const userId = this.sessionStorageData.tenantUserLoginInfo?.id;
    if (tenantId) {
      this.menuService.getTenantQuestionnaire({ tenantId }).pipe(first()).subscribe({
        next: (data) => {
          const menuTypeAppQuestionnaire = data;
          if (data && tenantId && userId) {
            const requestPayload: UserWiseMenuWiseAccessDetailsRqPayload = {
              tenantId: tenantId,
              menuId: menu.id,
              menuType: menu.menuType,
              userId: userId,
            }

            const smartAppSubMenu: Array<SmartSubMenuI> = [];
            this.menuService.getUserWiseMenuWiseAccessDetails(requestPayload).subscribe({
              next: (data) => {
                menuTypeAppQuestionnaire.filter(appMenu => {
                  data.filter(data => {
                    if (data.typeId.toString() === appMenu.fhirId) {
                      smartAppSubMenu.push({
                        id: appMenu.id,
                        name: appMenu.appTitle,
                        data: appMenu,
                        type: MENU_TYPE_SMART_APP
                      });
                    }
                  });
                });
                const menuObj = {
                  ...menu,
                  smartAppSubMenu
                }
                this.dashboardService.smartAppSubmenuBehaviorSubject.next(menuObj);
              },
              error: (error) => {
                console.log(error);
              }
            });
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  getMenuFromQuestionnaireResponse(menu: MenuWithSubMenu) {
    const smartAppSubMenu: Array<SmartSubMenuI> = [];
    this.questionnaireResponseSubjectSubscription = this.patientQuestionnaireService.questionnaireResponseSubject.pipe().subscribe({
      next: (data) => {
        if (data) {
          data.forEach((e: any) => {
            smartAppSubMenu.push({
              id: e.resId,
              name: e.resName,
              data: e,
              type: MENU_TYPE_SMART_APP_RESPONSE
            });
          });
          const menuObj = {
            ...menu,
            smartAppSubMenu
          }
          this.dashboardService.smartAppSubmenuBehaviorSubject.next(menuObj);
        }
      }
    });
  }

  getMenuConsentsByPatientId(menu: MenuWithSubMenu) {
    const smartAppSubMenu: Array<SmartSubMenuI> = [];
    const menuObj = {
      ...menu,
      smartAppSubMenu
    }
    this.dashboardService.smartAppSubmenuBehaviorSubject.next(menuObj);
  }

  onClickReportSubmenu($event: any, reportSubMenu: ReportSubMenu) {
    this.setInitialValueToSubject();
    this.toggleActiveInactive(null, $event);
    this.removeSmartAppMenuActiveClass();
    this.showReportData(reportSubMenu);
  }

  showReportData(data: any) {
    const patientId = this.sessionStorageData.patientUserId;
    const themeId = this.sessionStorageData.tenantUserLoginInfo?.themeId;
    const userType = this.sessionStorageData.tenantUserLoginInfo?.userType;
    const fhirId = this.sessionStorageData.tenantUserLoginInfo?.fhirId;

    if (patientId && themeId && data) {
      const reqPayload: RenderDashRqPayload = {
        pId: patientId,
        rId: data.id.toString(),
        rName: data.schemaName,
        themeId: themeId?.toString(),
        queryType: data.queryType,
        user: `${userType}/${fhirId}`
      }
      this.dashboardService.renderDashPayloadBehaviorSubject.next(reqPayload);
    }
  }

  showForm($event: any, qInfo: Frame, type: number, aTagRef: HTMLElement) {
    this.removeActiveClass();
    this.removeSmartAppMenuActiveClass();
    const attributeValue = aTagRef.getAttribute("href");
    const aTag = document.querySelector(`a[href='${attributeValue}']`);
    aTag?.classList.add("active");
    $event.stopPropagation();
    this.toggleActiveInactiveSubmenu($event)
    this.setInitialValueToSubject();
    this.dashboardService.WorkFlowMenuDataBehaviorSubject.next({ qInfo, type });
  }

  toggleActiveInactive(aTagRef: HTMLElement | null, $event: any) {
    this.removeActiveClass();
    if (aTagRef) {
      const attributeValue = aTagRef.getAttribute("href");
      const aTag = document.querySelector(`a[href='${attributeValue}']`);
      aTag?.classList.add("active");
    } else if ($event) {
      $event.target.className = "active";
    }
  }

  toggleActiveInactiveSubmenu($event: any) {
    this.setInitialValueToSubject();
    const liTags = document.querySelectorAll(".active.sub-menu-level-3");
    [].forEach.call(liTags, function (el: any) {
      el.classList.remove("active");
    });
    $event.target.className = "active sub-menu-level-3";
  }

  removeActiveClass() {
    const liTags = document.querySelectorAll(".active");
    [].forEach.call(liTags, function (el: any) {
      el.classList.remove("active");
    });
  }


  setInitialValueToSubject() {
    this.dashboardService.renderDashPayloadBehaviorSubject.next(null);
    this.dashboardService.WorkFlowMenuDataBehaviorSubject.next(null);
    this.dashboardService.smartAppSubmenuBehaviorSubject.next(null);
  }

  filterWorkflowAndReportMenus(searchText: string, menuItems: Array<MenuWithSubMenu>) {
    let filteredData: Array<MenuWithSubMenu> = [];
    if (!searchText.trim() || searchText !== '') {
      menuItems.forEach((menu) => {
        if (menu.menuName.toLowerCase().includes(searchText.toLowerCase())) {
          filteredData.push(menu)
        } else {
          if (menu.reports) {
            let reportList = menu.reports.filter((report) => report.reportName.toLowerCase().includes(searchText.toLowerCase()))
            if (reportList.length > 0) {
              let filteredMenu = { ...menu }
              filteredMenu.reports = reportList
              filteredData.push(filteredMenu)
            }
          }
          if (menu.workFlowSubMenus) {
            let tempWorkFlow: Array<WorkFlowSubMenu> = []
            let filteredMenu = { ...menu }
            menu.workFlowSubMenus.forEach((workFlow) => {
              if (workFlow.w_name.toLowerCase().includes(searchText.toLowerCase())) {
                tempWorkFlow.push(workFlow)
              } else {
                let frameList = workFlow.frames.filter((frame) => frame.f_name.toLowerCase().includes(searchText.toLowerCase()))
                if (frameList.length > 0) {
                  let filteredWorkFlow = { ...workFlow }
                  filteredWorkFlow.frames = frameList
                  tempWorkFlow.push(filteredWorkFlow)
                }
              }
            });
            filteredMenu.workFlowSubMenus = tempWorkFlow
            if (tempWorkFlow.length > 0) {
              filteredData.push(filteredMenu)
            }
          }
        }
      });
    } else {
      filteredData = menuItems
    }
    return filteredData;
  }

  removeSmartAppMenuActiveClass() {
    const activeEle = document.querySelectorAll(".side-nav-link.margin-left-19");
    [].forEach.call(activeEle, function (el: any) {
      el.classList.add("collapsed");
    });
  }

  ngOnDestroy(): void {
    this.setInitialValueToSubject();
    this.questionnaireResponseSubjectSubscription && this.questionnaireResponseSubjectSubscription.closed;
    this.questionnaireResponseSubjectSubscription && this.questionnaireResponseSubjectSubscription.unsubscribe();
    this.consentsByPatientSubjectSubscription && this.consentsByPatientSubjectSubscription.closed;
    this.consentsByPatientSubjectSubscription && this.consentsByPatientSubjectSubscription.unsubscribe();
  }

}

