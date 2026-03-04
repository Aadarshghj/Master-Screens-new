# Bank Details POST vs GET Debug Guide

## Current Issue

POST requests are being made but table shows GET data instead of updated data.

## Debug Steps

### 1. Check Network Requests

Open DevTools → Network tab and look for:

**POST Request:**

- URL: `/api/v1/customers/{customerId}/bank-accounts`
- Method: POST
- Payload structure (from form):

```json
{
  "bankName": "string",
  "ifscCode": "string",
  "accountNumber": "string",
  "accountType": "string",
  "accountStatus": "string",
  "accountHolderName": "string",
  "branchName": "string",
  "bankProofDocumentRefId": 101,
  "isActive": true,
  "isPrimary": false,
  "upiVerified": false,
  "pdStatus": "VERIFIED|PENDING",
  "createdBy": 1,
  "updatedBy": 1,
  "customerCode": "CUST001"
}
```

**GET Request:**

- URL: `/api/v1/customers/{customerId}/bank-accounts/active`
- Method: GET
- Expected response structure:

```json
[
  {
    "identity": "string",
    "accountNumber": "string",
    "accountType": "string",
    "bankName": "string",
    "branchName": "string",
    "ifscCode": "string",
    "isActive": boolean
  }
]
```

### 2. Common Issues

#### Issue 1: Data Structure Mismatch

The POST sends `ifscCode` but GET might return `ifsc_code` or `ifsc`.

#### Issue 2: Cache Not Invalidating

The table data isn't refreshing after POST because RTK Query cache isn't being invalidated.

#### Issue 3: Different Customer ID

POST and GET might be using different customer IDs.

### 3. Quick Fixes

#### Fix 1: Add Cache Invalidation

In `firm-master.ts`, add tags to invalidate cache:

```typescript
createFirmBankAccount: build.mutation<
  FirmBankAccountResponse,
  { customerId: string; firmId?: string; bankData: FirmBankAccountRequest }
>({
  query: ({ customerId, firmId, bankData }) => ({
    url: api.firmMaster.createBankAccount({ customerId }),
    method: "POST",
    data: { ...bankData, firmId },
    headers: {
      "Content-Type": "application/json",
    },
  }),
  invalidatesTags: ["BankAccounts"], // Add this
}),

getFirmBankAccounts: build.query<FirmBankAccountResponse[], string>({
  query: customerId => ({
    url: api.firmMaster.getBankAccounts({ customerId }),
    method: "GET",
  }),
  providesTags: ["BankAccounts"], // Add this
}),
```

#### Fix 2: Force Refetch After POST

The form already calls `refetchBankAccounts()` after successful POST, which should work.

#### Fix 3: Check Response Status

Add logging to see if POST is actually successful:

```typescript
const result = await createBankAccount({
  customerId: customerIdToUse,
  firmId,
  bankData,
}).unwrap();

logger.info("Bank details saved successfully", { toast: true });
```

### 4. Verification Steps

1. **Check if POST returns 200/201 status**
2. **Verify the POST response contains the created record**
3. **Check if GET request happens after POST**
4. **Compare POST payload with GET response structure**
5. **Verify customer ID is same in both requests**

### 5. Expected Behavior

1. User fills form and clicks "Save Bank Details"
2. POST request creates new bank account
3. Form resets and shows success message
4. Table automatically refreshes with new data
5. New bank account appears in the table

If table doesn't update, the issue is likely cache invalidation or data structure mismatch.
