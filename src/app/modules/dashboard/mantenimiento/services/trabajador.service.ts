import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Trabajador } from '../models/trabajador';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  path = environment.apiUrl + '/senamhi/trabajadores';
  constructor(private http: HttpClient) { }
  getTrabajadorByDni(dni: string) {
    return this.http.post<Trabajador>(this.path +"/consulta", { dni: dni, nombre: ''});
  }
  addTrabajador(trabajador: Trabajador) {
    return this.http.post<Trabajador>(this.path, trabajador);
  }
}
