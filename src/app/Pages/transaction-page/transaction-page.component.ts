import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-page.component.html',
  styleUrl: './transaction-page.component.css'
})
export default class TransactionPageComponent {
  transactions = [
        { id: 1, date: '2025-08-01', typeMovement: 'Depósito', value: 1000, sald: 5000, accountNumberAccount: '123456' }
    ];

    filteredTransactions = [...this.transactions];

    searchText = '';
    showTransactionModal = false;

    newTransaction = {
        id: 0,
        date: '',
        typeMovement: '',
        value: 0,
        sald: 0,
        accountNumberAccount: ''
    };

    applySearch() {
        if (!this.searchText) {
            this.filteredTransactions = [...this.transactions];
            return;
        }

        this.filteredTransactions = this.transactions.filter(tx =>
            tx.accountNumberAccount.includes(this.searchText)
        );
    }

    openTransactionModal() {
        this.newTransaction = {
            id: 0,
            date: '',
            typeMovement: '',
            value: 0,
            sald: 0,
            accountNumberAccount: ''
        };
        this.showTransactionModal = true;
    }

    closeTransactionModal() {
        this.showTransactionModal = false;
    }

    saveTransaction() {
        this.newTransaction.id = this.transactions.length + 1;
        this.transactions.push({ ...this.newTransaction });
        this.applySearch();
        this.closeTransactionModal();
    }
}
