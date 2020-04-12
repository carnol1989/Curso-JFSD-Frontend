import { Venta } from './../_model/venta';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  url: string = `${environment.HOST}/ventas`;

  constructor(private http: HttpClient) { }

  registrarServiceFront(venta: Venta) {
    return this.http.post(this.url, venta);
  }

}
