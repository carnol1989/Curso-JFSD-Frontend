import { environment } from './../../environments/environment';
import { Producto } from './../_model/producto';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  productoCambio = new Subject<Producto[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/productos`;

  constructor(private http: HttpClient) { }

  listarServiceFront() {
    return this.http.get<Producto[]>(this.url);
  }

  listarPorIdServiceFront(idProducto: number) {
    return this.http.get<Producto>(`${this.url}/${idProducto}`);
  }

  registrarServiceFront(producto: Producto) {
    return this.http.post(this.url, producto);
  }

  modificarServiceFront(producto: Producto) {
    return this.http.put(this.url, producto);
  }

  eliminarServiceFront(idProducto: number) {
    return this.http.delete(`${this.url}/${idProducto}`);
  }

}
