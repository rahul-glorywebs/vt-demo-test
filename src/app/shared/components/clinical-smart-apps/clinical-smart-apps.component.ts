import { Component, Input, SimpleChanges } from '@angular/core';
import { first } from 'rxjs';
import { Patient, SessionStorageData } from 'src/app/@types';
import { LhcQuestionnaireService, PatientService, SnackbarService } from '../../service';
import { FHIR_VERSION_R4, addSaveButtonOnLHCFormHeader, getDataFromSessionStorage, getPatientJson, setStyleToLHCForm } from '../../util';

declare const LForms: any;

@Component({
  selector: 'app-clinical-smart-apps',
  templateUrl: './clinical-smart-apps.component.html',
  styleUrls: ['./clinical-smart-apps.component.scss']
})
export class ClinicalSmartAppsComponent {

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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const formData = await LForms.Util.convertFHIRQuestionnaireToLForms(this.questionnaireForm, FHIR_VERSION_R4);
    await LForms.Util.addFormToPage(formData, "clinicalSmartApp");

    setTimeout(() => {
      setStyleToLHCForm();
      const saveButton: HTMLElement = addSaveButtonOnLHCFormHeader();
      saveButton.addEventListener("click", () => {
        this.saveFormData(formData);
      });
    }, 100);
  }

  saveFormData(formData: any) {
    const patientJson = this.patient;
    const formContainer = document.getElementById("clinicalSmartApp");
    const formValidation = LForms.Util.checkValidity(formContainer);
    if (formValidation && formValidation.length !== 0) {
      this.snackBarService.openSnackBar("You must fill in all of the mandatory fields", "Close", "error-snackbar")
      return;
    }
    this.lhcQuestionnaireService.saveForm("clinicalSmartApp", patientJson, formData);
  }
}
