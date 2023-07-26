import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { EntryEntity, Practitioner } from 'src/app/@types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PractitionerService {

  constructor(private http: HttpClient) { }

  getAllPractitioner() {
    return this.http.get<Practitioner>(`${environment.fHirUrl}/Practitioner?_sort=given`).pipe(map(data => {
      return data;
    }));
  }
}
