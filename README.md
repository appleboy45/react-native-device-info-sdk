# React Native Device Info SDK

A comprehensive React Native SDK for accessing device information from both Android and iOS platforms.

## Features

- 📱 **Complete Device Information**: Get detailed device specs, system info, and hardware details
- 🔋 **Battery Information**: Monitor battery level and charging status  
- 🌐 **Network Information**: Check connectivity type and network status
- 💾 **Storage & Memory**: Get total/free storage and memory information
- 📍 **Location Services**: Access device location (with proper permissions)
- 🆔 **Unique Identifiers**: Get device-specific unique IDs
- 📦 **App Information**: Retrieve app version, build numbers, and bundle info
- 🔍 **Device Detection**: Detect emulators and tablet devices
- ⚡ **Cross-Platform**: Works on both Android and iOS
- 🛡️ **Type Safe**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install react-native-device-info-sdk
```

### iOS Setup

1. Navigate to your iOS directory:
   ```bash
   cd ios && pod install
   ```

2. Add permissions to `ios/YourApp/Info.plist` if you plan to use location services:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>This app needs location access to provide device location information.</string>
   ```

### Android Setup

The package automatically includes necessary permissions. If you plan to use location services, ensure these permissions are in your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Usage

### Basic Usage

```typescript
import DeviceInfoSDK from 'react-native-device-info-sdk';

// Get complete device information
const deviceInfo = await DeviceInfoSDK.getDeviceInfo();
console.log('Device Info:', deviceInfo);

// Get battery information
const batteryInfo = await DeviceInfoSDK.getBatteryInfo();
console.log('Battery Level:', batteryInfo.level, 'Charging:', batteryInfo.isCharging);

// Get network information
const networkInfo = await DeviceInfoSDK.getNetworkInfo();
console.log('Connection Type:', networkInfo.connectionType);

// Check if device is an emulator
const isEmulator = await DeviceInfoSDK.isEmulator();
console.log('Is Emulator:', isEmulator);
```

### Complete Example

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DeviceInfoSDK, { DeviceInfo } from 'react-native-device-info-sdk';

const DeviceInfoScreen = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Fetch all device information
        const info = await DeviceInfoSDK.getDeviceInfo();
        setDeviceInfo(info);

        // Individual API calls
        const battery = await DeviceInfoSDK.getBatteryInfo();
        const network = await DeviceInfoSDK.getNetworkInfo();
        const storage = await DeviceInfoSDK.getStorageInfo();
        const memory = await DeviceInfoSDK.getMemoryInfo();
        const system = await DeviceInfoSDK.getSystemInfo();
        const app = await DeviceInfoSDK.getAppInfo();
        
        console.log('Battery:', battery);
        console.log('Network:', network);
        console.log('Storage:', storage);
        console.log('Memory:', memory);
        console.log('System:', system);
        console.log('App:', app);

      } catch (error) {
        console.error('Error fetching device info:', error);
      }
    };

    fetchDeviceInfo();
  }, []);

  return (
    <View>
      <Text>Device: {deviceInfo?.deviceName}</Text>
      <Text>OS: {deviceInfo?.systemName} {deviceInfo?.systemVersion}</Text>
      <Text>Model: {deviceInfo?.model}</Text>
      <Text>Manufacturer: {deviceInfo?.manufacturer}</Text>
      <Text>Is Tablet: {deviceInfo?.isTablet ? 'Yes' : 'No'}</Text>
      <Text>Is Emulator: {deviceInfo?.isEmulator ? 'Yes' : 'No'}</Text>
    </View>
  );
};

export default DeviceInfoScreen;
```

## API Reference

### DeviceInfoSDK.getDeviceInfo()

Returns complete device information including:

```typescript
interface DeviceInfo {
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
```

### DeviceInfoSDK.getBatteryInfo()

```typescript
const batteryInfo = await DeviceInfoSDK.getBatteryInfo();
// Returns: { level: number, isCharging: boolean }
```

### DeviceInfoSDK.getNetworkInfo()

```typescript
const networkInfo = await DeviceInfoSDK.getNetworkInfo();
// Returns: { connectionType: string, isConnected: boolean, isWifiEnabled?: boolean }
```

### DeviceInfoSDK.getStorageInfo()

```typescript
const storageInfo = await DeviceInfoSDK.getStorageInfo();
// Returns: { total: number, free: number }
```

### DeviceInfoSDK.getMemoryInfo()

```typescript
const memoryInfo = await DeviceInfoSDK.getMemoryInfo();
// Returns: { total: number, free: number }
```

### DeviceInfoSDK.getCurrentLocation()

```typescript
const location = await DeviceInfoSDK.getCurrentLocation();
// Returns: { latitude: number, longitude: number, accuracy: number, timestamp: number }
```

### DeviceInfoSDK.getSystemInfo()

```typescript
const systemInfo = await DeviceInfoSDK.getSystemInfo();
// Returns: { platform: string, version: string, model: string, manufacturer: string }
```

### DeviceInfoSDK.isEmulator()

```typescript
const isEmulator = await DeviceInfoSDK.isEmulator();
// Returns: boolean
```

### DeviceInfoSDK.isTablet()

```typescript
const isTablet = await DeviceInfoSDK.isTablet();
// Returns: boolean
```

### DeviceInfoSDK.getUniqueId()

```typescript
const uniqueId = await DeviceInfoSDK.getUniqueId();
// Returns: string
```

### DeviceInfoSDK.getAppInfo()

```typescript
const appInfo = await DeviceInfoSDK.getAppInfo();
// Returns: { appName: string, bundleId: string, version: string, buildNumber: string }
```

## Error Handling

All methods return Promises and can throw errors. Always wrap calls in try-catch blocks:

```typescript
try {
  const deviceInfo = await DeviceInfoSDK.getDeviceInfo();
  console.log(deviceInfo);
} catch (error) {
  console.error('Failed to get device info:', error);
}
```

## Platform Differences

### Android
- Uses `Settings.Secure.ANDROID_ID` for device ID
- Battery level returned as percentage (0-100)
- Storage values in bytes
- Requires permissions for location and phone state

### iOS  
- Uses `UIDevice.current.identifierForVendor` for device ID
- Battery level returned as percentage (0-100)
- Storage values in bytes
- Requires location permissions in Info.plist

## Permissions

### Android Permissions (automatically included)
```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.BATTERY_STATS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

### iOS Permissions (add to Info.plist if needed)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to provide location information.</string>
```

## Example App

See the `example/` directory for a complete demo application that showcases all SDK features.

To run the example:

```bash
cd example
npm install
npx react-native run-android  # or run-ios
```

## Troubleshooting

### iOS Issues
- Make sure you've run `pod install` in the iOS directory
- Verify the module is properly linked in Xcode
- Check iOS deployment target is 11.0 or higher

### Android Issues  
- Ensure you've rebuilt the app after installing the package
- Verify Android permissions are correctly declared
- Check minimum SDK version is 21 or higher

### Common Issues
- **"Module not found"**: Make sure you've properly linked the native module
- **"Permission denied"**: Check that required permissions are declared and granted
- **"Location unavailable"**: Ensure location permissions are granted and GPS is enabled

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](https://github.com/appleboy45/react-native-device-info-sdk#readme)
- 🐛 [Issue Tracker](https://github.com/appleboy45/react-native-device-info-sdk/issues)
- 💬 [Discussions](https://github.com/appleboy45/react-native-device-info-sdk/discussions)

---

Made with ❤️ for the React Native community