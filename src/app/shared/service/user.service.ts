import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { FHIrUrlByTenantResponse } from 'src/app/@types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getFHIrUrlByTenant(requestPayload: any) {
    return this.http.post<Array<FHIrUrlByTenantResponse>>(`${environment.serverUrl}/getAllFHIRDetailsByTenant`, requestPayload).pipe(map(data => {
      return data;
    }));
  }
}
