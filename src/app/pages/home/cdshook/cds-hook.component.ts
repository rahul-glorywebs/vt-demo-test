import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { EntryEntity, SessionStorageData } from 'src/app/@types';
import { CdsHookService } from 'src/app/shared/service';
import { getDataFromSessionStorage } from 'src/app/shared/util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cds-hook',
  templateUrl: './cds-hook.component.html',
  styleUrls: ['./cds-hook.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CdsHookComponent implements OnInit, OnDestroy {
  getCartDetails: any = [];
  private sessionStorageData: SessionStorageData;
  //patient - You can declare simple variable for below line
  @Input('selectedPatient') patient: EntryEntity | null;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<CdsHookComponent>, private cdsHookService: CdsHookService) { }

  ngOnDestroy(): void {
    this.snackBarRef.dismiss();
  }

  ngOnInit(): void {
    this.sessionStorageData = getDataFromSessionStorage();
    if (this.data.patient) {
      this.patientImmunizationCondition();
    } else {
      this.patient = this.sessionStorageData.patient;
      if (this.patient) {
        this.patientImmunizationCondition();
      }
    }
  }

  patientImmunizationCondition() {
    let reqBody = {
      "fhirServer": `${environment.fHirUrl}`,
      "id": "patient-select-VT",
      "context": {
        "patientId": this.data.patient.resource.id
      }
    }
    this.cdsHookService.patientImmunizationCondition(reqBody).subscribe({
      next: (data) => {
        this.getCartDetails = data.cards.reverse();
      },
      error: (error) => {
        console.log(error);
        this.snackBarRef.dismiss();
      }
    })
  }

  removeHookCard(hook: string): void {
    const index = this.getCartDetails.indexOf(hook);
    if (index >= 0) {
      this.getCartDetails.splice(index, 1);
      if (this.getCartDetails.length == 0) {
        this.snackBarRef.dismiss();
      }
      // this.announcer.announce(`Removed ${hook}`);
    }
  }
}
