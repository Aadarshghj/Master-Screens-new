# Firm Photo POST API Debug

## Current Issue

The firm photo POST API is not working properly.

## Root Cause Analysis

### 1. API Flow

The component uses a 2-step process:

1. **Step 1**: Upload file to DMS using `useDMSFileUpload`
2. **Step 2**: Send metadata to firm photo API using `useUploadFirmPhotoMetaMutation`

### 2. The Problem

The POST request in Step 2 is failing because:

**Current API Call:**

```typescript
await uploadFirmPhoto({
  customerId,
  data: metadataPayload, // This is JSON, not FormData
}).unwrap();
```

**API Endpoint:**

```typescript
uploadFirmPhoto: build.mutation<
  FirmPhotoResponse,
  { customerId: string; data: FormData | FirmPhotoUploadRequest }
>({
  query: ({ customerId, data }) => ({
    url: `/api/v1/customers/${customerId}/firm-photo`,
    method: "POST",
    data: data, // This expects FormData for file uploads
  }),
});
```

### 3. Debug Steps

#### Check Network Tab:

1. Look for POST to `/api/v1/customers/{customerId}/firm-photo`
2. Check if it returns 400/500 error
3. Verify the request payload structure

#### Common Issues:

1. **Content-Type mismatch**: Sending JSON when expecting FormData
2. **Missing file data**: Only sending metadata without actual file
3. **Server expects different payload structure**

### 4. Quick Fix Options

#### Option 1: Fix the API to handle JSON metadata

Since the component already uploads the file to DMS separately, the firm photo API should only handle metadata:

```typescript
// The API should accept JSON metadata only
const metadataPayload: FirmPhotoUploadRequest = {
  photoRefId: "FIRM_PHOTO_123",
  photoCaption: "FRONT_VIEW",
  documentPath: "/path/to/uploaded/file",
  createdBy: 101,
};
```

#### Option 2: Change to single-step upload

Modify the component to send file + metadata in one FormData request:

```typescript
const formData = new FormData();
formData.append("file", data.firmPhoto);
formData.append("photoCaption", data.photoCaption);
formData.append("createdBy", "101");

await uploadFirmPhoto({
  customerId,
  data: formData,
}).unwrap();
```

### 5. Recommended Solution

The current approach (DMS + metadata) is correct. The issue is likely:

1. **Server expects different JSON structure**
2. **Missing authentication headers**
3. **CORS issues**
4. **Server validation errors**

### 6. Immediate Debug Steps

Add logging to see the exact error:

```typescript
try {
  await uploadFirmPhoto({
    customerId,
    data: metadataPayload,
  }).unwrap();
} catch (error) {}
```

Check browser Network tab for:

- Request URL
- Request Method (should be POST)
- Request Headers
- Request Payload
- Response Status
- Response Body
