import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UppercaseDirective } from '../../../dashboard/directives/uppercase.directive';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, ToastModule, UppercaseDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  form !: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.form = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      contrasenia: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }
  onSubmit() {
    this.authService.login(this.form.value).subscribe(
      {
        next: (response: any) => {
          localStorage.setItem('token', response['token']);
          localStorage.setItem('role', response['role']);
          localStorage.setItem('username', this.form.value.usuario);
          if(response['role'] == 'ROLE_ADMINISTRADOR') {
            this.router.navigate(['/dashboard/formatos']);
          }else{
            this.router.navigate(['/dashboard/contrataciones']);
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña incorrectos' });
          this.form.reset();
        }
      }
    );
  }
}
