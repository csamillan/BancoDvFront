import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { Transaction } from '../../Interfaces/generic.interface';
import { TransactionService } from '../../Services/Transactions/transaction.service';
import { AlertService } from '../../Services/Alerts/alert.service';

@Component({
    selector: 'app-transaction-page',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './transaction-page.component.html',
    styleUrl: './transaction-page.component.css'
})
export default class TransactionPageComponent {
    transactions: Transaction[] = [];
    searchText = '';
    showTransactionModal = false;
    transactionForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private transactionService: TransactionService,
        private cdr: ChangeDetectorRef,
        private readonly alertService: AlertService
    ) {
        this.transactionForm = this.fb.group({
            accountNumberAccount: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(12)]],
            date: [this.getToday(), Validators.required],
            typeMovement: ['', Validators.required],
            value: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/), Validators.min(1)]]
        });
    }

    applySearch() {
        if (!this.searchText) {
            this.alertService.error('El campo de búsqueda está vacío.');
            return;
        }

        this.transactionService.getListTransactionByAccount(this.searchText).subscribe({
            next: (response) => {
                this.transactions = response;
                this.alertService.success('Transacciones cargadas exitosamente');
                this.searchText = '';
                this.cdr.markForCheck();
            },
            error: (error) => {
                this.alertService.error(error.message || 'Error al cargar las transacciones de la cuenta');
            }
        });
    }

    openTransactionModal() {
        this.showTransactionModal = true;
    }

    closeTransactionModal() {
        this.showTransactionModal = false;
    }

    saveTransaction() {
        if (this.transactionForm.invalid) {
            this.alertService.error('Por favor, complete todos los campos requeridos.');
            this.validateAllFormFields(this.transactionForm);
            return;
        }

        const transactionData = {
            ...this.transactionForm.value,
            typeMovement: parseInt(this.transactionForm.value.typeMovement, 10),
        }

        this.transactionService.postCreateAccount(transactionData).subscribe({
            next: (response) => {
                this.alertService.success('Transacción creada exitosamente');
                this.closeTransactionModal();
                this.searchText = transactionData.accountNumberAccount;
                this.applySearch();
            },
            error: (error) => {
                this.alertService.error(error.message || 'Error al crear la transacción');
            }
        });
    }

    private getToday(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    private validateAllFormFields(formGroup: FormGroup) {
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
