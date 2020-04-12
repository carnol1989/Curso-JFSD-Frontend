import { switchMap } from 'rxjs/operators';
import { ProductoDialogoComponent } from './producto-dialogo/producto-dialogo.component';
import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  displayedColumns =  ['idProducto', 'nombre', 'marca', 'acciones'];
  dataSource: MatTableDataSource<Producto>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.productoService.productoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.productoService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.productoService.listarServiceFront().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  abrirDialogo(producto?: Producto) {
    let prod = producto != null ? producto : new Producto();
    this.dialog.open(ProductoDialogoComponent, {
      width: '250px',
      data: prod
    });
  }

  eliminar(producto: Producto) {
    this.productoService.eliminarServiceFront(producto.idProducto).pipe(switchMap( () => {
      return this.productoService.listarServiceFront();
    })).subscribe(data => {
      this.productoService.productoCambio.next(data);
      this.productoService.mensajeCambio.next('SE REALIZO LA ELIMINACION');
    });
  }

}
