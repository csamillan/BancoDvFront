import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account, SaveAccount } from '../../Interfaces/generic.interface';
import { AccountService } from '../../Services/Accounts/account.service';
import { AlertService } from '../../Services/Alerts/alert.service';
import { ClientService } from '../../Services/Clients/client.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css'
})
export default class AccountPageComponent implements OnInit {
  searchAccount: string = '';
  accounts: Account[] = [];
  isEditMode: boolean = false;
  accountForm: FormGroup;

  clientSearchText: string = '';
  showAccountModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private readonly alertService: AlertService
  ) {
    this.accountForm = this.fb.group({
      numberAccount: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(12)]],
      accountType: ['', Validators.required],
      initialBalance: ['',[Validators.required, Validators.pattern(/^\d+(\.\d+)?$/), Validators.min(1)]],
      clientName: ['', Validators.required],
      IdentityDocument: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(12)]],
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  toggleClientSearch(identity: string) {
    this.clientService.getClientById(identity).subscribe({
      next: (response) => {
        this.accountForm.patchValue({
          clientName: response.name
        });
        this.alertService.success('Cliente seleccionado exitosamente');
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al seleccionar el cliente');
      }
    });
  }

  filteredAccounts(): Account[] {
    if (!this.searchAccount) return this.accounts;
    return this.accounts.filter(account =>
      account.numberAccount.toLowerCase().includes(this.searchAccount.toLowerCase())
    );
  }

  showModlClient(account: any) {
    this.showAccountModal = true;
    this.isEditMode = true;

    this.accountForm.patchValue({
      numberAccount: account.numberAccount,
      accountType: account.accountType,
      initialBalance: account.initialBalance,
      IdentityDocument: account.clientIdentityDocument,
      clientName: account.clientName
    });
  }

  saveAccount(): void {
    if (this.accountForm.invalid) {
      this.validateAllFormFields(this.accountForm);
      this.alertService.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    const accountData: SaveAccount = this.getSaveAccountData();

    this.accountService.postCreateAccount(accountData).subscribe({
      next: () => {
        this.alertService.success('Cuenta guardada exitosamente');
        this.loadAccounts();
        this.accountForm.reset();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al guardar la cuenta');
      }
    });

    this.closeAccountModal();
  }

  editAccount(): void {
    if (this.accountForm.invalid) {
      this.validateAllFormFields(this.accountForm);
      this.alertService.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    const accountData: SaveAccount = this.getSaveAccountData();

    this.accountService.putUpdateAccount(accountData).subscribe({
      next: () => {
        this.alertService.success('Cuenta Actualizada exitosamente');
        this.loadAccounts();
        this.accountForm.reset();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al Actualizar la cuenta');
      }
    });
    this.closeAccountModal();
  }

  deleteAccount(numberAccount: string): void {
    this.accountService.patchDesactiveAccount(numberAccount).subscribe({
      next: () => {
        this.alertService.success('Cuenta Desactivada exitosamente');
        this.loadAccounts();
        this.accountForm.reset();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al desactivar la cuenta');
      }
    });
  }

  openAccountModal(): void {
    this.accountForm.reset();
    this.showAccountModal = true;
    this.isEditMode = false;
  }

  closeAccountModal(): void {
    this.showAccountModal = false;
  }

  private loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (response) => {
        this.accounts = response;
        this.alertService.success('Cuentas cargadas exitosamente');
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al cargar las cuentas');
      }
    });
  }

  private getSaveAccountData(): SaveAccount {
    const formValue = this.accountForm.value;
    return {
      numberAccount: formValue.numberAccount,
      accountType: parseInt(formValue.accountType, 10),
      initialBalance: Number(formValue.initialBalance),
      identityDocument: formValue.IdentityDocument,
      status: true,
    };
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
