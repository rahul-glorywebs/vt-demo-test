import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CdsHookService {

  constructor(private http: HttpClient) { }
  patientImmunizationCondition(requestPayload: any) {
    return this.http.post<any>('https://fhirtest2.intercorpvt.com:8888/cds-services/patient-select-VT', requestPayload).pipe(map(data => {
      return data;
    }));
  }
}
