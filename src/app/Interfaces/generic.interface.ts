export interface Account {
  id: number;
  numberAccount: string;
  accountType: string;
  initialBalance: number;
  status: string;
  clientId: number;
  clientIdentityDocument: string;
  clientName: string;
}

export interface Client {
  id: number;
  name: string;
  identityDocument: string;
}