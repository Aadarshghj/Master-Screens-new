export interface DeviceInfo {
  deviceType: "mobile" | "tablet" | "desktop";
  platform: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
  browser: "chrome" | "firefox" | "safari" | "edge" | "opera" | "unknown";
  captureDevice: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface CameraConstraints {
  facingMode: "user" | "environment";
  width: { ideal: number };
  height: { ideal: number };
}
