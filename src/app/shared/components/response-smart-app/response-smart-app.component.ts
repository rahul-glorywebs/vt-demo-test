import { Component, Input, SimpleChanges } from '@angular/core';
import { FHIR_VERSION_R4, setStyleToLHCForm } from '../../util';

declare const LForms: any;

@Component({
  selector: 'app-response-smart-app',
  templateUrl: './response-smart-app.component.html',
  styleUrls: ['./response-smart-app.component.scss']
})
export class ResponseSmartAppComponent {

  @Input('questionnaireFormData') public questionnaireData: any;

  constructor() { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    const questionnaire = this.questionnaireData.questionnaire;
    const questionnaireResponse = this.questionnaireData.questionnaireresponse;
    const formData = LForms.Util.convertFHIRQuestionnaireToLForms(questionnaire, FHIR_VERSION_R4);
    const newFormData = (new LForms.LFormsData(formData));
    const mergeData = LForms.Util.mergeFHIRDataIntoLForms('QuestionnaireResponse', questionnaireResponse, newFormData, FHIR_VERSION_R4)
    LForms.Util.addFormToPage(mergeData, 'responseSmartApp');
    setTimeout(() => {
      setStyleToLHCForm();
      this.disableForm();
    }, 100);
  }

  disableForm() {
    const lhcFormBody = document.querySelector(".lhc-form-body") as HTMLElement;
    if (lhcFormBody) {
      const children = Array.from(lhcFormBody.children as HTMLCollectionOf<HTMLElement>);
      children.forEach((childEl: HTMLElement) => {
        childEl.style.pointerEvents = "none";
      })
    }
  }
}
