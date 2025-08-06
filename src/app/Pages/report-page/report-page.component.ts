import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../Services/Transactions/transaction.service';
import { AlertService } from '../../Services/Alerts/alert.service';
import { ReportData } from '../../Interfaces/generic.interface';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.css'
})
export default class ReportPageComponent {
  reportForm: FormGroup;
  reportData: ReportData[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private serviceTransaction: TransactionService,
    private alertService: AlertService
  ) {
    this.reportForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(12)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  generateReport() {
    const reportItem = this.reportForm.value;

    this.serviceTransaction.getListTransactionAccountByDates(reportItem).subscribe({
      next: (response) => {
        this.reportData = response.transactions;
        this.alertService.success('Transacciones cargados exitosamente');
        this.reportForm.reset();
        this.cdr.markForCheck();

        if (response.base64Report) {
          this.downloadPdfFromBase64(response.base64Report, 'reporte-transacciones.pdf');
        }
      },
      error: (error) => {
        this.alertService.error(error.message || 'Error al cargar las Transacciones');
      }
    });
  }

  private downloadPdfFromBase64(base64String: string, fileName: string = 'reporte.pdf'): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

}
