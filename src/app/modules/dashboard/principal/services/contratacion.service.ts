import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Contratacion } from '../models/contratacion';

@Injectable({
  providedIn: 'root'
})
export class ContratacionService {

  path = environment.apiUrl + '/contrataciones';
  constructor(private http: HttpClient) { }

  getContrataciones() {
    return this.http.get<Contratacion[]>(this.path);
  }
  getContratacionByCodigo(codigo: number) {
    return this.http.get<Contratacion>(this.path + '/' + codigo);
  }
  addContratacionDocument(documento: FormData){
    return this.http.post(this.path + '/upload', documento);
  }
  createContratacion(contratacion: Contratacion) {
    return this.http.post<Contratacion>(this.path, contratacion);
  }
  updateContratacion(contratacion: Contratacion) {
    return this.http.put<Contratacion>(this.path, contratacion);
  }
}
