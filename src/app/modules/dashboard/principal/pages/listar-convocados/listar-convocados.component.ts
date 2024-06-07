import { Component } from '@angular/core';
import { ConvocadoService } from '../../services/convocado.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-listar-convocados',
  standalone: true,
  imports: [ TableModule, ButtonModule, DialogModule, InputTextModule,
    NgxExtendedPdfViewerModule, ToastModule, TagModule],
  templateUrl: './listar-convocados.component.html',
  styleUrl: './listar-convocados.component.css',
  providers: [MessageService]
})
export class ListarConvocadosComponent {
  convocados!: any[];
  pdfUrl = ''
  visible = false;
  loading: boolean = true;
  id = 0;
  constructor(private convocadoService: ConvocadoService, 
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.loading = true;
    this.convocadoService.getConvocados(this.id).subscribe((convocados) => {
      this.convocados = convocados;
      this.loading = false;
    });
  }
  clear(table: Table, textInput: HTMLInputElement) {
    table.clear();
    textInput.value = '';
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Tabla limpiada.' });
  }
  verPdf(url: string) {
    this.visible = true;
    this.pdfUrl = url;
  }
  getSeverity(estado: string) {
    return estado == 'Activo' ? 'success' : 'danger';
  }
}
