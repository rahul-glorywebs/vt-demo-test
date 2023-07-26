import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Questionnaire, TenantIdRequestPayload, UserMenuAccessFromFHIrRequestPayload, UserMenuAccessFromFHIrResponse, UserWiseMenuWiseAccessDetailsResponse, UserWiseMenuWiseAccessDetailsRqPayload, WorkFlowByReportData } from 'src/app/@types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getTenantQuestionnaire(requestPayload: TenantIdRequestPayload) {
    return this.http.post<Array<Questionnaire>>(`${environment.serverUrl}/getTenantQuestionnaire`, requestPayload).pipe(map(data => {
      return data;
    }));
  }

  getUserWiseMenuWiseAccessDetails(requestPayload: UserWiseMenuWiseAccessDetailsRqPayload) {
    return this.http.post<Array<UserWiseMenuWiseAccessDetailsResponse>>(`${environment.serverUrl}/userWiseMenuWiseAccessDetails`, requestPayload).pipe(map(data => {
      return data;
    }));
  }

  showFrameForm(requestParam: number) {
    return this.http.get<Array<WorkFlowByReportData>>(`${environment.serverUrl}/reports/${requestParam}`).pipe(map(data => {
      return data;
    }));
  }

  getUserMenuAccessFromFHIrService(requestPayload: UserMenuAccessFromFHIrRequestPayload) {
    return this.http.put<UserMenuAccessFromFHIrResponse>(`${environment.camundaApiUrl}/select_tenantByMenu`, requestPayload).pipe(map(data => {
      return data;
    }));
  }
}
