import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, map } from 'rxjs';
import { Consents, MenuWithSubMenu, SmartSubMenuI } from 'src/app/@types';
import { DashboardService, PatientQuestionnaireService, PatientService } from '../../service';
import { MENU_TYPE_CONSENT, MENU_TYPE_SMART_APP, MENU_TYPE_SMART_APP_RESPONSE } from '../../util';

@Component({
  selector: 'app-resize-frame',
  templateUrl: './resize-frame.component.html',
  styleUrls: ['./resize-frame.component.scss']
})
export class ResizeFrameComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input("menu") menu: MenuWithSubMenu | null;
  public questionnaireForm: any;
  public consentFormData: Consents;
  public isConsentFormDataVisible: boolean = false;
  public isClinicalSmartAppsVisible: boolean = false;
  public isResponseSmartAppsVisible: boolean = false;
  public isNewConsentFormVisible: boolean = false;
  public consentCheckboxCheck: boolean = true;
  public filteredSmartAppSubmenu: Array<SmartSubMenuI> | undefined = [];
  public toggleActiveAndSearchInput: boolean = true;
  public subscription: Subscription;

  @ViewChild('searchInput', { read: ElementRef }) private searchInput: ElementRef;
  @ViewChild(SplitComponent) splitEl: SplitComponent
  @ViewChildren(SplitAreaDirective) areasEl: QueryList<SplitAreaDirective>

  public topContainerSize: number = 50;
  public bottomContainerSize: number = 50;

  constructor(private patientService: PatientService, private dashboardService: DashboardService,
    private patientQuestionnaireService: PatientQuestionnaireService) { }

  ngOnInit(): void {

  }

  async ngOnChanges() {
    this.isConsentFormDataVisible = false;
    this.isClinicalSmartAppsVisible = false;
    this.isResponseSmartAppsVisible = false;
    this.isNewConsentFormVisible = false;
    if (this.menu?.menuType === MENU_TYPE_CONSENT) {
      this.getSubMenuOfSmartAppConsent();
    } else {
      this.filteredSmartAppSubmenu = this.menu?.smartAppSubMenu;
    }
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
  }

  ngAfterViewInit(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
      const searchTerm: any = fromEvent<any>(this.searchInput.nativeElement, 'keyup').pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      );
      searchTerm.subscribe((term: string) => {
        if (this.menu) {
          this.filteredSmartAppSubmenu = this.menu.smartAppSubMenu?.filter((e) => e.name.toLowerCase().includes(term.toLowerCase()));
        }
      });
    }

    const splitGutter = document.querySelector(".as-split-gutter") as HTMLElement;
    splitGutter.style.display = "flex";
    splitGutter.style.flexDirection = "row";
    splitGutter.style.height = "10px";

    const splitGutterIcon = document.querySelector(".as-split-gutter-icon") as HTMLElement;
    splitGutterIcon.remove();

    const collapseUpButton = document.createElement("button");
    collapseUpButton.setAttribute("id", "collapse-up");
    collapseUpButton.setAttribute("class", "collapse-up");
    collapseUpButton.setAttribute("title", "Collapse Up");
    collapseUpButton.innerHTML = "&#10224;";
    splitGutter.appendChild(collapseUpButton);

    collapseUpButton.addEventListener("click", () => {
      this.topContainerSize = 10;
      this.bottomContainerSize = 90;
    });

    collapseUpButton.addEventListener("touchstart", () => {
      this.topContainerSize = 10;
      this.bottomContainerSize = 90;
    });

    const collapseDownButton = document.createElement("button");
    collapseDownButton.setAttribute("id", "collapse-down");
    collapseDownButton.setAttribute("class", "collapse-down");
    collapseDownButton.setAttribute("title", "Collapse Down");
    collapseDownButton.innerHTML = "&#10225;";
    splitGutter.appendChild(collapseDownButton);

    collapseDownButton.addEventListener("click", () => {
      this.topContainerSize = 90;
      this.bottomContainerSize = 10;
    });

    collapseDownButton.addEventListener("touchstart", () => {
      this.topContainerSize = 90;
      this.bottomContainerSize = 10;
    });

    const resetButton = document.createElement("button");
    resetButton.setAttribute("id", "expand-both");
    resetButton.setAttribute("class", "expand-both");
    resetButton.setAttribute("title", "Expand-both");
    resetButton.innerHTML = "&#8635;";
    splitGutter.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      this.topContainerSize = 50;
      this.bottomContainerSize = 50;
    });

    resetButton.addEventListener("touchstart", () => {
      this.topContainerSize = 50;
      this.bottomContainerSize = 50;
    });

    const buttons = Array.from(document.querySelectorAll('.as-split-gutter > button')) as HTMLElement[];
    buttons.forEach((button) => {
      button.style.border = "0";
      button.style.fontSize = "10px";
      button.style.padding = "0 6px";
      button.style.margin = "0";
      button.style.lineHeight = "2";
      button.style.background = "transparent";
    });
  }

  onclickMenu($event: any, menu: any, index: number) {
    this.isConsentFormDataVisible = false;
    this.isClinicalSmartAppsVisible = false;
    this.isResponseSmartAppsVisible = false;
    this.isNewConsentFormVisible = false;

    if (menu.type === MENU_TYPE_SMART_APP) {
      this.showSavedQuestionnaire(menu.data)
    } else if (menu.type === MENU_TYPE_SMART_APP_RESPONSE) {
      this.showSavedQQR(menu.data);
    } else if (menu.type === MENU_TYPE_CONSENT) {
      this.openConsentById(menu.data);
    }

    this.toggleActiveInactiveSubmenu(index);
  }

  addNewConsent() {
    this.isConsentFormDataVisible = false;
    this.isClinicalSmartAppsVisible = false;
    this.isResponseSmartAppsVisible = false;
    this.isNewConsentFormVisible = false;
    this.isNewConsentFormVisible = true;
  }

  showSavedQuestionnaire(data: any) {
    const questionnaireId = data.fhirId;
    const versionId = data.appVersion;
    this.patientService.getQuestionnaireBySubmenuTypeApp(questionnaireId, versionId).pipe(first()).subscribe({
      next: (data) => {
        this.questionnaireForm = data;
        this.isClinicalSmartAppsVisible = true;
      },
      error: (error) => {
        this.isClinicalSmartAppsVisible = false;
        this.questionnaireForm = null;
        console.log(error);
      }
    })
  }

  showSavedQQR(data: any) {
    if (data) {
      this.questionnaireForm = data;
      this.isResponseSmartAppsVisible = true;
    } else {
      this.questionnaireForm = null;
      this.isResponseSmartAppsVisible = false;
    }
  }

  openConsentById(data: any) {
    this.dashboardService.consent(data.id).pipe(first()).subscribe({
      next: (data) => {
        this.consentFormData = data;
        this.isConsentFormDataVisible = true;
      },
      error: (error) => {
        this.isConsentFormDataVisible = false;
        console.log(error);
      }
    })
  }

  onChangeCheckBox($event: any) {
    this.consentCheckboxCheck = $event.checked;
    if (this.menu) {
      if (this.consentCheckboxCheck) {
        this.filteredSmartAppSubmenu = this.menu?.smartAppSubMenu?.filter((e) => e.data.status === "active");
      } else {
        this.filteredSmartAppSubmenu = this.menu?.smartAppSubMenu?.filter((e) => e.data.status === "inactive");
      }
    }
  }

  toggleActiveInactiveSubmenu(index: number) {
    this.removeActiveActiveClass()
    const buttons = document.querySelectorAll(".btn-menu");
    [].forEach.call(buttons, function (el: any) {
      el.classList.remove("active");
    });
    const button = document.getElementById("btn-" + index);
    button?.classList.add("active");
  }

  removeActiveActiveClass() {
    const buttons = document.querySelectorAll(".btn-menu.active");
    [].forEach.call(buttons, function (el: any) {
      el.classList.remove("active");
    });
  }

  getTitleText(menu: any): string {
    if (menu.type === MENU_TYPE_SMART_APP_RESPONSE && menu.data.updatedAt) {
      return menu.name + " - " + menu.data.updatedAt;
    } else if (menu.type === MENU_TYPE_CONSENT) {
      return menu.name + " | " + menu.data.provisionType + " | " + menu.data.status + " - " + "Start Date:" + menu.data.start + " End Date:" + menu.data.end
    } else {
      return "";
    }
  }

  getSubMenuOfSmartAppConsent() {
    this.subscription = this.patientQuestionnaireService.consentsByPatientSubject.pipe().subscribe({
      next: (data) => {
        const smartAppSubMenu: Array<SmartSubMenuI> = [];
        if (data) {
          data.forEach((e: any) => {
            smartAppSubMenu?.push({
              id: e.id,
              name: e.practitionerName,
              data: e,
              type: MENU_TYPE_CONSENT
            });
          });
          if (this.menu?.smartAppSubMenu) {
            this.menu.smartAppSubMenu = smartAppSubMenu;
            if (this.menu?.smartAppSubMenu?.length === 0) {
              this.toggleActiveAndSearchInput = false;
            } else {
              this.toggleActiveAndSearchInput = true;
            }
            this.filteredSmartAppSubmenu = this.menu?.smartAppSubMenu?.filter((e) => e.data.status === "active");
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.isConsentFormDataVisible = false;
    this.isClinicalSmartAppsVisible = false;
    this.isResponseSmartAppsVisible = false;
    this.isNewConsentFormVisible = false;
    this.subscription && this.subscription.closed;
    this.subscription && this.subscription.unsubscribe();
  }
}
