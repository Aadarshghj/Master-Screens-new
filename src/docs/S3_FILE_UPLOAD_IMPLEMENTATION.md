# S3 File Upload Implementation

## Overview

This implementation provides a secure, scalable file upload system using AWS S3 with pre-signed URLs. It replaces the traditional FormData approach with direct S3 uploads.

## Architecture

```
Frontend → Backend API → S3 Pre-signed URL → Direct S3 Upload → Backend Confirmation
```

## Key Components

### 1. API Services (`src/global/service/end-points/files/s3-upload.ts`)

- `getPreSignedUrl`: Generates pre-signed URLs for S3 uploads
- `uploadToS3`: Handles direct S3 uploads
- `confirmUpload`: Confirms successful uploads with backend

### 2. Custom Hook (`src/hooks/useS3FileUpload.ts`)

- Manages upload state and progress
- Handles the complete upload flow
- Provides error handling and success callbacks

### 3. UI Component (`src/components/ui/file-upload/s3-file-upload.tsx`)

- Drop-in replacement for existing file upload components
- Progress tracking and error display
- File validation support

### 4. Configuration (`src/config/s3.config.ts`)

- S3 bucket and region settings
- File type and size limits
- Path organization

## Usage Examples

### Basic Usage

```tsx
import { S3FileUpload } from "@/components/ui/file-upload/s3-file-upload";

<S3FileUpload
  customerId="customer-123"
  documentType="kyc"
  onUploadSuccess={(fileKey, fileName) => {}}
  onUploadError={error => {}}
/>;
```

### With Custom Validation

```tsx
<S3FileUpload
  customerId="customer-123"
  documentType="form60"
  accept=".pdf"
  maxSize={10}
  validateFile={file => {
    if (file.size > 10 * 1024 * 1024) {
      return "File must be less than 10MB";
    }
    return null;
  }}
/>
```

### Using the Hook Directly

```tsx
import { useS3FileUpload } from "@/hooks/useS3FileUpload";

const { uploadFile, isUploading, uploadProgress, error } = useS3FileUpload({
  customerId: "customer-123",
  documentType: "kyc",
  onSuccess: fileKey => {
    // Handle success
  },
  onError: error => {
    // Handle error
  },
});

// Upload a file
await uploadFile(selectedFile);
```

## Backend Requirements

### Environment Variables

```env
VITE_S3_BUCKET_NAME=your-bucket-name
VITE_S3_REGION=ap-south-1
VITE_S3_UPLOAD_ENABLED=true
```

### Backend API Endpoints

#### 1. Generate Pre-signed URL

```typescript
POST /api/files/upload-url
{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "customerId": "customer-123",
  "documentType": "kyc"
}

Response:
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/key?signature=...",
  "fileKey": "customer-documents/customer-123/kyc/1234567890-document.pdf",
  "expiresIn": 300
}
```

#### 2. Confirm Upload

```typescript
POST /api/files/confirm-upload
{
  "customerId": "customer-123",
  "fileKey": "customer-documents/customer-123/kyc/1234567890-document.pdf",
  "documentType": "kyc",
  "metadata": {
    "originalName": "document.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Migration from FormData

### Before (FormData approach)

```typescript
const formData = new FormData();
formData.append("request", JSON.stringify(payload));
formData.append("file", file);

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});
```

### After (S3 approach)

```typescript
import { S3FileUpload } from '@/components/ui/file-upload/s3-file-upload';

<S3FileUpload
  customerId={customerId}
  documentType="kyc"
  onUploadSuccess={(fileKey) => {
    // Handle success - fileKey contains the S3 path
  }}
/>
```

## Benefits

1. **Scalability**: Direct S3 uploads don't burden your backend
2. **Security**: Pre-signed URLs provide temporary, secure access
3. **Performance**: Faster uploads with progress tracking
4. **Cost-effective**: Reduced backend bandwidth usage
5. **Reliability**: S3's built-in redundancy and error handling

## Security Considerations

1. **Pre-signed URLs**: Limited time access (5 minutes default)
2. **File Validation**: Client and server-side validation
3. **Access Control**: IAM policies restrict S3 access
4. **Content Type**: Enforced content types prevent malicious uploads

## File Organization

Files are organized in S3 as:

```
bucket/
├── customer-documents/
│   └── {customerId}/
│       ├── kyc/
│       ├── form60/
│       ├── photo/
│       └── address/
```

## Error Handling

The implementation includes comprehensive error handling:

- Network errors
- File validation errors
- S3 upload failures
- Backend confirmation errors

## Progress Tracking

Real-time upload progress is provided:

- 0-25%: Pre-signed URL generation
- 25-75%: S3 upload
- 75-100%: Backend confirmation

## Testing

Use the demo component (`src/components/demo/S3FileUploadDemo.tsx`) to test the implementation with different file types and sizes.

## Next Steps

1. Implement backend API endpoints
2. Configure AWS S3 bucket and IAM policies
3. Update existing forms to use S3FileUpload component
4. Test with various file types and sizes
5. Monitor upload performance and error rates
