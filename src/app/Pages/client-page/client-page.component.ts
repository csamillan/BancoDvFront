import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})

export default class ClientPageComponent {
  clients: any[] = [];
  searchText = '';

  showModal = false;
  isEditMode = false;
  currentClient: any = this.getEmptyClient();

  getEmptyClient() {
    return {
      identityDocument: '',
      password: '',
      status: '',
      name: '',
      gender: '',
      age: null,
      address: '',
      phone: ''
    };
  }

  filteredClients() {
    if (!this.searchText) return this.clients;

    const text = this.searchText.toLowerCase();
    return this.clients.filter(c =>
      c.identityDocument.toLowerCase().includes(text) ||
      c.name.toLowerCase().includes(text)
    );
  }

  openModal() {
    this.showModal = true;
    this.isEditMode = false;
    this.currentClient = this.getEmptyClient();
  }

  editClient(client: any) {
    this.showModal = true;
    this.isEditMode = true;
    this.currentClient = { ...client };
  }

  saveClient() {
    if (this.isEditMode) {
      const index = this.clients.findIndex(c => c.identityDocument === this.currentClient.identityDocument);
      if (index !== -1) this.clients[index] = { ...this.currentClient };
    } else {
      this.clients.push({ ...this.currentClient });
    }
    this.closeModal();
  }

  deleteClient(client: any) {
    this.clients = this.clients.filter(c => c !== client);
  }

  closeModal() {
    this.showModal = false;
  }
}
