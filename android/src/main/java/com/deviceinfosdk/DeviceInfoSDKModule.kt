package com.deviceinfosdk

import android.app.ActivityManager
import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager
import android.os.BatteryManager
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.provider.Settings
import android.telephony.TelephonyManager
import com.facebook.react.bridge.*
import java.io.File
import java.net.InetAddress
import java.net.NetworkInterface
import java.util.*

class DeviceInfoSDKModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    private val context: Context = reactContext

    override fun getName(): String {
        return "DeviceInfoSDK"
    }

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            val deviceInfo = Arguments.createMap().apply {
                putString("deviceId", getDeviceId())
                putString("deviceName", Build.MODEL)
                putString("systemName", "Android")
                putString("systemVersion", Build.VERSION.RELEASE)
                putString("model", Build.MODEL)
                putString("brand", Build.BRAND)
                putString("buildNumber", Build.DISPLAY)
                putString("bundleId", context.packageName)
                putString("version", getAppVersion())
                putString("buildId", Build.ID)
                putString("manufacturer", Build.MANUFACTURER)
                putBoolean("isEmulator", isEmulator())
                putBoolean("isTablet", isTablet())
                putDouble("totalMemory", getTotalMemory().toDouble())
                putDouble("freeMemory", getFreeMemory().toDouble())
                putDouble("totalStorage", getTotalStorage().toDouble())
                putDouble("freeStorage", getFreeStorage().toDouble())
                putDouble("batteryLevel", getBatteryLevel().toDouble())
                putBoolean("isCharging", isCharging())
                putString("ipAddress", getIPAddress())
                putString("macAddress", getMacAddress())
                putString("carrier", getCarrier())
                putString("timezone", TimeZone.getDefault().id)
                putString("locale", Locale.getDefault().toString())
            }
            promise.resolve(deviceInfo)
        } catch (e: Exception) {
            promise.reject("DEVICE_INFO_ERROR", "Failed to get device info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getBatteryInfo(promise: Promise) {
        try {
            val batteryInfo = Arguments.createMap().apply {
                putDouble("level", getBatteryLevel().toDouble())
                putBoolean("isCharging", isCharging())
            }
            promise.resolve(batteryInfo)
        } catch (e: Exception) {
            promise.reject("BATTERY_INFO_ERROR", "Failed to get battery info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getNetworkInfo(promise: Promise) {
        try {
            val networkInfo = Arguments.createMap().apply {
                putString("connectionType", getConnectionType())
                putBoolean("isConnected", isNetworkConnected())
                putBoolean("isWifiEnabled", isWifiEnabled())
            }
            promise.resolve(networkInfo)
        } catch (e: Exception) {
            promise.reject("NETWORK_INFO_ERROR", "Failed to get network info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getStorageInfo(promise: Promise) {
        try {
            val storageInfo = Arguments.createMap().apply {
                putDouble("total", getTotalStorage().toDouble())
                putDouble("free", getFreeStorage().toDouble())
            }
            promise.resolve(storageInfo)
        } catch (e: Exception) {
            promise.reject("STORAGE_INFO_ERROR", "Failed to get storage info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getMemoryInfo(promise: Promise) {
        try {
            val memoryInfo = Arguments.createMap().apply {
                putDouble("total", getTotalMemory().toDouble())
                putDouble("free", getFreeMemory().toDouble())
            }
            promise.resolve(memoryInfo)
        } catch (e: Exception) {
            promise.reject("MEMORY_INFO_ERROR", "Failed to get memory info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        try {
            // For this POC, we'll return a placeholder
            // In a real implementation, you'd use LocationManager or FusedLocationProvider
            val locationInfo = Arguments.createMap().apply {
                putDouble("latitude", 0.0)
                putDouble("longitude", 0.0)
                putDouble("accuracy", 0.0)
                putDouble("timestamp", System.currentTimeMillis().toDouble())
            }
            promise.resolve(locationInfo)
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", "Failed to get location: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getSystemInfo(promise: Promise) {
        try {
            val systemInfo = Arguments.createMap().apply {
                putString("platform", "android")
                putString("version", Build.VERSION.RELEASE)
                putString("model", Build.MODEL)
                putString("manufacturer", Build.MANUFACTURER)
            }
            promise.resolve(systemInfo)
        } catch (e: Exception) {
            promise.reject("SYSTEM_INFO_ERROR", "Failed to get system info: ${e.message}", e)
        }
    }

    @ReactMethod
    fun isEmulator(promise: Promise) {
        try {
            promise.resolve(isEmulator())
        } catch (e: Exception) {
            promise.reject("EMULATOR_CHECK_ERROR", "Failed to check emulator: ${e.message}", e)
        }
    }

    @ReactMethod
    fun isTablet(promise: Promise) {
        try {
            promise.resolve(isTablet())
        } catch (e: Exception) {
            promise.reject("TABLET_CHECK_ERROR", "Failed to check tablet: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getUniqueId(promise: Promise) {
        try {
            promise.resolve(getDeviceId())
        } catch (e: Exception) {
            promise.reject("UNIQUE_ID_ERROR", "Failed to get unique ID: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getAppInfo(promise: Promise) {
        try {
            val appInfo = Arguments.createMap().apply {
                putString("appName", getAppName())
                putString("bundleId", context.packageName)
                putString("version", getAppVersion())
                putString("buildNumber", getBuildNumber())
            }
            promise.resolve(appInfo)
        } catch (e: Exception) {
            promise.reject("APP_INFO_ERROR", "Failed to get app info: ${e.message}", e)
        }
    }

    // Helper methods
    private fun getDeviceId(): String {
        return Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
    }

    private fun getAppVersion(): String {
        return try {
            val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            packageInfo.versionName ?: "unknown"
        } catch (e: Exception) {
            "unknown"
        }
    }

    private fun getBuildNumber(): String {
        return try {
            val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo.longVersionCode.toString()
            } else {
                @Suppress("DEPRECATION")
                packageInfo.versionCode.toString()
            }
        } catch (e: Exception) {
            "unknown"
        }
    }

    private fun getAppName(): String {
        return try {
            val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            context.packageManager.getApplicationLabel(packageInfo.applicationInfo).toString()
        } catch (e: Exception) {
            "unknown"
        }
    }

    private fun isEmulator(): Boolean {
        return (Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")
                || Build.MANUFACTURER.contains("Genymotion")
                || Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic")
                || "google_sdk" == Build.PRODUCT)
    }

    private fun isTablet(): Boolean {
        val configuration = context.resources.configuration
        return (configuration.screenLayout and android.content.res.Configuration.SCREENLAYOUT_SIZE_MASK) >= 
               android.content.res.Configuration.SCREENLAYOUT_SIZE_LARGE
    }

    private fun getTotalMemory(): Long {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memInfo)
        return memInfo.totalMem
    }

    private fun getFreeMemory(): Long {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memInfo)
        return memInfo.availMem
    }

    private fun getTotalStorage(): Long {
        val stat = StatFs(Environment.getDataDirectory().path)
        return stat.blockCountLong * stat.blockSizeLong
    }

    private fun getFreeStorage(): Long {
        val stat = StatFs(Environment.getDataDirectory().path)
        return stat.availableBlocksLong * stat.blockSizeLong
    }

    private fun getBatteryLevel(): Float {
        val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY).toFloat()
    }

    private fun isCharging(): Boolean {
        val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        return batteryManager.isCharging
    }

    private fun getConnectionType(): String {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return "none"
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return "none"

        return when {
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "wifi"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "cellular"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "ethernet"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_BLUETOOTH) -> "bluetooth"
            else -> "unknown"
        }
    }

    private fun isNetworkConnected(): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun isWifiEnabled(): Boolean {
        val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        return wifiManager.isWifiEnabled
    }

    private fun getIPAddress(): String? {
        try {
            val interfaces = NetworkInterface.getNetworkInterfaces()
            while (interfaces.hasMoreElements()) {
                val networkInterface = interfaces.nextElement()
                val addresses = networkInterface.inetAddresses
                while (addresses.hasMoreElements()) {
                    val address = addresses.nextElement()
                    if (!address.isLoopbackAddress && address is java.net.Inet4Address) {
                        return address.hostAddress
                    }
                }
            }
        } catch (e: Exception) {
            // Handle exception
        }
        return null
    }

    private fun getMacAddress(): String? {
        // Note: Getting MAC address is restricted in newer Android versions
        return "02:00:00:00:00:00" // Default value for privacy
    }

    private fun getCarrier(): String? {
        return try {
            val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            telephonyManager.networkOperatorName
        } catch (e: Exception) {
            null
        }
    }
}