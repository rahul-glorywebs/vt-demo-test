import { Injectable } from '@angular/core';
import { BehaviorSubject, first } from 'rxjs';
import { ConsentByPatientWithPractitionerName, EntryEntity, Practitioner } from 'src/app/@types';
import { findQuestionnaire, getPractitionerName, getQName, sortData } from '../util';
import { PatientService } from './patient.service';
import { PractitionerService } from './practitioner.service';

@Injectable({
  providedIn: 'root'
})
export class PatientQuestionnaireService {

  public questionnaireResponseSubject = new BehaviorSubject<any>(null);
  public consentsByPatientSubject = new BehaviorSubject<Array<ConsentByPatientWithPractitionerName> | null>(null);

  constructor(private patientService: PatientService, private practitionerService: PractitionerService) { }

  getAllQuestionnaireResponseByPatientId(selectedPatient: EntryEntity) {
    const patientId = selectedPatient.resource.id;
    this.patientService.getAllQRByPatientId(patientId).subscribe({
      next: (data) => {
        let fhirResults = [];
        let listSavedQR: any = [];
        if (data && data.resourceType == "Bundle" && data.type == "searchset" && data.entry) {
          data.entry.map((entry: any) => {
            var qr = entry.resource;
            if (qr.resourceType === "QuestionnaireResponse") {
              var updated;
              if (qr.meta && qr.meta.lastUpdated) {
                updated = new Date(qr.meta.lastUpdated).toString();
              } else if (qr.authored) {
                updated = new Date(qr.authored).toString();
              }
              var q = null, qName = null;
              var qRefURL = (qr.questionnaire && qr.reference) ? qr.questionnaire.reference : qr.questionnaire;
              if (qRefURL) {
                var qId = qRefURL.slice("Questionnaire".length + 1);
                q = findQuestionnaire(data, qId);
              }
              // if the questionnaire resource is included/found in the searchset
              if (q) {
                qName = getQName(q);
                var sdcPattern = new RegExp('http://hl7.org/fhir/u./sdc/StructureDefinition/sdc-questionnaire\\|(\\d+\.?\\d+)');
                var extension = null;
                if (qr.meta && qr.meta.profile) {
                  for (var j = 0, jLen = qr.meta.profile.length; j < jLen; j++) {
                    if (qr.meta.profile[j].match(sdcPattern)) {
                      extension = "SDC"
                    }
                  }
                }
                fhirResults.push(q);
                listSavedQR.push({
                  resId: qr.id,
                  resName: qName,
                  updatedAt: updated,
                  resType: "QuestionnaireResponse",
                  questionnaire: q,
                  questionnaireresponse: qr,
                  extensionType: extension,
                  resTypeDisplay: extension ? "QuestionnaireResponse (SDC)" : "QuestionnaireResponse"
                });
              }
            }
          });
          listSavedQR = sortData(listSavedQR, "resName");
          this.questionnaireResponseSubject.next(listSavedQR);
        } else {
          this.questionnaireResponseSubject.next(null);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getConsentsByPatientId(selectedPatient: EntryEntity) {
    const patientId = selectedPatient.resource.id;
    let practitioner: Practitioner;

    this.practitionerService.getAllPractitioner().pipe(first()).subscribe({
      next: (data) => {
        practitioner = data;
        this.patientService.getConsentsByPatientId(patientId).subscribe({
          next: (data) => {
            const listConsentByPatient = [];
            const listConsentByPatientWithPractitioner: Array<ConsentByPatientWithPractitionerName> = [];
            let listConsentByPatientWithPractitionerCheckbox: Array<ConsentByPatientWithPractitionerName> = [];
            if (data && data.resourceType == "Bundle" && data.type == "searchset" &&
              data.entry) { // searchset bundle
              for (let i = 0, iLen = data.entry.length; i < iLen; i++) {
                listConsentByPatient.push(data.entry[i]);
                const listConsentByPatientWithPractitionerName: ConsentByPatientWithPractitionerName = {
                  id: data.entry[i].resource.id,
                  provisionType: data.entry[i].resource.provision.type,
                  status: data.entry[i].resource.status,
                  start: data.entry[i].resource.provision.period.start,
                  end: data.entry[i].resource.provision.period.end,
                  practitionerName: getPractitionerName(data.entry[i].resource.provision.actor[0].reference.reference, practitioner.entry)
                };
                listConsentByPatientWithPractitioner.push(listConsentByPatientWithPractitionerName);
              }
              listConsentByPatientWithPractitionerCheckbox = sortData(listConsentByPatientWithPractitioner, 'practitionerName');
              this.consentsByPatientSubject.next(listConsentByPatientWithPractitionerCheckbox);
            } else {
              this.consentsByPatientSubject.next(listConsentByPatientWithPractitionerCheckbox)
            }
          },
          error: (error) => {
            this.consentsByPatientSubject.next(null);
            console.log(error);
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}