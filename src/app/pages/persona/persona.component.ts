import { Persona } from './../../_model/persona';
import { PersonaService } from './../../_service/persona.service';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  dataSource: MatTableDataSource<Persona>;
  displayedColumns = ["idPersona", "nombres", "apellidos", "acciones"];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private personaService: PersonaService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.personaService.personaCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  
    this.personaService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.personaService.listarServiceFront().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idPersona: number) {
    this.personaService.eliminarServiceFront(idPersona).subscribe(() => {
      this.personaService.listarServiceFront().subscribe(data => {
        this.personaService.personaCambio.next(data);
        this.personaService.mensajeCambio.next('SE REALIZO LA ELIMINACION');
      });
    });
  }

}
