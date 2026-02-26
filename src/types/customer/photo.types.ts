import type { ConfirmationModalData } from "@/layout/BasePageLayout";

export interface PhotoFormData {
  captureBy: string | null;
  latitude: string | null;
  longitude: string | null;
  accuracy: string | null;
  captureDevice: string | null;
  locationDescription: string | null;
  captureTime: string | null;
  photoData: string | null;
  photoVerified: boolean;
  activeStatus: boolean;
}
export interface PhotoCaptureResponse {
  photoRefId: number;
  customerId: string;
  customerName: string;
  capturedBy: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  captureDevice: string;
  locationDescription: string;
  captureTime: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  filePath: string;
  photoData?: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  faceMatchResult?: FaceMatchResult;
  accuracyResult?: AccuracyResult;
  livenessResult?: LivenessResult;
  photo?: [];
}

export interface PhotoHistoryResponse {
  documents: UploadedPhotoDocument[];
  total: number;
}

export interface SavePhotoRequest {
  // DMS file metadata
  documentRefId: string;
  filePath: string;
  fileName: string;
  fileType: string;

  // Existing metadata
  capturedBy: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  photoLivenessStatus: string;
  captureDevice: string;
  locationDescription: string;
  captureTime: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  createdBy: number;
  updatedBy: number;
}

export interface FaceMatchRequest {
  referencePhoto: string;
  capturedPhoto: string;
  customerId?: string;
}

export interface PhotoFormErrors {
  captureBy?: string;
  latitude?: string;
  longitude?: string;
  accuracy?: string;
  captureDevice?: string;
  locationDescription?: string;
  captureTime?: string;
  photoData?: string;
  photoVerified?: string;
  activeStatus?: string;
  general?: string;
}

export interface PhotoState {
  photoFormData: PhotoFormData;
  photoFormErrors: PhotoFormErrors;
  isPhotoFormSubmitting: boolean;
  capturedImage: string | null;
  photoUploadError: string | null;

  faceMatchResult: FaceMatchResult | null;
  accuracyResult: AccuracyResult | null;
  livenessResult: LivenessResult | null;

  uploadedPhotoDocuments: UploadedPhotoDocument[];
  selectedPhotoDocument: UploadedPhotoDocument | null;
}

export interface UploadedPhotoDocument {
  id: string;
  customer: string;
  location: string;
  captureTime: string;
  captureBy: string;
  photoData: string;
  photoVerified: boolean;
  status: boolean;
  latitude: string;
  longitude: string;
  accuracy: string;
  captureDevice: string;
  uploadDate: string;
  faceMatchResult?: FaceMatchResult | null;
  accuracyResult?: AccuracyResult | null;
  livenessResult?: LivenessResult | null;
}

export interface FaceMatchResult {
  match: boolean;
  confidence?: number;
}

export interface AccuracyResult {
  overall: number;
  blur: {
    detected: boolean;
    score: number;
    level: "low" | "medium" | "high";
  };
  brightness: {
    level: number;
    status: "too_dark" | "optimal" | "too_bright";
  };
  faceDetection: {
    facesDetected: number;
    faceQuality: number;
    eyesVisible: boolean;
    mouthVisible: boolean;
    faceAngle: number;
  };
  imageQuality: {
    resolution: {
      width: number;
      height: number;
      megapixels: number;
    };
    sharpness: number;
    noise: number;
    compression: number;
  };
}

export interface LivenessResult {
  isLive: boolean;
  confidence: number;
  score: number;
  checks: {
    faceDetection: {
      passed: boolean;
      score: number;
      faceCount: number;
    };
    eyeDetection: {
      passed: boolean;
      score: number;
      leftEye: boolean;
      rightEye: boolean;
    };
    motionDetection: {
      passed: boolean;
      score: number;
      motionLevel: number;
    };
    textureAnalysis: {
      passed: boolean;
      score: number;
      isRealSkin: boolean;
    };
    depthAnalysis: {
      passed: boolean;
      score: number;
      has3DFeatures: boolean;
    };
  };
  antiSpoofing: {
    screenDetected: boolean;
    printDetected: boolean;
    maskDetected: boolean;
    confidence: number;
  };
}

// Component Props
export interface PhotoDocumentsTableProps {
  onViewDocument?: (documentId: string) => void;
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
}

// Action Payload Types
export interface UpdatePhotoFieldPayload {
  field: keyof PhotoFormData;
  value: PhotoFormData[keyof PhotoFormData];
}

export interface PhotoDocumentUpdatePayload {
  id: string;
  updates: Partial<UploadedPhotoDocument>;
}
// Add these types to your existing photo.types.ts file

export interface ImageVerifyRequest {
  image1: File;
  image2: File;
}

export interface ImageVerifyResult {
  status: "success" | "failure";
  message: string;
  responseCode: string | null;
  data: {
    match: boolean;
    confidence: number;
    similarity?: number;
  } | null;
  responseKey: string | null;
}

export interface LivenessCheckRequest {
  image: string; // base64 string
}

export interface LivenessCheckResult {
  decentroTxnId: string;
  status: "SUCCESS" | "ERROR" | "FAILURE";
  responseCode: string;
  message: string;
  data: {
    status: "SUCCESS" | "ERROR";
    live: boolean;
    livenessScore: number;
    needToReview: boolean;
  };
  responseKey: string;
}

// Updated PhotoCaptureResponse interface
export interface PhotoCaptureResponse {
  photoRefId: number;
  customerId: string;
  customerName: string;
  capturedBy: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  captureDevice: string;
  locationDescription: string;
  captureTime: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  filePath: string;
  photoData?: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  photoLivenessStatus?: string;
  imageVerifyResult?: ImageVerifyResult;
  livenessResult?: LivenessResult | undefined;
}
// DMS File Data interface for S3 uploads
export interface DMSFileData {
  preSignedUrl: string;
  filePath: string;
  fileName: string;
  originalFileName: string;
  originalFileType: string;
}

export interface PhotoLivelinessFormData {
  // Form fields
  captureBy: string;
  latitude: string;
  longitude: string;
  accuracy: string | null;
  captureDevice: string | null;
  locationDescription: string | null;
  captureTime: string;
  photoData: string;

  // Photo capture and UI state
  capturedImage: string | null;
  showWebcam: boolean;
  processingStep: string;
  livenessScore: number | null;
  isCapturing: boolean;
  captureTimestamp: Date | null;
  dmsFileData?: DMSFileData | null;
}

export interface PhotoLivelinessFormProps {
  onFormSubmit?: (data: PhotoLivelinessFormData) => Promise<void>;
  initialData?: Partial<PhotoLivelinessFormData>;
  readOnly?: boolean;
  customerIdentity?: string | null;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

// Photo Table Data Types
export interface PhotoTableData {
  firstname: string;
  photoId: number;
  photoRefId: number;
  capturedBy: number;
  latitude: number;
  longitude: number;
  captureTime: string;
  status: string;
  accuracy: number;
  captureDevice: string;
  locationDescription: string;
  filePath: string;
  customerCode: string;
}

export interface PhotoLivelinessPageProps {
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}
