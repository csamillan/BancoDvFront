import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account, Client } from '../../Interfaces/generic.interface';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css'
})
export default class AccountPageComponent {
  clients: Client[] = [
    { id: 1, name: 'Juan Pérez', identityDocument: '12345678' },
    { id: 2, name: 'María López', identityDocument: '87654321' },
    { id: 3, name: 'Carlos García', identityDocument: '45678912' }
  ];

  // Mock de cuentas
  accounts: Account[] = [
    {
      id: 1,
      numberAccount: '0001',
      accountType: 'Ahorros',
      initialBalance: 500.0,
      status: 'Activo',
      clientId: 1,
      clientIdentityDocument: '12345678',
      clientName: 'Juan Pérez'
    },
    {
      id: 2,
      numberAccount: '0002',
      accountType: 'Corriente',
      initialBalance: 1000.0,
      status: 'Inactivo',
      clientId: 2,
      clientIdentityDocument: '87654321',
      clientName: 'María López'
    }
  ];

  searchAccount: string = '';
  clientSearchText: string = '';
  showAccountModal: boolean = false;
  showClientSelector: boolean = false;
  isEditMode: boolean = false;

  currentAccount: Partial<Account> = {};
  selectedClient?: Client;

  showClientPanel = false;

  toggleClientSearch() {
    this.showClientPanel = !this.showClientPanel;
  }
  // Filtra cuentas por número
  filteredAccounts(): Account[] {
    if (!this.searchAccount) return this.accounts;
    return this.accounts.filter(account =>
      account.numberAccount.toLowerCase().includes(this.searchAccount.toLowerCase())
    );
  }

  // Abrir modal de cuenta
  openAccountModal(): void {
    this.resetForm();
    this.showAccountModal = true;
    this.isEditMode = false;
  }

  // Cerrar modal de cuenta
  closeAccountModal(): void {
    this.showAccountModal = false;
    this.currentAccount = {};
    this.selectedClient = undefined;
  }

  // Guardar cuenta nueva o actualizada
  saveAccount(): void {
    if (!this.selectedClient || !this.currentAccount.numberAccount) return;

    if (this.isEditMode && this.currentAccount.id != null) {
      const index = this.accounts.findIndex(acc => acc.id === this.currentAccount.id);
      if (index !== -1) {
        this.accounts[index] = {
          ...this.currentAccount as Account,
          clientId: this.selectedClient.id,
          clientIdentityDocument: this.selectedClient.identityDocument,
          clientName: this.selectedClient.name
        };
      }
    } else {
      const newAccount: Account = {
        id: Date.now(), // Generador rápido
        numberAccount: this.currentAccount.numberAccount!,
        accountType: this.currentAccount.accountType || '',
        initialBalance: this.currentAccount.initialBalance || 0,
        status: this.currentAccount.status || '',
        clientId: this.selectedClient.id,
        clientIdentityDocument: this.selectedClient.identityDocument,
        clientName: this.selectedClient.name
      };
      this.accounts.push(newAccount);
    }

    this.closeAccountModal();
  }

  // Editar cuenta existente
  editAccount(account: Account): void {
    this.isEditMode = true;
    this.currentAccount = { ...account };
    this.selectedClient = this.clients.find(c => c.id === account.clientId);
    this.showAccountModal = true;
  }

  // Eliminar cuenta
  deleteAccount(account: Account): void {
    if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
      this.accounts = this.accounts.filter(a => a.id !== account.id);
    }
  }

  // Abrir selector de cliente
  openClientSelector(): void {
    this.clientSearchText = '';
    this.showClientSelector = true;
  }

  // Seleccionar cliente desde modal
  selectClient(client: Client): void {
    this.selectedClient = client;
    this.showClientSelector = false;
  }

  // Filtrar lista de clientes en el modal
  filteredClients(): Client[] {
    if (!this.clientSearchText) return this.clients;
    const search = this.clientSearchText.toLowerCase();
    return this.clients.filter(c =>
      c.name.toLowerCase().includes(search) || c.identityDocument.includes(search)
    );
  }

  // Resetear formulario
  private resetForm(): void {
    this.currentAccount = {};
    this.selectedClient = undefined;
  }
}
