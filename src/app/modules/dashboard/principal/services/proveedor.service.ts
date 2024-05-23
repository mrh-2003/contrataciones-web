import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  path = environment.apiUrl + '/senamhi/proveedores';
  constructor(
    private http: HttpClient
  ) { }
  getProveedorByDniRuc(dniRuc: string) {
    return this.http.get<Proveedor>(this.path + '/findByDniRuc/' + dniRuc);
  }
}
