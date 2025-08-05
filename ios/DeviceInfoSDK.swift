import Foundation
import UIKit
import CoreTelephony
import Network
import SystemConfiguration.CaptiveNetwork

@objc(DeviceInfoSDK)
class DeviceInfoSDK: NSObject {
  
  @objc(getDeviceInfo:rejecter:)
  func getDeviceInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let deviceInfo: [String: Any] = [
        "deviceId": getDeviceId(),
        "deviceName": UIDevice.current.name,
        "systemName": UIDevice.current.systemName,
        "systemVersion": UIDevice.current.systemVersion,
        "model": UIDevice.current.model,
        "brand": "Apple",
        "buildNumber": getBuildNumber(),
        "bundleId": getBundleId(),
        "version": getAppVersion(),
        "buildId": getBuildNumber(),
        "manufacturer": "Apple",
        "isEmulator": isEmulator(),
        "isTablet": isTablet(),
        "totalMemory": getTotalMemory(),
        "freeMemory": getFreeMemory(),
        "totalStorage": getTotalStorage(),
        "freeStorage": getFreeStorage(),
        "batteryLevel": getBatteryLevel(),
        "isCharging": isCharging(),
        "ipAddress": getIPAddress() ?? NSNull(),
        "macAddress": getMacAddress() ?? NSNull(),
        "carrier": getCarrier() ?? NSNull(),
        "timezone": TimeZone.current.identifier,
        "locale": Locale.current.identifier
      ]
      resolve(deviceInfo)
    } catch {
      reject("DEVICE_INFO_ERROR", "Failed to get device info: \(error.localizedDescription)", error)
    }
  }
  
  @objc(getBatteryInfo:rejecter:)
  func getBatteryInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let batteryInfo: [String: Any] = [
        "level": getBatteryLevel(),
        "isCharging": isCharging()
      ]
      resolve(batteryInfo)
    } catch {
      reject("BATTERY_INFO_ERROR", "Failed to get battery info: \(error.localizedDescription)", error)
    }
  }
  
  @objc(getNetworkInfo:rejecter:)
  func getNetworkInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let networkInfo: [String: Any] = [
        "connectionType": getConnectionType(),
        "isConnected": isNetworkConnected(),
        "isWifiEnabled": isWifiEnabled()
      ]
      resolve(networkInfo)
    } catch {
      reject("NETWORK_INFO_ERROR", "Failed to get network info: \(error.localizedDescription)", error)
    }
  }
  
  @objc(getStorageInfo:rejecter:)
  func getStorageInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let storageInfo: [String: Any] = [
        "total": getTotalStorage(),
        "free": getFreeStorage()
      ]
      resolve(storageInfo)
    } catch {
      reject("STORAGE_INFO_ERROR", "Failed to get storage info: \(error.localizedDescription)", error)
    }
  }
  
  @objc(getMemoryInfo:rejecter:)
  func getMemoryInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let memoryInfo: [String: Any] = [
        "total": getTotalMemory(),
        "free": getFreeMemory()
      ]
      resolve(memoryInfo)
    } catch {
      reject("MEMORY_INFO_ERROR", "Failed to get memory info: \(error.localizedDescription)", error)
    }
  }
  
  @objc(getCurrentLocation:rejecter:)
  func getCurrentLocation(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      // For this POC, we'll return a placeholder
      // In a real implementation, you'd use CoreLocation
      let locationInfo: [String: Any] = [
        "latitude": 0.0,
        "longitude": 0.0,
        "accuracy": 0.0,
        "timestamp": Date().timeIntervalSince1970 * 1000
      ]
      resolve(locationInfo)
    } catch {
      reject("LOCATION_ERROR", "Failed to get location: \(error.localizedDescription)", error)
    }
  }
  
  @objc(getSystemInfo:rejecter:)
  func getSystemInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let systemInfo: [String: Any] = [
        "platform": "ios",
        "version": UIDevice.current.systemVersion,
        "model": UIDevice.current.model,
        "manufacturer": "Apple"
      ]
      resolve(systemInfo)
    } catch {
      reject("SYSTEM_INFO_ERROR", "Failed to get system info: \(error.localizedDescription)", error)
    }
  }
  
  @objc(isEmulator:rejecter:)
  func isEmulator(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve(isEmulator())
  }
  
  @objc(isTablet:rejecter:)
  func isTablet(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve(isTablet())
  }
  
  @objc(getUniqueId:rejecter:)
  func getUniqueId(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve(getDeviceId())
  }
  
  @objc(getAppInfo:rejecter:)
  func getAppInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let appInfo: [String: Any] = [
        "appName": getAppName(),
        "bundleId": getBundleId(),
        "version": getAppVersion(),
        "buildNumber": getBuildNumber()
      ]
      resolve(appInfo)
    } catch {
      reject("APP_INFO_ERROR", "Failed to get app info: \(error.localizedDescription)", error)
    }
  }
  
  // MARK: - Helper Methods
  
  private func getDeviceId() -> String {
    return UIDevice.current.identifierForVendor?.uuidString ?? "unknown"
  }
  
  private func getAppVersion() -> String {
    return Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
  }
  
  private func getBuildNumber() -> String {
    return Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "unknown"
  }
  
  private func getBundleId() -> String {
    return Bundle.main.bundleIdentifier ?? "unknown"
  }
  
  private func getAppName() -> String {
    return Bundle.main.infoDictionary?["CFBundleDisplayName"] as? String ??
           Bundle.main.infoDictionary?["CFBundleName"] as? String ?? "unknown"
  }
  
  private func isEmulator() -> Bool {
    #if targetEnvironment(simulator)
    return true
    #else
    return false
    #endif
  }
  
  private func isTablet() -> Bool {
    return UIDevice.current.userInterfaceIdiom == .pad
  }
  
  private func getTotalMemory() -> Int64 {
    return Int64(ProcessInfo.processInfo.physicalMemory)
  }
  
  private func getFreeMemory() -> Int64 {
    let host_port = mach_host_self()
    var host_size = mach_msg_type_number_t(MemoryLayout<vm_statistics_data_t>.stride / MemoryLayout<integer_t>.stride)
    var pagesize: vm_size_t = 0
    var vm_stat = vm_statistics_data_t()
    
    host_page_size(host_port, &pagesize)
    
    let kern: kern_return_t = withUnsafeMutablePointer(to: &vm_stat) {
      $0.withMemoryRebound(to: integer_t.self, capacity: Int(host_size)) {
        host_statistics(host_port, HOST_VM_INFO, $0, &host_size)
      }
    }
    
    if kern == KERN_SUCCESS {
      let free_memory = Int64(vm_stat.free_count) * Int64(pagesize)
      return free_memory
    }
    
    return 0
  }
  
  private func getTotalStorage() -> Int64 {
    do {
      let fileURL = URL(fileURLWithPath: NSHomeDirectory())
      let values = try fileURL.resourceValues(forKeys: [.volumeTotalCapacityKey])
      return Int64(values.volumeTotalCapacity ?? 0)
    } catch {
      return 0
    }
  }
  
  private func getFreeStorage() -> Int64 {
    do {
      let fileURL = URL(fileURLWithPath: NSHomeDirectory())
      let values = try fileURL.resourceValues(forKeys: [.volumeAvailableCapacityKey])
      return Int64(values.volumeAvailableCapacity ?? 0)
    } catch {
      return 0
    }
  }
  
  private func getBatteryLevel() -> Float {
    UIDevice.current.isBatteryMonitoringEnabled = true
    let batteryLevel = UIDevice.current.batteryLevel
    return batteryLevel >= 0 ? batteryLevel * 100 : -1
  }
  
  private func isCharging() -> Bool {
    UIDevice.current.isBatteryMonitoringEnabled = true
    return UIDevice.current.batteryState == .charging || UIDevice.current.batteryState == .full
  }
  
  private func getConnectionType() -> String {
    let monitor = NWPathMonitor()
    var connectionType = "none"
    
    monitor.pathUpdateHandler = { path in
      if path.usesInterfaceType(.wifi) {
        connectionType = "wifi"
      } else if path.usesInterfaceType(.cellular) {
        connectionType = "cellular"
      } else if path.usesInterfaceType(.wiredEthernet) {
        connectionType = "ethernet"
      } else {
        connectionType = "unknown"
      }
    }
    
    let queue = DispatchQueue(label: "NetworkMonitor")
    monitor.start(queue: queue)
    
    return connectionType
  }
  
  private func isNetworkConnected() -> Bool {
    let monitor = NWPathMonitor()
    var isConnected = false
    
    monitor.pathUpdateHandler = { path in
      isConnected = path.status == .satisfied
    }
    
    let queue = DispatchQueue(label: "NetworkMonitor")
    monitor.start(queue: queue)
    
    return isConnected
  }
  
  private func isWifiEnabled() -> Bool {
    // This is a simplified check for WiFi availability
    let monitor = NWPathMonitor(requiredInterfaceType: .wifi)
    var isAvailable = false
    
    monitor.pathUpdateHandler = { path in
      isAvailable = path.status == .satisfied
    }
    
    let queue = DispatchQueue(label: "WiFiMonitor")
    monitor.start(queue: queue)
    
    return isAvailable
  }
  
  private func getIPAddress() -> String? {
    var address: String?
    var ifaddr: UnsafeMutablePointer<ifaddrs>? = nil
    
    if getifaddrs(&ifaddr) == 0 {
      var ptr = ifaddr
      while ptr != nil {
        defer { ptr = ptr?.pointee.ifa_next }
        
        let interface = ptr?.pointee
        let addrFamily = interface?.ifa_addr.pointee.sa_family
        
        if addrFamily == UInt8(AF_INET) || addrFamily == UInt8(AF_INET6) {
          let name: String = String(cString: (interface?.ifa_name)!)
          
          if name == "en0" {
            var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
            getnameinfo(interface?.ifa_addr, socklen_t((interface?.ifa_addr.pointee.sa_len)!), &hostname, socklen_t(hostname.count), nil, socklen_t(0), NI_NUMERICHOST)
            address = String(cString: hostname)
          }
        }
      }
      freeifaddrs(ifaddr)
    }
    
    return address
  }
  
  private func getMacAddress() -> String? {
    // MAC address retrieval is restricted in iOS
    return "02:00:00:00:00:00" // Default value for privacy
  }
  
  private func getCarrier() -> String? {
    let networkInfo = CTTelephonyNetworkInfo()
    if let carrier = networkInfo.subscriberCellularProvider {
      return carrier.carrierName
    }
    return nil
  }
}