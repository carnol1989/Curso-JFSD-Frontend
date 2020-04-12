import { Persona } from './../../../_model/persona';
import { PersonaService } from './../../../_service/persona.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-persona-edicion',
  templateUrl: './persona-edicion.component.html',
  styleUrls: ['./persona-edicion.component.css']
})
export class PersonaEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personaService: PersonaService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.personaService.listarPorIdServiceFront(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPersona),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos)
        });
      });
    }
  }

  operar() {
    let persona = new Persona();
    persona.idPersona = this.form.value['id'];
    persona.nombres = this.form.value['nombres'];
    persona.apellidos = this.form.value['apellidos'];

    if (this.edicion) {
      this.personaService.modificarServiceFront(persona).subscribe(() => {
        this.personaService.listarServiceFront().subscribe(data => {
          this.personaService.personaCambio.next(data);
          this.personaService.mensajeCambio.next('SE REALIZO LA MODIFICACION');
        });
      });
    } else {
      this.personaService.registrarServiceFront(persona).subscribe(() => {
        this.personaService.listarServiceFront().subscribe(data => {
          this.personaService.personaCambio.next(data);
          this.personaService.mensajeCambio.next('SE REALIZO EL REGISTRO');
        });
      });
    }
    this.router.navigate(['persona']);
  }

}
