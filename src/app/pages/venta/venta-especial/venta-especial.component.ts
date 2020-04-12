import { ProductoDTO } from './../../../_dto/productoDTO';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DetalleVenta } from './../../../_model/detalleVenta';
import { MatSnackBar } from '@angular/material';
import { VentaService } from './../../../_service/venta.service';
import { ProductoService } from './../../../_service/producto.service';
import { PersonaService } from './../../../_service/persona.service';
import { Producto } from './../../../_model/producto';
import { Persona } from './../../../_model/persona';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Venta } from './../../../_model/venta';
import * as moment from 'moment';

@Component({
  selector: 'app-venta-especial',
  templateUrl: './venta-especial.component.html',
  styleUrls: ['./venta-especial.component.css']
})
export class VentaEspecialComponent implements OnInit {

  form: FormGroup;
  myControlPersona: FormControl = new FormControl();
  myControlProducto: FormControl = new FormControl();

  personas: Persona[];
  productos: Producto[];
  productosDTO: ProductoDTO[] = [];

  personaSeleccionada: Persona;
  productoSeleccionado: Producto;
  productoDtoSeleccionado: ProductoDTO = new ProductoDTO();

  //maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  cantidad: number;
  precioUnitario: number;
  importe: number;
  mensaje: string;

  detalleVenta: DetalleVenta[] = [];

  personasFiltradas: Observable<any[]>;
  productosFiltrados: Observable<any[]>;

  constructor(
    private personaService: PersonaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'persona': this.myControlPersona,
      'producto': this.myControlProducto,
      'fecha': new FormControl(new Date()),
      'cantidad': new FormControl(''),
      'precioUnitario': new FormControl('')
    });

    this.listarPersonas();
    this.listarProductos();

    this.personasFiltradas = this.myControlPersona.valueChanges.pipe(map(val => this.filtrarPersonas(val)));
    this.productosFiltrados = this.myControlProducto.valueChanges.pipe(map(val => this.filtrarProductos(val)));
  }

  changeEvent(event){
    this.fechaSeleccionada = event.value;
  }

  filtrarPersonas(val: any) {
    if (val != null && val.idPersona > 0) {
      return this.personas.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
        option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()));
    } else {
      return this.personas.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) ||
        option.apellidos.toLowerCase().includes(val.toLowerCase()));
    }
  }

  filtrarProductos(val: any) {
    if (val != null && val.idProducto > 0) {
      return this.productos.filter(option =>
        option.nombre.toLowerCase().includes(val.nombre.toLowerCase()) ||
        option.marca.toLowerCase().includes(val.marca.toLowerCase()));
    } else {
      return this.productos.filter(option =>
        option.nombre.toLowerCase().includes(val.toLowerCase()) ||
        option.marca.toLowerCase().includes(val.toLowerCase()));
    }
  }

  mostrarPersona(val: Persona) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  mostrarProducto(val: Producto) {
    return val ? `${val.nombre} - ${val.marca}` : val;
  }

  seleccionarPersona(e: any) {
    this.personaSeleccionada = e.option.value;
  }

  seleccionarProducto(e: any) {
    this.productoSeleccionado = e.option.value;

    this.productoDtoSeleccionado = new ProductoDTO();
    this.productoDtoSeleccionado.idProducto = this.productoSeleccionado.idProducto;
    this.productoDtoSeleccionado.nombre = this.productoSeleccionado.nombre;
    this.productoDtoSeleccionado.marca = this.productoSeleccionado.marca;
    this.productosDTO.push(this.productoDtoSeleccionado);
  }

  listarPersonas() {
    this.personaService.listarServiceFront().subscribe(data => {
      this.personas = data;
    });
  }

  listarProductos() {
    this.productoService.listarServiceFront().subscribe(data => {
      this.productos = data;
    });
  }

  agregarDetalleVenta() {
    if(this.cantidad != null && this.precioUnitario != null) {
      let detVta = new DetalleVenta();
      detVta.cantidad = this.cantidad;
      detVta.producto = this.productoSeleccionado;
      this.detalleVenta.push(detVta);

      this.productoDtoSeleccionado.cantidad = this.cantidad;
      this.productoDtoSeleccionado.precioUnitario = this.precioUnitario;
      this.importe = this.calcularImporteVenta();

      this.cantidad = null;
      this.precioUnitario = null;
    } else {
      this.mensaje = `Debe agregar una cantidad y precio unitario`;
      this.snackBar.open(this.mensaje, "Aviso", {
        duration: 2000
      });
    }
  }

  calcularImporteVenta() {
    let calImp: number = 0;
    for (let index in this.productosDTO) {
      calImp += (this.productosDTO[index].cantidad * this.productosDTO[index].precioUnitario);
    }
    return calImp;
  }

  removerDetalleVenta(index: number) {
    this.detalleVenta.splice(index, 1);
    this.productosDTO.splice(index, 1);
  }

  estadoBotonRegistrar() {
    return (this.detalleVenta.length === 0 || this.personaSeleccionada === null || 
      this.productoSeleccionado === null);
  }

  aceptar() {
    let venta = new Venta();
    venta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    venta.persona = this.personaSeleccionada;
    venta.importe = this.importe;
    venta.detalleVenta = this.detalleVenta;

    this.ventaService.registrarServiceFront(venta).subscribe(() => {
      this.snackBar.open("SE REALIZO LA VENTA", "Aviso", {
        duration: 2000
      });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detalleVenta = [];
    this.personas = [];
    this.productos = [];
    this.precioUnitario = null;
    this.cantidad = null;
    this.importe = null;
    this.productosDTO = [];
    this.myControlPersona = new FormControl();
    this.myControlProducto = new FormControl();
    this.personaSeleccionada = undefined;
    this.productoSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}
