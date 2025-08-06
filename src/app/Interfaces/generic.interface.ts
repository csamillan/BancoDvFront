export interface Clients {
  name: string;
  gender: number;
  age: number;
  identityDocument: string;
  address: string;
  phone: string;
  password: string;
  status: boolean;
}

export type AlertType = 'success' | 'error';

export interface Alert {
  type: AlertType;
  message: string;
}

export interface Account {
  numberAccount: string;
  accountType: number;
  initialBalance: number;
  status: boolean;
  clientIdentityDocument: string;
  clientName: string;
}

export interface SaveAccount {
  numberAccount: string;
  accountType: number;
  initialBalance: number;
  status: boolean;
  identityDocument: string;
}

export interface Transaction {
  id: number;
  date: Date
  typeMovement: number
  value: number
  sald: number
  accountNumberAccount: string
}

export interface SaveTransaction {
  date: Date
  typeMovement: number
  value: number
  accountNumberAccount: string
}

export interface ReportItem {
  accountNumber: string;
  startDate: Date;
  endDate: Date;
}

export interface ReportData {
  date: Date;
  name: string;
  accountNumber: string;
  type: string;
  initialSald: number;
  status: boolean;
  transactions: number;
  currectSald: number;
}

export interface ReportResponse {
  transactions: ReportData[];
  base64Report: string;
}


