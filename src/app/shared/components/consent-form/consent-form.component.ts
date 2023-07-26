import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { CodingEntity, ConfirmDialogProps, Consents, EntryEntity, SessionStorageData } from 'src/app/@types';
import { QrCoding, QuestionnaireResponse } from 'src/app/@types/questionnaire-response';
import { ConfirmDialogService, PatientQuestionnaireService, PatientService, SnackbarService } from '../../service';
import { PractitionerService } from '../../service/practitioner.service';
import { consentJson, getActorName, getDataFromSessionStorage, sortData } from '../../util';

@Component({
  selector: 'app-consent-form',
  templateUrl: './consent-form.component.html',
  styleUrls: ['./consent-form.component.scss'],
})
export class ConsentFormComponent implements OnInit, OnChanges {
  @Input('consentFormData') consentFormData: Consents;
  @Input('isNewFormVisible') isNewFormVisible: boolean;

  public consentForm: FormGroup;
  public minDate: string;
  public isDisabled: boolean;
  public practitionerList: Array<any>;
  private state$: any;
  public patient: EntryEntity | null;
  private sessionStorageData: SessionStorageData;
  public encounterDataList: Array<any>;
  public laboratoryResult: Array<CodingEntity>;
  public snomedCT: Array<CodingEntity>;
  public showButton: boolean;
  public showSaveButton: boolean;
  public status: boolean;
  public headerTitle: string;
  private medicationsRequest: Array<CodingEntity> = [];
  private medicationsAdministration: Array<CodingEntity> = [];
  public combinedMedication: Array<CodingEntity> = [];

  @ViewChild('startDate') public startDate: ElementRef;
  @ViewChild('endDate') public endDate: ElementRef;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private practitioner: PractitionerService,
    private patientService: PatientService,
    private patientQuestionnaireService: PatientQuestionnaireService,
    private confirmDialogService: ConfirmDialogService,
    private snackbarService: SnackbarService
  ) {
    this.state$ = this.location.getState();
    if (this.state$) {
      this.patient = this.state$.patient;
    }
    this.sessionStorageData = getDataFromSessionStorage();
  }

  ngOnInit(): void { }

  async ngOnChanges(changes: SimpleChanges) {
    this.patient = this.state$.patient;
    this.minDate = new Date().toISOString().split('T')[0];
    this.formInit();
    this.getPractitionerList();
    this.getEncounterList();
    this.getObservationByPatientId();
    await this.medicationRequestByPatientId();
    await this.medicationAdministrationByPatientId();
    if (this.consentFormData && !this.isNewFormVisible) {
      this.status = this.consentFormData.status === "active" ? true : false;
      if (this.status) {
        this.headerTitle = "Update Consent";
      } else {
        this.headerTitle = "Inactive Consent";
      }
      setTimeout(() => {
        this.setDataIntoForm();
      }, 1000)
      this.showSaveButton = false;
    }
    if (this.isNewFormVisible) {
      this.headerTitle = "New Consent";
      this.formInit();
      this.addEncounter();
      this.addLaboratory();
      this.addMedication();
      this.addSnomedCTCode();
      this.showSaveButton = true;
      this.status = true;
    }
  }

  formInit() {
    this.consentForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      provisionType: ['deny', Validators.required],
      actor: ['', Validators.required],
      encounters: this.formBuilder.array([]),
      laboratoryResults: this.formBuilder.array([]),
      snomedCTCode: this.formBuilder.array([]),
      rxnormCode: this.formBuilder.array([]),
    });
  }

  //  Encounters add & remove function
  private newEncounters(): FormGroup {
    return this.formBuilder.group({
      encounter: [null],
    });
  }

  //  Add Fields
  addEncounter(): void {
    this.encounters.push(this.newEncounters());
  }

  //  Remove Fields
  removeEncounter(index: number): void {
    this.encounters.removeAt(index);
  }

  //  Fields Array
  get encounters(): FormArray {
    return this.consentForm.controls['encounters'] as FormArray;
  }

  //  Laboratory Results add & remove function
  private newLaboratory(): FormGroup {
    return this.formBuilder.group({
      loincCode: [null],
    });
  }

  //  Add Fields
  addLaboratory(): void {
    this.laboratoryResults.push(this.newLaboratory());
  }

  //  Remove Fields
  removeLaboratory(index: number): void {
    this.laboratoryResults.removeAt(index);
  }

  //  Fields Array
  get laboratoryResults(): FormArray {
    return this.consentForm.controls['laboratoryResults'] as FormArray;
  }

  //  National/International Clinical Coding add & remove function
  private newSnomedCTCode(): FormGroup {
    return this.formBuilder.group({
      clinicalCode: [null],
    });
  }

  //  Add Fields
  addSnomedCTCode(): void {
    this.snomedCTCode.push(this.newSnomedCTCode());
  }

  //  Remove Fields
  removeSnomedCTCode(index: number): void {
    this.snomedCTCode.removeAt(index);
  }

  //  Fields Array
  get snomedCTCode(): FormArray {
    return this.consentForm.controls['snomedCTCode'] as FormArray;
  }

  //  Rxnorm Coding add & remove function
  private newRxnormCode(): FormGroup {
    return this.formBuilder.group({
      rxCode: [null],
    });
  }

  //  Add Fields
  addMedication(): void {
    this.rxnormCode.push(this.newRxnormCode());
  }

  //  Remove Fields
  removeMedication(index: number): void {
    this.rxnormCode.removeAt(index);
  }

  //  Fields Array
  get rxnormCode(): FormArray {
    return this.consentForm.controls['rxnormCode'] as FormArray;
  }

  getPractitionerList() {
    this.practitioner
      .getAllPractitioner()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.practitionerList = data.entry.map((e) => {
            return {
              ...e,
              actorName: getActorName(e)
            }
          })
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getEncounterList() {
    if (this.patient) {
      this.getEncountersByPatientId(this.patient)
    } else {
      this.patient = this.sessionStorageData.patient;
      if (this.patient) {
        this.getEncountersByPatientId(this.patient)
      }
    }
  }

  getObservationByPatientId() {
    const patient: EntryEntity | null = this.patient
    if (patient) {
      this.patientService.getObservationsByPatientId(patient.resource.id).subscribe({
        next: (data) => {
          this.getLaboratoryResults(data);
          this.getSnomedCTCode(data);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  getLaboratoryResults(data: QuestionnaireResponse) {
    let getLaboratoryResultsList: Array<QrCoding> = [];
    for (let lineCode of data.entry) {
      if (lineCode.resource.code) {
        let lineCodeList: any = lineCode.resource.code
        for (let codeName of lineCodeList.coding) {
          getLaboratoryResultsList.push(codeName)
        }
      }
    }
    const uniqueArr = getLaboratoryResultsList.filter(
      function (v, i, a) {
        return a.findIndex(
          function (t) {
            return (JSON.stringify(t) === JSON.stringify(v))
          }
        )
          === i
      }
    )
    this.laboratoryResult = sortData(uniqueArr, "display");
  }

  getEncountersByPatientId(patient: any) {
    this.patientService.getEncountersByPatientId(patient.resource.id).subscribe({
      next: (data) => {
        if (data && data.entry) {
          this.encounterDataList = data.entry.map((e) => {
            return {
              ...e,
              start: e.resource?.period?.start,
              subject: e.resource?.participant && e.resource.participant[0].individual.display,
              service: e.resource?.serviceProvider?.display,
              encounter: e.fullUrl.substring(e.fullUrl.length - 15)
            }
          });
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getSnomedCTCode(data: QuestionnaireResponse) {
    let snomedCTCode: Array<QrCoding> = [];
    if (data && data.entry) {
      for (let test of data.entry) {
        let demo: any = test.resource
        if (demo.valueCodeableConcept) {
          const tempcode2 = demo.valueCodeableConcept.coding[0].code;
          const index1 = snomedCTCode.findIndex(function (x) { return x.code == tempcode2 });
          index1 === -1 ? snomedCTCode.push(demo.valueCodeableConcept.coding[0]) : ''
        }
        const uniqueArr = snomedCTCode.filter(
          function (v, i, a) {
            return a.findIndex(
              function (t) {
                return (JSON.stringify(t) === JSON.stringify(v))
              }
            )
              === i
          }
        )
        snomedCTCode = sortData(uniqueArr, "display");
      }
      this.snomedCT = snomedCTCode
    }
  }

  async medicationRequestByPatientId() {
    let listRxnormCode: any[] = [];
    const patientId = this.patient?.resource.id;
    if (patientId) {
      await this.patientService.getMedicationRequestByPatientId(patientId).subscribe({
        next: (data) => {
          if (data && data.resourceType == "Bundle" && data.type == "searchset" && data.entry) {
            for (let e of data.entry) {
              if (e.resource.medicationCodeableConcept) {
                const tempCode = e.resource.medicationCodeableConcept.coding[0].code;
                const index = listRxnormCode.findIndex(function (x) { return x.code == tempCode });
                index === -1 ? listRxnormCode.push(e.resource.medicationCodeableConcept.coding[0]) : '';
              }
            }
            var uniqueArr = listRxnormCode.filter(
              function (v, i, a) {
                return a.findIndex(
                  function (t) {
                    return (JSON.stringify(t) === JSON.stringify(v))
                  }
                )
                  === i
              }
            );
            listRxnormCode = uniqueArr;
            const sortedData = sortData(listRxnormCode, 'display');
            this.medicationsRequest = sortedData;
          }
          this.combineMedicationAdministrationAndRequest();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }

  async medicationAdministrationByPatientId() {
    let listRxnormCodeInAdministration: any[] = [];
    const patientId = this.patient?.resource.id;
    if (patientId) {
      await this.patientService.getMedicationAdministrationByPatientId(patientId).subscribe({
        next: (data) => {
          if (data && data.resourceType == "Bundle" && data.type == "searchset" && data.entry) {
            for (let e of data.entry) {
              if (e.resource.medicationCodeableConcept) {
                const tempCode = e.resource.medicationCodeableConcept.coding[0].code;
                const index = listRxnormCodeInAdministration.findIndex(function (x: any) { return x.code == tempCode });
                index === -1 ? listRxnormCodeInAdministration.push(e.resource.medicationCodeableConcept.coding[0]) : '';
              }
            }
            const uniqueArr = listRxnormCodeInAdministration.filter(
              function (v, i, a) {
                return a.findIndex(
                  function (t) {
                    return (JSON.stringify(t) === JSON.stringify(v))
                  }
                )
                  === i
              }
            );
            listRxnormCodeInAdministration = uniqueArr;
            const sortedData = sortData(listRxnormCodeInAdministration, 'display');
            this.medicationsAdministration = sortedData;
          }
          this.combineMedicationAdministrationAndRequest();
        },
        error: (error) => {
          console.error(error)
        }
      });
    }
  }

  combineMedicationAdministrationAndRequest() {
    this.combinedMedication = this.medicationsRequest.concat(this.medicationsAdministration);
    const uniqueArr = this.combinedMedication.filter(
      function (v, i, a) {
        return a.findIndex(
          function (t) {
            return (JSON.stringify(t) === JSON.stringify(v))
          }
        )
          === i
      }
    );
    this.combinedMedication = uniqueArr;
    const sortedData = sortData(this.combinedMedication, 'display');
    this.combinedMedication = sortedData;
  }

  dateConvert(str: string) {
    const date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  }

  onDateChange(type: string, event: any) {
    if (event.value) {
      if (type === 'startDate') {
        this.startDate.nativeElement.value = this.dateConvert(event.value);
      } else if (type === 'endDate') {
        this.endDate.nativeElement.value = this.dateConvert(event.value)
      }
    }
  }

  setDataIntoForm() {
    if (this.consentFormData.status === 'active') {
      this.isDisabled = false;
      this.showButton = true;
    } else {
      this.showButton = false;
      this.isDisabled = true;
    }

    const sDate = this.consentFormData.provision.period.start.split('-');
    const startDate = this.formatDate(sDate);
    const eDate = this.consentFormData.provision.period.end.split('-');
    const endDate = this.formatDate(eDate);
    const prRef = this.consentFormData.provision.actor[0].reference.reference
    const prId = prRef.split("/").slice(1, 2).join("/")

    if (this.consentFormData.provision.data) {
      const dataArray = this.consentFormData.provision.data;
      const refArray = []
      for (let i = 0, dataLength = dataArray.length; i < dataLength; i++) {
        refArray.push(dataArray[i].reference.reference)
      }
      refArray.map((e) => {
        this.encounters.push(
          this.formBuilder.group({
            encounter: e
          }));
      });
    } else {
      this.addEncounter();
    }

    if (this.consentFormData.provision.code && this.consentFormData.provision.code[0].coding) {
      const codeData = this.consentFormData.provision.code[0].coding;
      const temParrLo: any[] = [];
      const temParrSo: any[] = [];
      const temParRrx: any[] = [];

      codeData.forEach(element => {
        if (element.system.search('loinc') > -1) {
          temParrLo.push(element);
        }
        if (element.system.search('snomed') > -1) {
          temParrSo.push(element);
        }
        if (element.system.search('rxnorm') > -1) {
          temParRrx.push(element);
        }
      });

      //  laboratoryResults
      if (temParrLo.length !== 0) {
        temParrLo.map((e) => {
          this.laboratoryResults.push(
            this.formBuilder.group({
              loincCode: e.code
            }));
        });
      } else {
        this.addLaboratory();
      }

      // snomedCTCode
      if (temParrSo.length !== 0) {
        temParrSo.map((e) => {
          this.snomedCTCode.push(
            this.formBuilder.group({
              clinicalCode: e.code
            }));
        });
      } else {
        this.addSnomedCTCode();
      }

      //  rxnormCode
      if (temParRrx.length !== 0) {
        temParRrx.map((e) => {
          this.rxnormCode.push(
            this.formBuilder.group({
              rxCode: e.code
            }));
        });
      } else {
        this.addMedication();
      }
    } else {

      //  laboratoryResults
      this.addLaboratory();

      // snomedCTCode
      this.addSnomedCTCode();

      //  rxnormCode
      this.addMedication();
    }

    this.consentForm.get('startDate')?.setValue(startDate);
    this.consentForm.get('endDate')?.setValue(endDate);
    this.consentForm.get('actor')?.setValue(prId);

    this.startDate.nativeElement.value = this.consentForm.get('startDate')?.value;
    this.endDate.nativeElement.value = this.consentForm.get('endDate')?.value;

    this.consentForm.updateValueAndValidity();
  }

  getFormData() {
    let dataArray: any[] = [];
    for (let dataEncounter of this.consentForm.get('encounters')?.value) {
      let encounter = this.encounterDataList.filter((e) => 'Encounter' + '/' + e.resource.id === dataEncounter.encounter)
      for (let encounterData of encounter) {
        dataArray.push({
          "meaning": "dependents",
          "reference": { "reference": encounterData.encounter }
        })
      }
    }

    //for loinc
    let dataLoincArray = [];
    for (let dataLoinc of this.consentForm.get('laboratoryResults')?.value) {
      if (this.laboratoryResult) {
        const uniqueArr = this.laboratoryResult.filter(
          function (v, i, a) {
            return a.findIndex(
              function (t) {
                return (JSON.stringify(t) === JSON.stringify(v))
              }
            )
              === i
          }
        )

        let loincCode = uniqueArr.filter((e) => e.code === dataLoinc.loincCode)
        for (let loinc of loincCode) {
          dataLoincArray.push(loinc)
        }
      }
    }

    //for snomedct
    const dataSnomedArray = [];
    for (let dataSnomed of this.consentForm.get('snomedCTCode')?.value) {
      if (this.snomedCT) {
        let clinicalCode = this.snomedCT.filter((e) => e.code === dataSnomed.clinicalCode)
        for (let clinical of clinicalCode) {
          dataSnomedArray.push(clinical)
        }
      }
    }

    // for rxnorm
    const dataRxnormArray: any = [];
    for (let dataRxnorm of this.consentForm.get('rxnormCode')?.value) {
      if (this.combinedMedication) {
        let rxCode = this.combinedMedication.filter((e) => e.code === dataRxnorm.rxCode)
        for (let rx of rxCode) {
          dataRxnormArray.push(rx)
        }
      }
    }
    let loincAndSnomed = dataLoincArray.concat(dataSnomedArray, dataRxnormArray);
    // new Date()
    let patientUserId = sessionStorage.getItem("patientUserId");
    const conJson = {
      type: this.consentForm.get('provisionType')?.value,
      start: this.consentForm.get('startDate')?.value,
      end: this.consentForm.get('endDate')?.value,
      actor: "Practitioner" + "/" + this.consentForm.get('actor')?.value
    }

    function dateConvert(str: string) {
      const date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }

    const startDate = dateConvert(conJson.start)
    const endDate = dateConvert(conJson.end)

    let consentJsonData;
    if (patientUserId) {
      consentJsonData = consentJson(patientUserId, conJson, startDate, endDate, loincAndSnomed, dataArray)
    }
    return consentJsonData
  }

  updateConsent() {
    const formValid = this.validateForm();
    const definitionDropdownValid = this.validateDefinitionDropdown();
    if (!formValid || !definitionDropdownValid) {
      if (!formValid) {
        this.snackbarService.openSnackBar("Please fill the all mandatory fields.", "Close", "error-snackbar");
        return;
      } else if (!definitionDropdownValid) {
        this.snackbarService.openSnackBar("Please provide at least one data filter for Consent from Encounter, Loinc, SnomedCT, Medication", "Close", "error-snackbar");
        return;
      }
    }

    let formData = this.getFormData();
    if (formData) {
      formData.id = this.consentFormData.id
    }
    this.patientService.updateConsent(this.consentFormData.id, formData).subscribe({
      next: (data) => {
        if (this.patient) {
          this.patientQuestionnaireService.getConsentsByPatientId(this.patient);
          this.snackbarService.openSnackBar("Consent Saved", "Close", "success-snackbar");
        }
      }, error: (error) => {
        console.error(error);
      }
    });
  }

  saveConsent() {
    const formValid = this.validateForm();
    const definitionDropdownValid = this.validateDefinitionDropdown();
    if (!formValid || !definitionDropdownValid) {
      if (!formValid) {
        this.snackbarService.openSnackBar("Please fill the all mandatory fields.", "Close", "error-snackbar");
        return;
      } else if (!definitionDropdownValid) {
        this.snackbarService.openSnackBar("Please provide at least one data filter for Consent from Encounter, Loinc, SnomedCT, Medication", "Close", "error-snackbar");
        return;
      }
    }
    const cdate = new Date().toISOString().split('.')[0] + "Z";
    let formData = this.getFormData();
    if (formData) {
      formData.dateTime = cdate
    }
    this.patientService.saveConsent(formData).subscribe({
      next: (data) => {
        if (this.patient) {
          this.patientQuestionnaireService.getConsentsByPatientId(this.patient);
          this.snackbarService.openSnackBar("Consent Saved", "Close", "success-snackbar");
          this.consentForm.reset();
          this.consentForm.updateValueAndValidity();
        }
      }, error: (error) => {
        console.error(error)
        this.snackbarService.openSnackBar(error.data.issue[0].diagnostics, "Close", "error-snackbar");
      }
    });
  }

  deleteConsent() {
    let id = this.consentFormData.id
    this.consentFormData.status = "inactive"
    let options: ConfirmDialogProps = {
      title: 'Are you sure?',
      bodyText: 'Do you want to inactive the consent?',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm'
    };

    if (id) {
      this.confirmDialogService.open(options);
      this.confirmDialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.patientService.updateConsent(id, this.consentFormData).subscribe({
            next: (data) => {
              if (this.patient) {
                this.patientQuestionnaireService.getConsentsByPatientId(this.patient);
                this.consentForm.reset();
                this.consentForm.updateValueAndValidity();
                this.showButton = false;
                this.showSaveButton = true;
              }
            }, error: (error) => {
              console.error(error);
            }
          })
        }
      });
    }
  }

  formatDate(date: Array<string>): string {
    return date[1] + '-' + date[2] + '-' + date[0];
  }

  validateForm(): boolean {
    let isFormValid = false;

    let isStartDateInvalid = false;
    if (!this.consentForm.controls['endDate'].value) {
      isStartDateInvalid = true;
    } else {
      isStartDateInvalid = false;
    }

    let isEndDateInvalid = false;
    if (!this.consentForm.controls['endDate'].value) {
      isEndDateInvalid = true;
    } else {
      isEndDateInvalid = false;
    }

    let isProvisionTypeInvalid = false;
    if (this.consentForm.controls['provisionType'].status === "INVALID") {
      isProvisionTypeInvalid = true;
    } else {
      isProvisionTypeInvalid = false;
    }

    let isActorInvalid = false;
    if (this.consentForm.controls['actor'].status === "INVALID") {
      isActorInvalid = true;
    } else {
      isActorInvalid = false;
    }

    if (isStartDateInvalid || isEndDateInvalid || isProvisionTypeInvalid || isActorInvalid) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }
    return isFormValid;
  }

  validateDefinitionDropdown() {
    let isDefinitionDropdownValid = false;

    let encounterCount = 0;
    this.consentForm.controls['encounters'].value.forEach((e: any) => {
      if (e.encounter === null) {
        encounterCount++;
      }
    });
    const isEncounterInvalid = this.consentForm.controls['encounters'].value.length === encounterCount;

    let laboratoryResultCount = 0;
    this.consentForm.controls['laboratoryResults'].value.forEach((e: any) => {
      if (e.loincCode === null) {
        laboratoryResultCount++;
      }
    });
    const isLaboratoryResultsInvalid = this.consentForm.controls['laboratoryResults'].value.length === laboratoryResultCount;

    let snomedCTCodeCount = 0;
    this.consentForm.controls['snomedCTCode'].value.forEach((e: any) => {
      if (e.clinicalCode === null) {
        snomedCTCodeCount++;
      }
    });
    const isSnoMedCTCodeInvalid = this.consentForm.controls['snomedCTCode'].value.length === snomedCTCodeCount;

    let rxnormCodeCount = 0;
    this.consentForm.controls['rxnormCode'].value.forEach((e: any) => {
      if (e.rxCode === null) {
        rxnormCodeCount++;
      }
    });
    const isRXnormCodeInvalid = this.consentForm.controls['rxnormCode'].value.length === rxnormCodeCount;

    if (!isEncounterInvalid || !isLaboratoryResultsInvalid || !isSnoMedCTCodeInvalid || !isRXnormCodeInvalid) {
      isDefinitionDropdownValid = true;
    } else {
      isDefinitionDropdownValid = false;
    }
    return isDefinitionDropdownValid;
  }
}