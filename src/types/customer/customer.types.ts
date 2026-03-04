export interface Customer {
  id: number;
  displayName: string;
  mobileNumber: string;
  status: number;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
}

export interface CustomerFilters {
  search?: string;
  page?: number;
  status?: number;
}

export interface CustomerTableProps {
  customers: Customer[];
  loading?: boolean;
  onCustomerClick?: (customer: Customer) => void;
  onEditCustomer?: (customerId: number) => void;
  onDeleteCustomer?: (customerId: number) => void;
}

export interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customerData: Partial<Customer>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: CustomerFilters;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}
