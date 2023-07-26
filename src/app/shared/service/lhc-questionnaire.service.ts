import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import * as FHIR from 'fhirclient';
import { EntryEntity, Patient, SessionStorageData } from 'src/app/@types';
import { environment } from 'src/environments/environment';
import { PatientQuestionnaireService, SnackbarService } from '.';
import { FHIR_VERSION_R4, getDataFromSessionStorage } from '../util';

declare var LForms: any;

@Injectable({
  providedIn: 'root'
})
export class LhcQuestionnaireService {

  private patientObj: EntryEntity | null;
  private state$: any;
  private sessionStorageData: SessionStorageData;

  constructor(private location: Location, private patientQuestionnaireService: PatientQuestionnaireService,
    private snackbarService: SnackbarService) {
    this.state$ = this.location.getState();
    if (this.state$) {
      this.patientObj = this.state$.patient;
    } else {
      this.sessionStorageData = getDataFromSessionStorage();
      this.patientObj = this.sessionStorageData.patient;
    }
  }

  async saveForm(containerId: string, patient: Patient, formData: any) {
    patient
    const formContainer = document.getElementById(containerId);
    const resArray = LForms.Util.getFormFHIRData("QuestionnaireResponse",
      FHIR_VERSION_R4, formContainer, {
      extract: true,
      subject: patient
    });

    const qr = resArray.shift();
    const questionnaireId = formData.id;
    const qData = { id: questionnaireId };
    const qExists = true;
    await this.createQQRObs(qData, qr, resArray, qExists);
    const btnSV = document.getElementById('save-button') as HTMLElement;
    btnSV.style.display = 'none';
    this.snackbarService.openSnackBar("Form data Saved", "Close", "success-snackbar");
    if (this.patientObj) {
      this.patientQuestionnaireService.getAllQuestionnaireResponseByPatientId(this.patientObj);
    }
  }

  async createQQRObs(q: any, qr: any, obsArray: any, qExists: boolean) {
    // Build a FHIR transaction bundle to create these resources.
    const bundle: any = {
      resourceType: "Bundle",
      type: "transaction",
      entry: []
    };

    bundle.entry.push({
      resource: qr,
      request: {
        method: "POST",
        url: "QuestionnaireResponse"
      }
    });

    obsArray.forEach((element: any) => {
      bundle.entry.push({
        resource: element,
        request: {
          method: "POST",
          url: "Observation"
        }
      });
    });

    async function withQuestionnaire(q: any) {
      // Set the questionnaire reference in the response    
      setQRRefToQ(qr, q);
      const fhIr = FHIR.client(`${environment.fHirUrl}`);
      return await fhIr.request({
        url: '', method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle)
      });
    }

    if (qExists) {
      return await withQuestionnaire(q).then((bundleResp: any) => [bundleResp], (error: any) => [error]);
    } else {
      const fhIrUrl = FHIR.client(`${environment.fHirUrl}`);
      return await fhIrUrl.create(q).then((qResp: any) => {
        return withQuestionnaire(qResp).then((bundleResp: any) => [qResp, bundleResp],
          (error: any) => [qResp, error]);
      });
    }
  }
}

function setQRRefToQ(qrData: any, qData: any) {
  const qID = qData.id;
  qrData.questionnaire = "Questionnaire/" + qID;
}
