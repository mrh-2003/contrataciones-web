import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormatoService } from '../../../services/formato.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-formato',
  standalone: true,
  imports: [CardModule, ButtonModule, InputTextareaModule, InputTextModule, ReactiveFormsModule, FormsModule, FileUploadModule, ToastModule],
  templateUrl: './nuevo-formato.component.html',
  styleUrl: './nuevo-formato.component.css',
  providers: [MessageService]
})
export class NuevoFormatoComponent {
  accion = 'Guardar'
  descripcion = '';
  id = 0;
  formData !: FormData;
  file !: File;
  mensaje = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formatoService: FormatoService,
    private messageService: MessageService,
  ) { }


  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.formatoService.getFormatoByCodigo(this.id).subscribe((formato) => {
        this.descripcion = formato.descripcion;
        this.mensaje = formato.nombre;
        this.accion = 'Actualizar'; 
      });
    }
  }

  onSelect(event: FileUploadEvent){
    this.file= event.files[0];
    this.mensaje = ` ${this.file.name} - ${this.file.size / 1024} KB`;
  }

  onUpload() {
    this.formData = new FormData();
    if(this.id){
      if(this.descripcion !== ''){
        if(this.file){
          const uniqueFileName = `${new Date().getTime()}_${this.file.name}`;
          this.formData.append('file', this.file, uniqueFileName);
        }
        this.formData.append('descripcion', this.descripcion);
        this.formData.append('id', this.id.toString());
        this.formatoService.updateFormato(this.formData).subscribe((info) => {
          const mensaje = { severity: 'success', summary: 'Éxito', detail: 'Formato actualizado correctamente.' };
          localStorage.setItem('mensaje', JSON.stringify(mensaje));
          this.router.navigate(['/dashboard/formatos']);
        });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un archivo y una descripción.' });
      }
    } else{
      if (this.file && this.descripcion !== '') {
        const uniqueFileName = `${new Date().getTime()}_${this.file.name}`;
        this.formData.append('file', this.file, uniqueFileName);
        this.formData.append('descripcion', this.descripcion);
        this.formatoService.createFormato(this.formData).subscribe((info) => {
          const mensaje = { severity: 'success', summary: 'Éxito', detail: 'Formato creado correctamente.' };
          localStorage.setItem('mensaje', JSON.stringify(mensaje));
          this.router.navigate(['/dashboard/formatos']);
        });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un archivo y una descripción.' });
      }
    }
  }
}
