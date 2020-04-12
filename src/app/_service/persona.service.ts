import { environment } from './../../environments/environment';
import { Persona } from './../_model/persona';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personaCambio = new Subject<Persona[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/personas`;

  constructor(private http: HttpClient) { }

  listarServiceFront() {
    return this.http.get<Persona[]>(this.url);
  }

  listarPorIdServiceFront(idPersona: number) {
    return this.http.get<Persona>(`${this.url}/${idPersona}`);
  }

  registrarServiceFront(persona: Persona) {
    return this.http.post(this.url, persona);
  }

  modificarServiceFront(persona: Persona) {
    return this.http.put(this.url, persona);
  }

  eliminarServiceFront(idPersona: number) {
    return this.http.delete(`${this.url}/${idPersona}`);
  }

}
