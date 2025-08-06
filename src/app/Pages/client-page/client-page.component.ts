import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Clients } from '../../Interfaces/generic.interface';
import { ClientService } from '../../Services/Clients/client.service';
import { ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../Services/Alerts/alert.service';

@Component({
  selector: 'app-client-page',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})

export default class ClientPageComponent implements OnInit {
  clients: Clients[] = [];
  searchText = '';
  showModal = false;
  isEditMode = false;
  ClientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private readonly alertService: AlertService
  ) {
    this.ClientForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.maxLength(100)]],
      identityDocument: ['',[Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(12)]],
      age: ['',[Validators.required, Validators.pattern(/^\d+$/),Validators.min(18),Validators.max(120) ]],
      gender: ['', Validators.required],
      address: ['',[Validators.required, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{6,12}$/)]],
      password: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (response) => {
        this.clients = response;
        this.alertService.success('Clientes cargados exitosamente');
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al cargar los clientes');
      }
    });
  }

  filteredClients() {
    if (!this.searchText) return this.clients;

    const text = this.searchText.toLowerCase();
    return this.clients.filter(c =>
      c.identityDocument.toLowerCase().includes(text) ||
      c.name.toLowerCase().includes(text)
    );
  }

  showModlClient(client: any) {
    this.showModal = true;
    this.isEditMode = true;

    this.ClientForm.patchValue({
      name: client.name,
      identityDocument: client.identityDocument,
      age: client.age,
      gender: client.gender,
      address: client.address,
      phone: client.phone,
      password: client.password
    });
  }

  saveClient() {
    if (this.ClientForm.valid) {
      const formData = {
        ...this.ClientForm.value,
        status: true,
        gender: parseInt(this.ClientForm.value.gender, 10)
      };

      this.clientService.postCreateClient(formData).subscribe({
        next: (res) => {
          this.alertService.success('Cliente creado exitosamente');
          this.ClientForm.reset();
          this.loadClients();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.alertService.error(err.error.message || 'Hubo un error al crear el cliente');
        }
      });
    } else {
      this.validateAllFormFields(this.ClientForm);
      this.alertService.error('Por favor, completa el formulario correctamente.');
      return
    }
    this.closeModal();
  }

  updateClient() {
    if (this.ClientForm.valid) {
      const formData = {
        ...this.ClientForm.value,
        status: true,
        gender: parseInt(this.ClientForm.value.gender, 10)
      };

      this.clientService.putUpdateClient(formData).subscribe({
        next: (res) => {
          this.alertService.success('Cliente actualizado exitosamente');
          this.ClientForm.reset();
          this.loadClients();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.alertService.error(err.error.message || 'Hubo un error al actualizar el cliente');
        }
      });
    } else {
      this.validateAllFormFields(this.ClientForm);
      this.alertService.error('Por favor, completa el formulario correctamente.');
      return
    }
    this.closeModal();
  }

  deleteClient(identity: string) {
    this.clientService.DeleteClient(identity).subscribe({
      next: (res) => {
        this.alertService.success('Cliente Eliminado exitosamente');
        this.ClientForm.reset();
        this.loadClients();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.alertService.error(err.error.message || 'Hubo un error al eliminar al cliente');
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.isEditMode = false;
  }

  closeModal() {
    this.showModal = false;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
