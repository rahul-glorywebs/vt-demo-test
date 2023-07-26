import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Consents, MenuWithSubMenu, RenderDashRqPayload, WorkFlowMenuDataBehaviorSubject } from 'src/app/@types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public WorkFlowMenuDataBehaviorSubject = new BehaviorSubject<WorkFlowMenuDataBehaviorSubject | null>(null);

  public smartAppSubmenuBehaviorSubject = new BehaviorSubject<MenuWithSubMenu | null>(null);

  public renderDashPayloadBehaviorSubject = new BehaviorSubject<RenderDashRqPayload | null>(null);

  constructor(private http: HttpClient) { }

  consent(consentId: string) {
    return this.http.get<Consents>(`${environment.fHirUrl}/Consent/${consentId}`).pipe(map(data => {
      return data;
    }));
  }
}
