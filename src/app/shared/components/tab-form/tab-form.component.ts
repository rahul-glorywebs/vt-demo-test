import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FHIR_VERSION_R4, addSaveButtonOnLHCFormHeader, getDataFromSessionStorage, getPatientJson, setStyleToLHCForm } from '../../util';
import { LhcQuestionnaireService, PatientService, SnackbarService } from '../../service';
import { Patient, SessionStorageData } from 'src/app/@types';
import { first } from 'rxjs';

declare var LForms: any;

@Component({
  selector: 'app-tab-form',
  templateUrl: './tab-form.component.html',
  styleUrls: ['./tab-form.component.scss']
})
export class TabFormComponent implements OnInit, OnChanges {

  @Input('questionnaireFormData') public questionnaireForm: any;
  private sessionStorageData: SessionStorageData;
  private patient: Patient;
  constructor(private lhcQuestionnaireService: LhcQuestionnaireService, private patientService: PatientService,
    private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    this.sessionStorageData = getDataFromSessionStorage();
    const patientId = this.sessionStorageData.patientUserId;
    if (patientId) {
      this.patientService.getPatientById(patientId).pipe(first()).subscribe({
        next: (data) => {
          this.patient = getPatientJson(data);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.questionnaireForm.length === 1) {
      this.renderSingleForm(null, this.questionnaireForm[0]);
    } else {
      this.renderSingleForm(null, this.questionnaireForm[0]);
    }
    setTimeout(() => {
      const buttons = Array.from(document.getElementsByClassName('border-0 p-sm-2 rounded-3 w-25') as HTMLCollectionOf<HTMLElement>)
      buttons[0].classList.add("active");
    });
  }

  async renderSingleForm($event: any, questionnaireResponse: any) {
    this.removeActiveClass();
    if ($event) {
      $event.target.classList.add("active");
    }
    const formData = await LForms.Util.convertFHIRQuestionnaireToLForms(questionnaireResponse, FHIR_VERSION_R4);
    await LForms.Util.addFormToPage(formData, "questionnaireForm");

    const workFlowQuestionnaireFormDiv = document.getElementById("workFlowQuestionnaireFormDiv");
    if (workFlowQuestionnaireFormDiv) {
      if (this.questionnaireForm.length > 1) {
        workFlowQuestionnaireFormDiv.style.height = 'calc(100vh - 80px)';
      } else {
        workFlowQuestionnaireFormDiv.style.height = 'calc(100vh - 72px)';
      }
    }

    setTimeout(() => {
      setStyleToLHCForm();
      const footer = document.getElementById("footer-row");
      if (footer) {
        footer.style.display = "block";
      }
      const saveButton: HTMLElement = addSaveButtonOnLHCFormHeader();
      saveButton.addEventListener("click", () => {
        this.saveFormData(formData);
      });
    });
  }

  saveFormData(formData: any) {
    const patientJson = this.patient;
    const formContainer = document.getElementById("clinicalSmartApp");
    const formValidation = LForms.Util.checkValidity(formContainer);
    if (formValidation && formValidation.length !== 0) {
      this.snackBarService.openSnackBar("You must fill in all of the mandatory fields", "Close", "error-snackbar")
      return;
    }
    this.lhcQuestionnaireService.saveForm("questionnaireForm", patientJson, formData);
  }

  removeActiveClass() {
    const activeButton = document.querySelectorAll(".border-0.p-sm-2.rounded-3.w-25.active");
    [].forEach.call(activeButton, function (el: any) {
      el.classList.remove("active");
    });
  }
}
