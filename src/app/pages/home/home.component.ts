import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntryEntity, SessionStorageData } from 'src/app/@types';
import { PatientQuestionnaireService } from 'src/app/shared/service';
import { getDataFromSessionStorage } from 'src/app/shared/util';
import { CdsHookComponent } from './cdshook/cds-hook.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private state$: any;
  public patient: EntryEntity | null;
  private sessionStorageData: SessionStorageData;
  snackBarRef:any;
  constructor(
    private location: Location, 
    private patientQuestionnaireService: PatientQuestionnaireService,
    private _snackBar: MatSnackBar
    ) {
    this.state$ = this.location.getState();
    if (this.state$) {
      this.patient = this.state$.patient;
    }
    this.sessionStorageData = getDataFromSessionStorage();
  }

  ngOnInit(): void {
    if (this.patient) {
      this.patientQuestionnaireService.getAllQuestionnaireResponseByPatientId(this.patient);
      this.patientQuestionnaireService.getConsentsByPatientId(this.patient);
      this.openSnackBar();
    } else {
      this.patient = this.sessionStorageData.patient;
      if (this.patient) {
        this.patientQuestionnaireService.getAllQuestionnaireResponseByPatientId(this.patient);
        this.patientQuestionnaireService.getConsentsByPatientId(this.patient);
        this.openSnackBar();
      }
    }
  }
  
  openSnackBar() {
    this.snackBarRef = this._snackBar.openFromComponent(CdsHookComponent,{
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data:{patient:this.patient}
    });
  }
}