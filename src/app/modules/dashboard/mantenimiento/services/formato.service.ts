import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Formato } from '../models/formato';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormatoService {
  path = environment.apiUrl + '/formatos';
  constructor(
    private http: HttpClient
  ) { }

  getFormatos(){
    return this.http.get<Formato[]>(this.path);
  }

  getFormatoByCodigo(codigo: number) {
    return this.http.get<Formato>(this.path + '/' + codigo);
  }

  createFormato(formato: any) {
    return this.http.post<any>(this.path +'/upload', formato);
  }

  updateFormato(formato: any) {
    return this.http.put<any>(this.path + '/update', formato);
  }

  deleteFormato(codigo: number) {
    return this.http.delete(this.path + '/delete/' + codigo);
  }
}
