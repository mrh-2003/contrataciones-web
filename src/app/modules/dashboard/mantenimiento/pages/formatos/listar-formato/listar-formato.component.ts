import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Formato } from '../../../models/formato';
import { FormatoService } from '../../../services/formato.service';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-listar-formato',
  standalone: true,
  imports: [TableModule, ButtonModule, InputTextModule,
     TagModule, RouterModule, NgxExtendedPdfViewerModule, DialogModule, ToastModule],
  templateUrl: './listar-formato.component.html',
  styleUrl: './listar-formato.component.css',
  providers: [MessageService]
})
export class ListarFormatoComponent {
  visible: boolean = false;
  formatos!: Formato[];
  pdfUrl = ''
  loading: boolean = true;
  constructor(
    private formatoService: FormatoService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.formatoService.getFormatos().subscribe((formatos) => {
      this.formatos = formatos;
      this.loading = false;
    });
  }
  ngAfterViewInit() {
    let mensaje = localStorage.getItem('mensaje');
    if (mensaje) {
      this.messageService.add(JSON.parse(mensaje));
      localStorage.removeItem('mensaje');
    }
  }
  clear(table: Table, textInput: HTMLInputElement) {
    table.clear();
    textInput.value = '';
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Tabla limpiada.' });
  }

  verPdf(url: string) {
    if (url.toLowerCase().endsWith('.pdf')) {
      this.visible = true;
      this.pdfUrl = url;
    } else {
      window.open(url, '_blank');
    }
  }
}
