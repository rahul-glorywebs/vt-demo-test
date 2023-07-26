import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { EntryEntity, Patient } from 'src/app/@types';
import { QuestionnaireResponse } from 'src/app/@types/questionnaire-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  public patient: EntryEntity;
  constructor(private http: HttpClient) { }

  getPatientList() {
    return this.http.get<Patient>(`${environment.fHirUrl18008}/Patient/?_&_summary=true&_count=2000&_sort:asc=given`).pipe(map(data => {
      return data;
    }));
  }

  getAllQRByPatientId(patientId: string) {
    return this.http.get<any>(`${environment.fHirUrl}/QuestionnaireResponse?subject=Patient/${patientId}&_include=QuestionnaireResponse%3Aquestionnaire&_sort=-_lastUpdated`).pipe(map(data => {
      return data;
    }));
  }

  getAllQuestionnaire() {
    return this.http.get<QuestionnaireResponse>(`${environment.fHirUrl18008}/Questionnaire?_sort=title&status=active&_count=100`).pipe(map(data => {
      return data;
    }));
  }

  getEncountersByPatientId(patientId: string) {
    return this.http.get<QuestionnaireResponse>(`${environment.fHirUrl}/Encounter?_sort=-date&subject=Patient/${patientId}`).pipe(map(data => {
      return data;
    }));
  }

  getConsentsByPatientId(patientId: string) {
    return this.http.get<any>(`${environment.fHirUrl}/Consent?patient=${patientId}`).pipe(map(data => {
      return data;
    }));
  }

  getObservationsByPatientId(patientId: string) {
    return this.http.get<QuestionnaireResponse>(`${environment.fHirUrl}/Observation?_sort=-date&subject=Patient/${patientId}`).pipe(map(data => {
      return data;
    }));
  }

  getQuestionnaireBySubmenuTypeApp(questionnaireId: string, versionId: string) {
    return this.http.get<any>(`${environment.fHirUrl}/Questionnaire/${questionnaireId}/_history/${versionId}`).pipe(map(data => {
      return data;
    }));
  }

  getMedicationAdministrationByPatientId(patientId: string) {
    return this.http.get<any>(`${environment.fHirUrl}/MedicationAdministration?subject=Patient/${patientId}`).pipe(map(data => {
      return data;
    }));
  }

  updateConsent(consentId: string, data: any) {
    return this.http.put<any>(`${environment.fHirUrl}/Consent/${consentId}`, data).pipe(map(data => {
      return data;
    }));
  }

  saveConsent(data: any) {
    return this.http.post<any>(`${environment.fHirUrl}/Consent`, data).pipe(map(data => {
      return data;
    }));
  }

  getPatientById(patientId: string) {
    return this.http.get<Patient>(`${environment.fHirUrl}/Patient/${patientId}`).pipe(map(data => {
      return data;
    }));
  }

  getMedicationRequestByPatientId(patientId: string) {
    return this.http.get<any>(`${environment.fHirUrl}/MedicationRequest?subject=Patient/${patientId}`).pipe(map(data => {
      return data;
    }));
  }
}
