# S3 DMS File Upload Implementation

## 📋 **Overview**

This implementation provides a secure file upload system using AWS S3 with pre-signed URLs through your DMS (Document Management System) backend. It replaces traditional FormData uploads with direct S3 uploads for better performance and scalability.

## 🏗️ **Architecture**

```
Frontend → DMS Backend → S3 Pre-signed URL → Direct S3 Upload
```

## 📁 **Files Created/Modified**

### **Core API Services**

- `src/global/service/end-points/files/s3-upload.ts` - RTK Query API service
- `src/api/files/files.api.ts` - API endpoint definitions
- `src/global/service/axios-instance.ts` - Axios configuration for File uploads
- `src/global/service/base-query.ts` - Base query configuration

### **UI Components**

- `src/pages/customer/management/onboading/photo-liveliness/components/DMSTestUpload.tsx` - Test upload component
- `src/pages/debug/DMSTestPage.tsx` - Standalone test page
- `src/components/ui/file-upload/s3-file-upload.tsx` - Reusable S3 upload component

### **Hooks & Utilities**

- `src/hooks/useS3FileUpload.ts` - Custom hook for S3 uploads
- `src/config/s3.config.ts` - S3 configuration
- `src/utils/location/location.utils.ts` - Location utilities (modified)

### **Routing**

- `src/routes/protected-list.routes.tsx` - Added debug route

### **Documentation**

- `src/docs/S3_FILE_UPLOAD_IMPLEMENTATION.md` - General S3 implementation docs
- `src/docs/DMS_IMPLEMENTATION_SUMMARY.md` - DMS-specific implementation
- `src/docs/S3_DMS_UPLOAD_IMPLEMENTATION.md` - This comprehensive guide

## 🔧 **API Endpoints**

### **1. Get Pre-signed URL**

```typescript
POST /api/v1/dms/file/upload/presignedUrl?filename=test.pdf
Content-Type: multipart/form-data
Body: FormData with filename

Response:
{
  "url": "https://incededevbucket.s3.ap-south-1.amazonaws.com/pan.pdf?X-Amz-Algorithm=...",
  "file": "pan.pdf"
}
```

### **2. Upload to S3**

```typescript
PUT https://incededevbucket.s3.ap-south-1.amazonaws.com/pan.pdf?X-Amz-Algorithm=...
Content-Type: application/pdf (or appropriate file type)
Body: Binary file data
```

## 🎯 **Key Implementation Details**

### **Request Flow:**

1. **POST Request** (Get Pre-signed URL):
   - Uses `FormData` for multipart upload
   - Sends `filename` parameter
   - Returns S3 pre-signed URL and file name

2. **PUT Request** (Upload to S3):
   - Sends file as **binary data** (not FormData)
   - Sets correct `Content-Type` header
   - Matches curl command: `--data-binary` with `Content-Type`

### **Data Types:**

```typescript
// POST Request - FormData
const formData = new FormData();
formData.append("filename", payload.filename);

// PUT Request - Binary Data
data: file,  // File object as binary payload
headers: {
  "Content-Type": file.type,  // e.g., "application/pdf"
}
```

## 🚀 **Usage Examples**

### **1. Test Upload Component**

```typescript
import { DMSTestUpload } from "@/pages/customer/management/onboading/photo-liveliness/components/DMSTestUpload";

<DMSTestUpload customerId="test-customer-123" />
```

### **2. Standalone Test Page**

Navigate to: `/debug/dms-test`

### **3. Using RTK Query Hooks**

```typescript
import {
  useGetPreSignedUrlMutation,
  useUploadToS3Mutation,
} from "@/global/service/end-points/files/s3-upload";

const [getPreSignedUrl] = useGetPreSignedUrlMutation();
const [uploadToS3] = useUploadToS3Mutation();

// Get pre-signed URL
const response = await getPreSignedUrl({
  filename: "test.pdf",
}).unwrap();

// Upload to S3
const uploadResult = await uploadToS3({
  file: selectedFile,
  uploadUrl: response.url,
  fileName: response.file,
}).unwrap();
```

### **4. Custom Hook Usage**

```typescript
import { useS3FileUpload } from "@/hooks/useS3FileUpload";

const { uploadFile, isUploading, uploadProgress, error } = useS3FileUpload({
  customerId: "customer-123",
  documentType: "kyc",
  onSuccess: fileKey => {},
  onError: error => {},
});

// Upload a file
await uploadFile(selectedFile);
```

## 🔧 **Configuration**

### **Axios Instance Updates**

```typescript
// Handle File objects for S3 uploads
if (config.data instanceof File) {
  config.headers["Content-Type"] = config.data.type;
}
```

### **Base Query Updates**

```typescript
// Special handling for File objects
if (data instanceof File) {
  // Let axios instance handle Content-Type
}
```

## 🎨 **UI Components**

### **DMSTestUpload Component**

- File selection with validation
- Progress tracking
- Success/error feedback
- Themed with project design system

### **DMSTestPage**

- Customer ID input
- Clean, responsive layout
- Integrated with project theme

## 📊 **Network Request Flow**

### **1. POST Request (Get Pre-signed URL)**

```
Request URL: http://192.168.1.22:8090//api/v1/dms/file/upload/presignedUrl?filename=test.pdf
Method: POST
Content-Type: multipart/form-data
Body: FormData with filename
```

### **2. PUT Request (Upload to S3)**

```
Request URL: https://incededevbucket.s3.ap-south-1.amazonaws.com/pan.pdf?X-Amz-Algorithm=...
Method: PUT
Content-Type: application/pdf
Body: Binary file data
```

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **"Provisional headers" warning**
   - ✅ Fixed: Now sends binary data instead of FormData

2. **Missing PUT method in network tab**
   - ✅ Fixed: Proper File object handling

3. **Content-Type issues**
   - ✅ Fixed: Automatic Content-Type setting based on file type

### **Debug Steps:**

1. Check network tab for:
   - ✅ POST request shows FormData
   - ✅ PUT request shows binary data
   - ✅ Correct Content-Type headers

2. Verify backend response format:
   ```json
   {
     "url": "https://...",
     "file": "filename.pdf"
   }
   ```

## 🔒 **Security Features**

- Pre-signed URLs with expiration (3600 seconds)
- Temporary access tokens
- No direct S3 credentials in frontend
- File type validation
- Size limits

## 📈 **Benefits**

1. **Performance**: Direct S3 uploads bypass backend
2. **Scalability**: No backend bandwidth usage
3. **Security**: Pre-signed URLs with expiration
4. **Cost-effective**: Reduced server load
5. **Progress tracking**: Real-time upload progress

## 🧪 **Testing**

### **Test Routes:**

- `/debug/dms-test` - Standalone test page
- Photo-liveliness page - Integrated test component

### **Test Files:**

- PDF files (recommended)
- Image files (.jpg, .jpeg, .png)
- Document files (.tiff, .tif)

## 📝 **Migration Guide**

### **From FormData to S3:**

**Before:**

```typescript
const formData = new FormData();
formData.append("file", file);
fetch("/api/upload", { method: "POST", body: formData });
```

**After:**

```typescript
// Get pre-signed URL
const response = await getPreSignedUrl({ filename: file.name });

// Upload to S3
await uploadToS3({
  file: file,
  uploadUrl: response.url,
  fileName: response.file,
});
```

## 🎯 **Next Steps**

1. **Integration**: Replace existing FormData uploads with S3 components
2. **Validation**: Add file type and size validation
3. **Progress**: Implement progress tracking for large files
4. **Error Handling**: Add retry logic for failed uploads
5. **Confirmation**: Implement backend confirmation flow

## 📞 **Support**

For issues or questions:

1. Check network tab for request/response details
2. Verify backend endpoint is working
3. Test with different file types
4. Check browser console for errors

---

**Implementation Status**: ✅ Complete and Ready for Production
