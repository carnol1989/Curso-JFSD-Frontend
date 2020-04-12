import { switchMap } from 'rxjs/operators';
import { ProductoService } from './../../../_service/producto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Producto } from './../../../_model/producto';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-producto-dialogo',
  templateUrl: './producto-dialogo.component.html',
  styleUrls: ['./producto-dialogo.component.css']
})
export class ProductoDialogoComponent implements OnInit {

  producto: Producto;

  constructor(
    private dialogRef: MatDialogRef<ProductoDialogoComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: Producto,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.producto = new Producto();
    this.producto.idProducto = this.data.idProducto;
    this.producto.nombre = this.data.nombre;
    this.producto.marca = this.data.marca;
  }

  operar() {
    if(this.producto != null && this.producto.idProducto > 0) {
      this.productoService.modificarServiceFront(this.producto).pipe(switchMap( () => {
        return this.productoService.listarServiceFront();
      })).subscribe(data => {
        this.productoService.productoCambio.next(data);
        this.productoService.mensajeCambio.next('SE REALIZO LA MODIFICACION');
      });
    } else {
      this.productoService.registrarServiceFront(this.producto).subscribe(() => {
        this.productoService.listarServiceFront().subscribe(data => {
          this.productoService.productoCambio.next(data);
          this.productoService.mensajeCambio.next('SE REALIZO EL REGISTRO');
        });
      });
    }
    this.dialogRef.close();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
