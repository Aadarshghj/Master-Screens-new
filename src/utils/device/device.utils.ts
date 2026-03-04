import { logger } from "@/global/service";
import type { DeviceInfo } from "@/types/device";

/**
 * Detect the current device type and platform
 */
export const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Detect platform
  let detectedPlatform: DeviceInfo["platform"] = "unknown";
  if (
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    userAgent.includes("ipod")
  ) {
    detectedPlatform = "ios";
  } else if (userAgent.includes("android")) {
    detectedPlatform = "android";
  } else if (userAgent.includes("win")) {
    detectedPlatform = "windows";
  } else if (userAgent.includes("mac")) {
    detectedPlatform = "macos";
  } else if (userAgent.includes("linux")) {
    detectedPlatform = "linux";
  }

  // Detect browser
  let detectedBrowser: DeviceInfo["browser"] = "unknown";
  if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
    detectedBrowser = "chrome";
  } else if (userAgent.includes("firefox")) {
    detectedBrowser = "firefox";
  } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    detectedBrowser = "safari";
  } else if (userAgent.includes("edg")) {
    detectedBrowser = "edge";
  } else if (userAgent.includes("opr") || userAgent.includes("opera")) {
    detectedBrowser = "opera";
  }

  // Detect device type
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  const isTablet =
    /ipad|android(?!.*mobile)/i.test(userAgent) ||
    userAgent.includes("tablet") ||
    userAgent.includes("kindle");
  const isDesktop = !isMobile && !isTablet;

  let deviceType: DeviceInfo["deviceType"] = "desktop";
  if (isMobile) deviceType = "mobile";
  else if (isTablet) deviceType = "tablet";

  // Generate capture device name
  const captureDevice = generateCaptureDeviceName(
    detectedPlatform,
    detectedBrowser,
    deviceType
  );

  return {
    deviceType,
    platform: detectedPlatform,
    browser: detectedBrowser,
    captureDevice,
    isMobile,
    isTablet,
    isDesktop,
  };
};

/**
 * Generate a descriptive capture device name based on platform and browser
 */
const generateCaptureDeviceName = (
  platform: DeviceInfo["platform"],
  browser: DeviceInfo["browser"],
  deviceType: DeviceInfo["deviceType"]
): string => {
  const platformNames = {
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    unknown: "Unknown OS",
  };

  const browserNames = {
    chrome: "Chrome",
    firefox: "Firefox",
    safari: "Safari",
    edge: "Edge",
    opera: "Opera",
    unknown: "Unknown Browser",
  };

  // For mobile devices, prioritize mobile camera
  if (deviceType === "mobile") {
    if (platform === "ios") {
      return "iPhone Camera";
    } else if (platform === "android") {
      return "Windows Camera";
    } else {
      return "Mobile Camera";
    }
  }

  // For tablets
  if (deviceType === "tablet") {
    if (platform === "ios") {
      return "iPad Camera";
    } else if (platform === "android") {
      return "Android Tablet Camera";
    } else {
      return "Tablet Camera";
    }
  }

  // For desktop devices
  if (deviceType === "desktop") {
    if (platform === "windows") {
      return "Windows Camera";
    } else if (platform === "macos") {
      return "Mac Camera";
    } else if (platform === "linux") {
      return "Linux Camera";
    } else {
      return "Desktop Camera";
    }
  }

  // Fallback
  return `${platformNames[platform]} ${browserNames[browser]} Camera`;
};

/**
 * Get detailed device information for logging
 */
export const getDetailedDeviceInfo = (): string => {
  const device = detectDevice();
  return `${device.captureDevice} (${device.platform} ${device.browser} ${device.deviceType})`;
};

/**
 * Check if the device supports camera access
 */
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Get camera constraints based on device type
 */
export const getCameraConstraints = (): MediaTrackConstraints => {
  const device = detectDevice();

  if (device.isMobile) {
    return {
      facingMode: "user", // Front camera for mobile
      width: { ideal: 1280 },
      height: { ideal: 720 },
    };
  } else {
    return {
      facingMode: "user", // Front camera for desktop
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    };
  }
};

/**
 * Log device information for debugging
 */
export const logDeviceInfo = (): void => {
  logger.info("Device Detection");
};
