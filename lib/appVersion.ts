export type AppVersionConfig = {
  latestVersion: string;
  minVersion: string;
  forceUpdate: boolean;
  updateMessage: string | null;
  iosStoreUrl: string | null;
  androidStoreUrl: string | null;
  updatedAt: string;
};

export type AppVersionCheckResult = {
  currentVersion: string;
  latestVersion: string;
  minVersion: string;
  updateAvailable: boolean;
  updateRequired: boolean;
  forceUpdate: boolean;
  message: string | null;
  storeUrl: string | null;
};
