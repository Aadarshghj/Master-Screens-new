import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Webcam from "react-webcam";
import {
  Input,
  Form,
  Flex,
  Grid,
  HeaderWrapper,
  TitleHeader,
  Modal,
} from "@/components";
import { Spinner } from "@/components/ui";
import { useAppDispatch } from "@/hooks/store";
import { setIsReady } from "@/global/reducers/customer/photo.reducer";
import {
  useSaveCustomerPhotoMutation,
  useGetCustomerPhotoQuery,
  usePerformLivenessCheckMutation,
} from "@/global/service";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import {
  photoValidationSchema,
  validateForm,
  transformFormData,
} from "@/global/validation/customer/photoLiveliness-schema";
import { logger } from "@/global/service";
import type {
  PhotoLivelinessFormProps,
  PhotoLivelinessFormData,
} from "@/types";
import { detectDevice } from "@/utils/device/device.utils";
import {
  RotateCcw,
  RefreshCw,
  PlusCircle,
  Camera,
  X,
  Save,
} from "lucide-react";
import { base64ToFile, convertFileToBase64 } from "@/utils/file.utils";
import { DEFAULT_FORM_VALUES } from "../../constants";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";

const deviceInfo = detectDevice();
export const PhotoLivelinessForm: React.FC<
  PhotoLivelinessFormProps & {
    onFormSubmit?: (data?: PhotoLivelinessFormData) => Promise<void>;
    isView: boolean;
  }
> = ({
  readOnly = false,
  customerIdentity,
  isView = false,
  onFormSubmit,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const dispatch = useAppDispatch();
  const { handleUpdateFormDirtyState, handleResetFormDirtyState } =
    useFormDirtyState({
      isView,
    });

  const webcamRefMain = useRef<Webcam>(null);
  const webcamRefModal = useRef<Webcam>(null);
  const customerId = customerIdentity;

  // Modal state for camera functionality
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [modalCapturedImage, setModalCapturedImage] = useState<string | null>(
    null
  );
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // const [isMainCameraReady, setIsMainCameraReady] = useState(false);
  const [isModalCameraReady, setIsModalCameraReady] = useState(false);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const [savePhoto, { isLoading: isSubmitting }] =
    useSaveCustomerPhotoMutation();
  const [performLivenessCheck] = usePerformLivenessCheckMutation();
  const {
    data: existingPhotoData,
    refetch: refetchCustomerPhoto,
    isLoading: isLoadingExistingPhoto,
  } = useGetCustomerPhotoQuery(customerId || "", {
    skip: !customerId,
  });

  const { uploadFile } = useDMSFileUpload({
    module: "customer-onboarding",
    referenceId: customerId || "",
    documentCategory: "photo-documents",
    documentType: "profile-photo",
    onSuccess: fileData => {
      setValue("dmsFileData", fileData);
      // logger.info("Photo uploaded to DMS successfully", { toast: true });
    },
    onError: error => {
      logger.error(`Photo upload failed: ${error}`, { toast: true });
    },
  });

  const formDataFromAPI = useMemo(() => {
    return {
      ...DEFAULT_FORM_VALUES,
    };
  }, []);

  const form = useForm<PhotoLivelinessFormData>({
    resolver: yupResolver(photoValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: formDataFromAPI
      ? transformFormData({ ...DEFAULT_FORM_VALUES, ...formDataFromAPI })
      : transformFormData(DEFAULT_FORM_VALUES),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = form;

  useEffect(() => {
    const hasDirtyValues = Object.keys(dirtyFields || {}).length > 0;
    if (isDirty && hasDirtyValues) {
      handleUpdateFormDirtyState();
    } else {
      handleResetFormDirtyState();
    }
  }, [isDirty, dirtyFields]);
  const watchedValues = useWatch({
    name: [
      "capturedImage",
      "showWebcam",
      "processingStep",
      "livenessScore",
      "isCapturing",
      "captureTimestamp",
    ],
    control: form.control,
  });

  const [
    capturedImage,
    showWebcam,
    processingStep,
    livenessScore,
    isCapturing,
    captureTimestamp,
  ] = watchedValues;

  const typedCapturedImage = capturedImage as string | null;
  const typedShowWebcam = showWebcam as boolean;
  const typedProcessingStep = (processingStep as string) || "";
  const typedLivenessScore = livenessScore as number | null;
  const typedIsCapturing = isCapturing as boolean;
  const typedCaptureTimestamp = captureTimestamp as Date | null;

  // Check if photo already exists for this customer
  const hasExistingPhoto = useMemo(() => {
    if (!existingPhotoData) return false;

    const response = existingPhotoData as { photo?: unknown[] };
    return (
      response?.photo &&
      Array.isArray(response.photo) &&
      response.photo.length > 0
    );
  }, [existingPhotoData]);

  useEffect(() => {
    if (formDataFromAPI) {
      const transformedData = transformFormData({
        ...DEFAULT_FORM_VALUES,
        ...formDataFromAPI,
      });
      reset(transformedData);
    }
  }, [formDataFromAPI, reset]);

  const onSubmit = useCallback(
    async (data: PhotoLivelinessFormData) => {
      logger.info("Form submission started", { toast: false });
      logger.info(`Form data: ${JSON.stringify(data)}`, { toast: false });

      // Prevent multiple submissions
      if (isFormSubmitting) {
        logger.info("Form is already submitting, skipping...", {
          toast: false,
        });
        return;
      }

      if (!customerId) {
        logger.error("Customer ID not available", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      // Check if photo already exists
      if (hasExistingPhoto) {
        logger.error(
          "Photo already submitted for this customer. Only one photo submission is allowed.",
          {
            toast: true,
            pushLog: false,
          }
        );
        return;
      }

      if (!typedCapturedImage) {
        logger.error("No photo captured. Please capture a photo first.", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      if (!data.photoData || data.photoData === "") {
        logger.error("No photo data found. Please recapture the photo.", {
          toast: true,
          pushLog: false,
        });
        return;
      }

      try {
        setIsFormSubmitting(true);
        const transformedData = transformFormData(data);
        const validationResult = await validateForm(transformedData);
        if (!validationResult.isValid) {
          const errorFields = Object.keys(validationResult.errors);
          throw new Error(
            `Validation failed for fields: ${errorFields.join(", ")}`
          );
        }

        const capturedPhotoFile = base64ToFile(
          data.photoData,
          "captured_photo.jpg",
          "image/jpeg"
        );

        setValue("processingStep", "Uploading photo to DMS...");
        logger.info("Uploading photo to DMS...", { toast: false });
        const fileData = await uploadFile(capturedPhotoFile);

        if (!fileData) {
          logger.error("Failed to upload photo to DMS", { toast: true });
          return;
        }

        setValue("processingStep", "Saving customer photo...");

        const captureDate = typedCaptureTimestamp
          ? new Date(typedCaptureTimestamp)
          : new Date();

        const formattedCaptureTime = captureDate
          .toISOString()
          .replace(/\.\d{3}Z$/, "");
        const accuracyValue =
          typedLivenessScore !== null ? typedLivenessScore : -1;
        const photoLivenessStatus =
          typedLivenessScore !== null
            ? typedLivenessScore >= 70
              ? "success"
              : "failed"
            : "pending";

        const payload = {
          capturedBy: 1005,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          photoLivenessStatus: photoLivenessStatus,
          accuracy: accuracyValue,
          captureDevice: data.captureDevice || deviceInfo.captureDevice,
          locationDescription: data.locationDescription || "Kochi, India",
          captureTime: formattedCaptureTime,
          photoRefId: fileData.fileName,
          filePath: fileData.filePath,
          // TODO: HAVE TO DELETE
          documentRefId: fileData.fileName,
          fileName: fileData.originalFileName,
          fileType: fileData.originalFileType,
          status: "PENDING" as const,
          createdBy: 1005,
          updatedBy: 2005,
          // TODO: HAVE TO DELETE
        };

        await savePhoto({ customerId, payload }).unwrap();

        setValue("processingStep", "Refreshing data...");
        await refetchCustomerPhoto();

        dispatch(setIsReady(true));
        reset(DEFAULT_FORM_VALUES);
        setValue("capturedImage", null);
        setValue("showWebcam", false);
        setValue("processingStep", "");
        setValue("livenessScore", null);
        setValue("captureTimestamp", null);
        setValue("dmsFileData", null);

        let livenessStatus = "Pending";
        let livenessMessage = "";

        if (typedLivenessScore !== null) {
          livenessStatus =
            typedLivenessScore >= 70
              ? "Live"
              : typedLivenessScore >= 50
                ? "Under Review"
                : "Not Live";
          livenessMessage = `Liveness Score: ${typedLivenessScore.toFixed(1)}% (${livenessStatus})`;
        } else {
          livenessMessage = "Liveness verification failed - Status: Pending";
        }

        logger.info(
          `Photo submitted successfully! Onboarding in progress. ${livenessMessage}`,
          { toast: true, pushLog: false }
        );

        // Small delay to ensure success message is visible
        await new Promise(resolve => setTimeout(resolve, 100));

        logger.info("About to call onFormSubmit callback", { toast: false });

        // Call onFormSubmit callback if provided
        if (onFormSubmit) {
          try {
            logger.info("Calling onFormSubmit callback...", { toast: false });
            await onFormSubmit();
            logger.info("onFormSubmit callback completed successfully", {
              toast: false,
            });
          } catch (callbackError) {
            logger.error(callbackError as Error);
            // Don't show error toast for callback errors
          }
        }
      } catch (error) {
        logger.error(error);
        setValue("processingStep", "");

        logger.error(error as Error, {
          // toast: true,
          pushLog: false,
        });

        setValue("processingStep", "");
      } finally {
        setValue("isCapturing", false);
        setIsFormSubmitting(false);
      }
    },
    [
      savePhoto,
      dispatch,
      reset,
      refetchCustomerPhoto,
      customerId,
      typedLivenessScore,
      typedCaptureTimestamp,
      typedCapturedImage,
      onFormSubmit,
      uploadFile,
      setValue,
      hasExistingPhoto,
      isFormSubmitting,
    ]
  );

  const handleReset = useCallback(() => {
    reset(DEFAULT_FORM_VALUES);
    setValue("capturedImage", null);
    setValue("showWebcam", false);
    setValue("processingStep", "");
    setValue("livenessScore", null);
    setValue("captureTimestamp", null);
    setValue("dmsFileData", null);
  }, [reset, setValue]);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "RESET"
    ) {
      return;
    }

    handleReset();
  }, [confirmationModalData]);
  // Modal camera functions
  const openCameraModal = useCallback(() => {
    setIsModalOpen(true);
    setModalCapturedImage(null);
    setIsCameraActive(true);
    setIsModalCameraReady(false);
  }, []);

  const startCamera = useCallback(() => {
    setCameraError(null);
    setIsCameraLoading(true);
    setIsCameraActive(true);
    setModalCapturedImage(null);
  }, []);

  const capturePhotoInModal = useCallback(() => {
    if (!webcamRefModal?.current || !isModalCameraReady) {
      logger.error("Modal camera not ready for capture");
      return;
    }

    const imageSrc = webcamRefModal.current.getScreenshot();
    if (imageSrc) {
      setModalCapturedImage(imageSrc);
    } else {
      logger.error("Modal getScreenshot returned null");
    }
  }, [isModalCameraReady]);

  const savePhotoFromModal = useCallback(async () => {
    if (modalCapturedImage) {
      // Set the captured image to the form
      setValue("capturedImage", modalCapturedImage);
      setValue("photoData", modalCapturedImage, { shouldValidate: true });

      // Close modal
      setIsModalOpen(false);
      setModalCapturedImage(null);
      setIsCameraActive(false);
      setIsModalCameraReady(false);

      // Trigger the liveness check and location API calls directly
      try {
        setValue("isCapturing", true);
        setValue("processingStep", "Getting location and address...");

        const captureTime = new Date();
        setValue("captureTimestamp", captureTime);
        setValue("captureTime", captureTime.toLocaleString(), {
          shouldValidate: true,
        });

        // Set static location data without API call
        const deviceInfo = detectDevice();
        setValue("captureDevice", deviceInfo.captureDevice, {
          shouldValidate: true,
        });
        setValue("captureBy", "ADARSH", {
          shouldValidate: true,
        });
        setValue("latitude", "9.9312", { shouldValidate: true });
        setValue("longitude", "76.2673", { shouldValidate: true });
        setValue("locationDescription", "Kochi, India", {
          shouldValidate: true,
        });
        logger.info("Static location data set");

        setValue("processingStep", "Verifying liveness...");

        // Perform liveness check
        try {
          const capturedPhotoFile = base64ToFile(
            modalCapturedImage,
            "captured_photo.jpg",
            "image/jpeg"
          );

          const base64Image = await convertFileToBase64(capturedPhotoFile);

          const livenessResult = await performLivenessCheck({
            image: base64Image,
          }).unwrap();
          if (
            livenessResult.status.toLocaleUpperCase() === "ERROR" ||
            livenessResult.status.toLocaleUpperCase() === "FAILURE"
          ) {
            reset(DEFAULT_FORM_VALUES);
            logger.error("Photo capture failed try again", {
              toast: true,
              pushLog: false,
            });
            return;
          }

          const score = livenessResult.data?.livenessScore;

          if (score !== undefined && score !== null) {
            setValue("livenessScore", score);
            setValue("accuracy", `${score.toFixed(1)}%`, {
              shouldValidate: true,
            });
            setValue("processingStep", "");

            logger.info(
              `Liveness verification successful. Score: ${score.toFixed(1)}%`
            );
          } else {
            throw new Error("Liveness score not found in response");
          }
        } catch (livenessError) {
          logger.error(livenessError as Error);
          setValue("accuracy", "Verification Failed", { shouldValidate: true });
          setValue("processingStep", "");
        }
      } catch (error) {
        logger.error(error);
        setValue("processingStep", "");
      } finally {
        setValue("isCapturing", false);
      }
    }
  }, [modalCapturedImage, setValue, performLivenessCheck]);

  const retakePhoto = useCallback(() => {
    setModalCapturedImage(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalCapturedImage(null);
    setIsCameraActive(false);
    setIsModalCameraReady(false);
    setCameraError(null);
    setIsCameraLoading(false);
  }, []);
  const FieldsLoadingOverlay = useCallback(
    () => (
      <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Spinner variant="default" size={32} className="text-primary" />
          <p className="text-muted-foreground text-sm">
            {typedProcessingStep || "Processing..."}
          </p>
        </div>
      </div>
    ),
    [typedProcessingStep]
  );

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-muted-foreground  mb-2">
          <RotateCcw className="h-6 w-6" />
        </div>
        <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
          Customer Identity Required
        </h3>
        <p className="text-muted-foreground text-xs">
          Please provide a customer identity to manage photo and liveliness
          details.
        </p>
      </div>
    );
  }

  // Show loading state while checking for existing photos
  if (isLoadingExistingPhoto) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-muted-foreground mb-2">
          <Spinner variant="default" size={24} />
        </div>
        <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
          Checking Photo Status
        </h3>
        <p className="text-muted-foreground text-xs">
          Please wait while we check if a photo has already been submitted.
        </p>
      </div>
    );
  }

  return (
    <article className="photo-liveliness-form-container">
      <Grid className="px-2">
        <Flex justify="between" align="center" className="mb-1 w-full">
          <HeaderWrapper>
            <TitleHeader title="Customer Photo Liveliness" />
          </HeaderWrapper>
        </Flex>

        <Form
          onSubmit={handleSubmit(onSubmit, errors => {
            logger.error("Form validation errors:", { toast: false });
            logger.error(JSON.stringify(errors), { toast: false });
          })}
        >
          <Form.Row gap={4} className="border-border rounded-lg border">
            <Form.Col className="border-border bg-muted/20 border-r p-4 lg:col-span-2">
              <Flex direction="col" align="center" gap={2} className="h-full">
                <Flex
                  align="center"
                  justify="center"
                  className="border-input bg-primary/10 aspect-[4/4] w-full max-w-[120px] overflow-hidden rounded-lg border"
                >
                  {typedShowWebcam ? (
                    <Webcam
                      ref={webcamRefMain}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="h-full w-full object-cover"
                      videoConstraints={{
                        facingMode: "user",
                      }}
                      // onUserMedia={() => setIsMainCameraReady(true)}
                      onUserMediaError={err => {
                        // setIsMainCameraReady(false);
                        logger.error(err, { toast: false });
                      }}
                    />
                  ) : typedCapturedImage ? (
                    <img
                      src={typedCapturedImage}
                      alt="Captured"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Flex
                      direction="col"
                      align="center"
                      justify="center"
                      className="p-1 text-center"
                    >
                      <Flex className="text-muted-foreground text-[11px]">
                        Customer Photo
                      </Flex>
                    </Flex>
                  )}
                </Flex>

                <NeumorphicButton
                  type="button"
                  variant="default"
                  onClick={() => {
                    if (typedCapturedImage) {
                      setValue("capturedImage", null);
                      setValue("photoData", "", { shouldValidate: true });
                      setValue("accuracy", "Pending", { shouldValidate: true });
                      setValue("livenessScore", null);
                      setValue("captureTimestamp", null);
                      openCameraModal();
                    } else {
                      openCameraModal();
                    }
                  }}
                  size="default"
                  className="p-0 px-6 py-2"
                  disabled={
                    isSubmitting ||
                    readOnly ||
                    hasExistingPhoto ||
                    typedProcessingStep?.includes("Verifying") ||
                    typedProcessingStep?.includes("Getting")
                  }
                >
                  {typedProcessingStep?.includes("Verifying")
                    ? "VERIFYING..."
                    : typedProcessingStep?.includes("Getting")
                      ? "PROCESSING..."
                      : typedCapturedImage
                        ? "RECAPTURE"
                        : "LIVE PHOTO"}
                </NeumorphicButton>
              </Flex>
            </Form.Col>

            <Form.Col className="relative col-span-12 w-full p-2 xl:col-span-10">
              {typedIsCapturing && <FieldsLoadingOverlay />}
              <Grid gap={1}>
                <Form.Row gap={4}>
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Capture by" disabled={true}>
                      <Input
                        {...register("captureBy")}
                        type="text"
                        size="form"
                        variant="form"
                        disabled
                        className="uppercase"
                      />
                      <Form.Error error={errors.captureBy} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Latitude" required disabled={true}>
                      <Input
                        {...register("latitude")}
                        type="text"
                        size="form"
                        variant="form"
                        disabled
                        className="uppercase"
                      />
                      <Form.Error error={errors.latitude} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Longitude" required disabled={true}>
                      <Input
                        {...register("longitude")}
                        type="text"
                        size="form"
                        variant="form"
                        disabled
                        className="uppercase"
                      />
                      <Form.Error error={errors.longitude} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Capture Device" disabled={true}>
                      <Input
                        {...register("captureDevice")}
                        type="text"
                        size="form"
                        variant="form"
                        disabled
                        className="uppercase"
                      />
                      <Form.Error error={errors.captureDevice} />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                {/* Second Row: 3 fields with lg={4} */}
                <Form.Row gap={4}>
                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field label="Location Description" disabled={true}>
                      <Input
                        {...register("locationDescription")}
                        type="text"
                        size="form"
                        variant="form"
                        disabled
                        className="uppercase"
                      />
                      <Form.Error error={errors.locationDescription} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field label="Capture Time" required disabled={true}>
                      <Input
                        {...register("captureTime")}
                        type="text"
                        size="form"
                        variant="form"
                        disabled
                        className="uppercase"
                      />
                      <Form.Error error={errors.captureTime} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field label="Accuracy" disabled={true}>
                      {typedLivenessScore !== null ? (
                        <div className="flex items-center gap-2">
                          <Input
                            {...register("accuracy")}
                            type="text"
                            size="form"
                            variant="form"
                            disabled
                            className="font-mono uppercase"
                          />
                        </div>
                      ) : (
                        <Input
                          {...register("accuracy")}
                          type="text"
                          size="form"
                          variant="form"
                          disabled
                          className="text-muted-foreground uppercase"
                        />
                      )}
                      <Form.Error error={errors.accuracy} />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>
              </Grid>
            </Form.Col>
          </Form.Row>

          <Flex justify="end" gap={6} className="mt-1">
            {!readOnly && (
              <>
                <NeumorphicButton
                  type="button"
                  variant="secondary"
                  size="secondary"
                  onClick={() => {
                    handleSetConfirmationModalData?.({
                      cancelText: "CANCEL",
                      confirmText: "RESET",
                      feature: "RESET",
                      description:
                        "Are you sure you want to reset the form? All entered data will be cleared.",
                      title: "Reset Form Confirmation",
                      show: true,
                      doAction: null,
                    });
                  }}
                  disabled={isSubmitting || hasExistingPhoto}
                >
                  <RefreshCw width={12} />
                  Reset
                </NeumorphicButton>

                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  disabled={isSubmitting || !customerId || hasExistingPhoto}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Spinner
                        variant="default"
                        size={16}
                        className="text-primary-foreground"
                      />
                      <span>{typedProcessingStep || "Processing..."}</span>
                    </div>
                  ) : (
                    <>
                      <PlusCircle width={12} />
                      Add Customer Photo
                    </>
                  )}
                </NeumorphicButton>
              </>
            )}
          </Flex>
        </Form>
      </Grid>

      {/* Camera Modal */}
      <Modal
        isOpen={isModalOpen}
        close={closeModal}
        title=""
        width="2xl"
        className="min-w-[800px] p-4 pb-20"
        isClosable={true}
        emptyScreen
        headerAlignEnd
        overflow="overflow-none"
        maxHeight="none"
      >
        <Flex
          direction="col"
          justify="center"
          align="center"
          className="relative -top-2 z-100"
        >
          <div className="bg-green-1000 rounded-full border border-cyan-800 px-4 py-1 text-xs">
            Customer Photo
          </div>
          <h3 className="text-black-100 p-0 text-2xl font-bold">
            Photo Liveliness
          </h3>
          <p className="p-0 pb-3 text-base text-cyan-400">
            Capture And Save Customer Live Photo
          </p>
        </Flex>
        <div className="grid gap-4 px-15  md:grid-cols-2">
          {/* Live Camera Section */}
          <div className="rounded-lg border-[1.5px] border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 px-10 py-5">
            <h2 className="text-black-100 mb-3 text-lg font-semibold">
              Live Photo
            </h2>
            {cameraError && (
              <div className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2">
                <p className="text-xs font-medium text-red-700">
                  Camera Error: {cameraError}
                </p>
                <p className="mt-1 text-xs text-red-600">
                  Please allow camera permissions and try again
                </p>
              </div>
            )}

            <div className="relative mb-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-md bg-white">
              {isCameraActive ? (
                <Webcam
                  ref={webcamRefModal}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="h-full w-full object-cover"
                  videoConstraints={{
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  }}
                  onUserMedia={() => {
                    setIsModalCameraReady(true);
                    setIsCameraLoading(false);
                    setCameraError(null);
                    logger.info("Camera started successfully");
                  }}
                  onUserMediaError={err => {
                    setIsModalCameraReady(false);
                    setIsCameraLoading(false);
                    const errorMessage =
                      err instanceof Error
                        ? err.message
                        : "Camera access denied";
                    setCameraError(errorMessage);
                    logger.error(`Camera error: ${errorMessage}`, {
                      toast: true,
                    });
                    setIsCameraActive(false);
                  }}
                />
              ) : (
                <>
                  <Camera
                    className="h-16 w-16 text-amber-300"
                    strokeWidth={1.5}
                  />
                  {cameraError && (
                    <p className="mt-2 px-2 text-center text-xs text-red-600">
                      {cameraError}
                    </p>
                  )}
                </>
              )}
            </div>
            <Flex justify="center" align="center">
              <button
                onClick={isCameraActive ? capturePhotoInModal : startCamera}
                disabled={
                  isCameraLoading || (isCameraActive && !isModalCameraReady)
                }
                className={`flex  items-center justify-center gap-2 rounded-full p-1 pr-4 text-sm font-semibold transition-colors ${
                  isCameraLoading || (isCameraActive && !isModalCameraReady)
                    ? "bg-blue-1000/60 cursor-not-allowed text-gray-200"
                    : "bg-blue-1000 hover:bg-blue-1000/90 cursor-pointer text-white"
                }`}
              >
                <Flex
                  justify="center"
                  align="center"
                  className="h-7 w-7 rounded-full border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-300"
                >
                  <Camera className="h-4 w-4" />
                </Flex>
                {isCameraLoading
                  ? "LOADING CAMERA..."
                  : isCameraActive
                    ? isModalCameraReady
                      ? "CAPTURE PHOTO"
                      : "INITIALIZING..."
                    : "START CAMERA"}
              </button>
            </Flex>
          </div>

          {/* Preview Section */}
          <div className="rounded-lg border-[1.5px] border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 px-10 py-5">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Preview
            </h2>

            <div className="relative mb-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-md bg-blue-300/10">
              {modalCapturedImage ? (
                <>
                  <img
                    src={modalCapturedImage}
                    alt="Captured"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={retakePhoto}
                    className="absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1 shadow-lg transition-colors hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </>
              ) : (
                <Camera className="h-10 w-10 text-blue-300" strokeWidth={1} />
              )}
            </div>
            <Flex justify="center" align="center">
              <button
                onClick={savePhotoFromModal}
                disabled={!modalCapturedImage}
                className={`flex w-fit items-center justify-center gap-2 rounded-full p-1 pr-4 text-sm font-semibold text-white transition-colors ${
                  modalCapturedImage
                    ? "bg-primary text-white hover:bg-indigo-600"
                    : "bg-primary cursor-not-allowed"
                }`}
              >
                <Flex
                  justify="center"
                  align="center"
                  className="text-primary h-7 w-7 rounded-full border-[1.5px] border-blue-300  bg-indigo-200"
                >
                  <Save className="h-4 w-4" />
                </Flex>
                SAVE PHOTO
              </button>
            </Flex>
          </div>
        </div>
      </Modal>
    </article>
  );
};
