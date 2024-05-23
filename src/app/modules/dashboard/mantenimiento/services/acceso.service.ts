import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Acceso } from '../models/acceso';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  path = environment.apiUrl + '/accesos';

  constructor(private http: HttpClient) { }

  getAccesos() {
    return this.http.get<Acceso[]>(this.path);
  }
  getAccesoByCodigo(codigo: number) {
    return this.http.get<Acceso>(this.path + '/' + codigo);
  }

  createAcceso(acceso: Acceso) {
    return this.http.post<Acceso>(this.path + '/registration', acceso);
  }

  updateAcceso(acceso: Acceso) {
    return this.http.put<Acceso>(this.path, acceso);
  }

  deleteAcceso(codigo: number) {
    return this.http.delete(this.path + '/delete/' + codigo);
  }

  getRole(){
    const token = localStorage.getItem('token') ?? 'null';
    return this.http.get<any>(this.path + '/protectedRole/' + token);
  }

  getAccesoActual(){
    const token = localStorage.getItem('token') ?? 'null';
    return this.http.get<Acceso>(this.path + '/getAcceso/' + token);
  }

}
