/**
 * Device Info SDK Example App
 * Demonstrates the usage of react-native-device-info-sdk
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from 'react-native';

// Import our Device Info SDK
// Note: In a real app, you'd install this via npm: npm install react-native-device-info-sdk
import DeviceInfoSDK, {
  type DeviceInfo,
  type NetworkInfo,
} from 'react-native-device-info-sdk';

interface InfoCardProps {
  title: string;
  data: any;
  onPress?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({title, data, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardData}>
      {data === null || data === undefined 
        ? 'Loading...' 
        : typeof data === 'object' 
          ? JSON.stringify(data, null, 2) 
          : String(data)
      }
    </Text>
  </TouchableOpacity>
);

function App(): React.JSX.Element {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [appInfo, setAppInfo] = useState<any>(null);
  const [isEmulator, setIsEmulator] = useState<boolean | null>(null);
  const [isTablet, setIsTablet] = useState<boolean | null>(null);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllInfo = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting to fetch device information...');

      // Test individual methods
      try {
        const device = await DeviceInfoSDK.getDeviceInfo();
        console.log('✅ Device Info:', device);
        setDeviceInfo(device);
      } catch (error) {
        console.error('❌ Device Info Error:', error);
      }

      try {
        const battery = await DeviceInfoSDK.getBatteryInfo();
        console.log('✅ Battery Info:', battery);
        setBatteryInfo(battery);
      } catch (error) {
        console.error('❌ Battery Info Error:', error);
      }

      try {
        const network = await DeviceInfoSDK.getNetworkInfo();
        console.log('✅ Network Info:', network);
        setNetworkInfo(network);
      } catch (error) {
        console.error('❌ Network Info Error:', error);
      }

      try {
        const storage = await DeviceInfoSDK.getStorageInfo();
        console.log('✅ Storage Info:', storage);
        setStorageInfo(storage);
      } catch (error) {
        console.error('❌ Storage Info Error:', error);
      }

      try {
        const memory = await DeviceInfoSDK.getMemoryInfo();
        console.log('✅ Memory Info:', memory);
        setMemoryInfo(memory);
      } catch (error) {
        console.error('❌ Memory Info Error:', error);
      }

      try {
        const system = await DeviceInfoSDK.getSystemInfo();
        console.log('✅ System Info:', system);
        setSystemInfo(system);
      } catch (error) {
        console.error('❌ System Info Error:', error);
      }

      try {
        const app = await DeviceInfoSDK.getAppInfo();
        console.log('✅ App Info:', app);
        setAppInfo(app);
      } catch (error) {
        console.error('❌ App Info Error:', error);
      }

      try {
        const emulator = await DeviceInfoSDK.isEmulator();
        console.log('✅ Is Emulator:', emulator);
        setIsEmulator(emulator);
      } catch (error) {
        console.error('❌ Emulator Check Error:', error);
      }

      try {
        const tablet = await DeviceInfoSDK.isTablet();
        console.log('✅ Is Tablet:', tablet);
        setIsTablet(tablet);
      } catch (error) {
        console.error('❌ Tablet Check Error:', error);
      }

      try {
        const id = await DeviceInfoSDK.getUniqueId();
        console.log('✅ Unique ID:', id);
        setUniqueId(id);
      } catch (error) {
        console.error('❌ Unique ID Error:', error);
      }

      console.log('🎉 Finished fetching device information');

    } catch (error) {
      console.error('💥 Critical Error fetching device info:', error);
      Alert.alert('Error', 'Failed to fetch device information');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocation = async () => {
    try {
      console.log('📍 Fetching location...');
      const location = await DeviceInfoSDK.getCurrentLocation();
      console.log('✅ Location:', location);
      Alert.alert(
        'Location', 
        `Lat: ${location.latitude}\nLng: ${location.longitude}\nAccuracy: ${location.accuracy}m`
      );
    } catch (error) {
      console.error('❌ Location Error:', error);
      Alert.alert('Error', `Failed to get location: ${error}`);
    }
  };

  useEffect(() => {
    console.log('🚀 App mounted, fetching device info...');
    fetchAllInfo();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAllInfo} />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Device Info SDK Demo</Text>
          <Text style={styles.subtitle}>
            Pull to refresh • Check console for logs
          </Text>
        </View>

        <View style={styles.content}>
          {/* Quick Status */}
          <InfoCard
            title="🎯 Quick Status"
            data={{
              isEmulator: isEmulator ?? 'Loading...',
              isTablet: isTablet ?? 'Loading...',
              platform: systemInfo?.platform ?? 'Loading...',
            }}
          />

          {/* System Information */}
          <InfoCard title="💻 System Info" data={systemInfo} />
          
          {/* App Information */}
          <InfoCard title="📦 App Info" data={appInfo} />

          {/* Battery Information */}
          <InfoCard title="🔋 Battery Info" data={batteryInfo} />

          {/* Network Information */}
          <InfoCard title="🌐 Network Info" data={networkInfo} />

          {/* Memory Information */}
          <InfoCard
            title="🧠 Memory Info"
            data={
              memoryInfo
                ? {
                    total: formatBytes(memoryInfo.total),
                    free: formatBytes(memoryInfo.free),
                    used: formatBytes(memoryInfo.total - memoryInfo.free),
                    'usage%': Math.round(((memoryInfo.total - memoryInfo.free) / memoryInfo.total) * 100),
                  }
                : null
            }
          />

          {/* Storage Information */}
          <InfoCard
            title="💾 Storage Info"
            data={
              storageInfo
                ? {
                    total: formatBytes(storageInfo.total),
                    free: formatBytes(storageInfo.free),
                    used: formatBytes(storageInfo.total - storageInfo.free),
                    'usage%': Math.round(((storageInfo.total - storageInfo.free) / storageInfo.total) * 100),
                  }
                : null
            }
          />

          {/* Unique Device ID */}
          <InfoCard 
            title="🆔 Device ID" 
            data={uniqueId ? { uniqueId } : null} 
          />

          {/* Complete Device Information */}
          <InfoCard title="📋 Complete Device Info" data={deviceInfo} />

          {/* Action Buttons */}
          <TouchableOpacity style={styles.button} onPress={fetchLocation}>
            <Text style={styles.buttonText}>📍 Get Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={fetchAllInfo}>
            <Text style={styles.buttonText}>🔄 Refresh All Data</Text>
          </TouchableOpacity>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>ℹ️ Instructions:</Text>
            <Text style={styles.instructionsText}>
              • This demo shows all device information available through the SDK{'\n'}
              • Check the console/logs for detailed output{'\n'}
              • Pull down to refresh all data{'\n'}
              • Tap "Get Location" to test location services{'\n'}
              • All errors are logged and handled gracefully
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
  },
  cardData: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});

export default App;