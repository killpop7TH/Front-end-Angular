import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Taza } from './taza';

@Injectable({
  providedIn: 'root'
})
export class TazaService {
  private apiServerUrl=environment.apiBasedURL;

  constructor(private http: HttpClient ) { }

  public getTazas(): Observable<Taza[]>{
    return this.http.get<Taza[]>(`${this.apiServerUrl}/taza/all`);
  }

  public addTaza(taza:Taza): Observable<Taza>{
    return this.http.post<Taza>(`${this.apiServerUrl}/taza/add`,taza);
  }

  public updateTaza(taza:Taza): Observable<Taza>{
    return this.http.put<Taza>(`${this.apiServerUrl}/taza/update`,taza);
  }

  public deleteTaza(tazaId:number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/taza/delete/${tazaId}`);
  }


}
