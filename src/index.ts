import { NativeModules, Platform } from 'react-native';

// Define the types for device information
export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  systemName: string;
  systemVersion: string;
  model: string;
  brand: string;
  buildNumber: string;
  bundleId: string;
  version: string;
  buildId: string;
  manufacturer: string;
  isEmulator: boolean;
  isTablet: boolean;
  totalMemory: number;
  freeMemory: number;
  totalStorage: number;
  freeStorage: number;
  batteryLevel: number;
  isCharging: boolean;
  ipAddress?: string;
  macAddress?: string;
  carrier?: string;
  timezone: string;
  locale: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

export interface NetworkInfo {
  connectionType: 'none' | 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'unknown';
  isConnected: boolean;
  isWifiEnabled?: boolean;
  signalStrength?: number;
}

// Define the native module interface
interface DeviceInfoSDKInterface {
  getDeviceInfo(): Promise<DeviceInfo>;
  getBatteryInfo(): Promise<{ level: number; isCharging: boolean }>;
  getNetworkInfo(): Promise<NetworkInfo>;
  getStorageInfo(): Promise<{ total: number; free: number }>;
  getMemoryInfo(): Promise<{ total: number; free: number }>;
  getCurrentLocation(): Promise<LocationInfo>;
  getSystemInfo(): Promise<{
    platform: string;
    version: string;
    model: string;
    manufacturer: string;
  }>;
  isEmulator(): Promise<boolean>;
  isTablet(): Promise<boolean>;
  getUniqueId(): Promise<string>;
  getAppInfo(): Promise<{
    appName: string;
    bundleId: string;
    version: string;
    buildNumber: string;
  }>;
}

const LINKING_ERROR =
  `The package 'react-native-device-info-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Get the native module
const DeviceInfoSDK = NativeModules['DeviceInfoSDK']
  ? NativeModules['DeviceInfoSDK']
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// Create the SDK interface with enhanced error handling
class DeviceInfoSDKManager implements DeviceInfoSDKInterface {
  async getDeviceInfo(): Promise<DeviceInfo> {
    try {
      return await DeviceInfoSDK.getDeviceInfo();
    } catch (error) {
      throw new Error(`Failed to get device info: ${error}`);
    }
  }

  async getBatteryInfo(): Promise<{ level: number; isCharging: boolean }> {
    try {
      return await DeviceInfoSDK.getBatteryInfo();
    } catch (error) {
      throw new Error(`Failed to get battery info: ${error}`);
    }
  }

  async getNetworkInfo(): Promise<NetworkInfo> {
    try {
      return await DeviceInfoSDK.getNetworkInfo();
    } catch (error) {
      throw new Error(`Failed to get network info: ${error}`);
    }
  }

  async getStorageInfo(): Promise<{ total: number; free: number }> {
    try {
      return await DeviceInfoSDK.getStorageInfo();
    } catch (error) {
      throw new Error(`Failed to get storage info: ${error}`);
    }
  }

  async getMemoryInfo(): Promise<{ total: number; free: number }> {
    try {
      return await DeviceInfoSDK.getMemoryInfo();
    } catch (error) {
      throw new Error(`Failed to get memory info: ${error}`);
    }
  }

  async getCurrentLocation(): Promise<LocationInfo> {
    try {
      return await DeviceInfoSDK.getCurrentLocation();
    } catch (error) {
      throw new Error(`Failed to get location: ${error}`);
    }
  }

  async getSystemInfo(): Promise<{
    platform: string;
    version: string;
    model: string;
    manufacturer: string;
  }> {
    try {
      return await DeviceInfoSDK.getSystemInfo();
    } catch (error) {
      throw new Error(`Failed to get system info: ${error}`);
    }
  }

  async isEmulator(): Promise<boolean> {
    try {
      return await DeviceInfoSDK.isEmulator();
    } catch (error) {
      throw new Error(`Failed to check emulator status: ${error}`);
    }
  }

  async isTablet(): Promise<boolean> {
    try {
      return await DeviceInfoSDK.isTablet();
    } catch (error) {
      throw new Error(`Failed to check tablet status: ${error}`);
    }
  }

  async getUniqueId(): Promise<string> {
    try {
      return await DeviceInfoSDK.getUniqueId();
    } catch (error) {
      throw new Error(`Failed to get unique ID: ${error}`);
    }
  }

  async getAppInfo(): Promise<{
    appName: string;
    bundleId: string;
    version: string;
    buildNumber: string;
  }> {
    try {
      return await DeviceInfoSDK.getAppInfo();
    } catch (error) {
      throw new Error(`Failed to get app info: ${error}`);
    }
  }
}

// Export the singleton instance
export default new DeviceInfoSDKManager();

// Export types for consumers
export type {
  DeviceInfoSDKInterface,
};