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

  getfFormatos() {
    return [
      {
        codigo: 1,
        descripcion: 'Formato de prueba',
        url: 'http://localhost:3000/formatos/1',
        nombre: 'Formato 1',
        fechaCreacion: '2021-09-01',
        fechaEdicion: '2021-09-01',
        estado: 'Activo'
      },
      {
        codigo: 2,
        descripcion: 'Formato de prueba 2',
        url: 'http://localhost:3000/formatos/2',
        nombre: 'Formato 2',
        fechaCreacion: '2021-09-01',
        fechaEdicion: '2021-09-01',
        estado: 'Activo'
      },
      {
        codigo: 3,
        descripcion: 'Formato de prueba 3',
        url: 'http://localhost:3000/formatos/3',
        nombre: 'Formato 3',
        fechaCreacion: '2021-09-01',
        fechaEdicion: '2021-09-01',
        estado: 'Activo'
      },
      {
        codigo: 4,
        descripcion: 'Formato de prueba 4',
        url: 'http://localhost:3000/formatos/4',
        nombre: 'Formato 4',
        fechaCreacion: '2021-09-01',
        fechaEdicion: '2021-09-01',
        estado: 'Activo'
      },
      {
        codigo: 5,
        descripcion: 'Formato de prueba 5',
        url: 'http://localhost:3000/formatos/5',
        nombre: 'Formato 5',
        fechaCreacion: '2021-09-01',
        fechaEdicion: '2021-09-01',
        estado: 'Activo'
      }
    ]
    //return this.http.get<Formato[]>('http://localhost:3000/formatos');
  }

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
