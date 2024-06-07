import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Trabajador } from '../models/trabajador';
import { Respuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  path = environment.apiUrl + '/senamhi/trabajadores';
  pathSenamhi = environment.apiSenamhi;
  constructor(private http: HttpClient) { }
  getTrabajadorByDni(dni: string) {
    return this.http.post<Respuesta>(this.pathSenamhi, { dni: dni, nombre: ''});
  }
  addTrabajador(trabajador: Trabajador) {
    return this.http.post<Trabajador>(this.path, trabajador);
  }
}
