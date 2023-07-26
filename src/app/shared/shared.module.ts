import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ClinicalSmartAppsComponent } from './components/clinical-smart-apps/clinical-smart-apps.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConsentFormComponent } from './components/consent-form/consent-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TabFormComponent } from './components/tab-form/tab-form.component';
import { ResponseSmartAppComponent } from './components/response-smart-app/response-smart-app.component';
import { DisableFormControlDirective } from './directive/disable-form-control.directive';
import { ResizeFrameComponent } from './components/resize-frame/resize-frame.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AngularSplitModule } from 'angular-split';

@NgModule({
  declarations: [
    SpinnerComponent,
    TabFormComponent,
    ConsentFormComponent,
    ConfirmDialogComponent,
    ClinicalSmartAppsComponent,
    ResponseSmartAppComponent,
    DisableFormControlDirective,
    ResizeFrameComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    AngularSplitModule
  ],
  exports: [
    SpinnerComponent,
    TabFormComponent,
    ConfirmDialogComponent,
    DisableFormControlDirective,
    ResizeFrameComponent
  ]
})
export class SharedModule { }
