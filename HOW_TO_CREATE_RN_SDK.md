# How to Create a React Native SDK: Complete Step-by-Step Guide

## Table of Contents
1. [Understanding React Native SDK Architecture](#understanding-react-native-sdk-architecture)
2. [Setting Up the Project Structure](#setting-up-the-project-structure)
3. [Creating TypeScript Interfaces](#creating-typescript-interfaces)
4. [Implementing Android Native Module](#implementing-android-native-module)
5. [Implementing iOS Native Module](#implementing-ios-native-module)
6. [Setting Up Package Configuration](#setting-up-package-configuration)
7. [Creating Example Application](#creating-example-application)
8. [Building and Testing](#building-and-testing)
9. [Publishing the SDK](#publishing-the-sdk)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Understanding React Native SDK Architecture

### What is a React Native SDK?

A React Native SDK is a library that exposes native platform functionality (Android/iOS) to JavaScript through React Native's bridge system. Unlike regular npm packages that contain only JavaScript, an SDK includes:

- **JavaScript/TypeScript Interface**: The API that React Native apps will use
- **Native Android Code**: Java/Kotlin modules that access Android platform APIs
- **Native iOS Code**: Swift/Objective-C modules that access iOS platform APIs
- **Bridge Configuration**: Setup to connect native code with JavaScript

### Architecture Overview

```
React Native App
       ↓ (calls)
JavaScript Interface (TypeScript)
       ↓ (bridges to)
Native Modules (Android: Kotlin, iOS: Swift)
       ↓ (accesses)
Platform APIs (Android APIs, iOS APIs)
```

### SDK vs App Structure Comparison

**React Native App Structure:**
```
MyApp/
├── android/app/               # Complete Android application
│   ├── MainActivity.java      # App's main activity
│   ├── AndroidManifest.xml    # Full app manifest
│   └── ... (complete app)
├── ios/MyApp/                 # Complete iOS application
│   ├── AppDelegate.m          # App delegate
│   ├── Info.plist            # App configuration
│   └── ... (complete app)
└── src/                      # App's React Native code
```

**SDK Structure:**
```
MySDK/
├── android/src/main/java/    # Only SDK's native module
│   └── com/mysdk/
│       ├── MySDKModule.kt    # Native module code only
│       └── MySDKPackage.kt   # Package registration
├── ios/                      # Only SDK's native module
│   ├── MySDK.swift          # Native module code only
│   ├── MySDK.m              # Objective-C bridge
│   └── MySDK.podspec        # CocoaPods spec
├── src/                     # JavaScript interface
│   └── index.ts             # SDK's public API
└── example/                 # Demo app (optional)
```

---

## Setting Up the Project Structure

### Step 1: Create the Basic Directory Structure

```bash
# Create main SDK directory
mkdir react-native-your-sdk-name
cd react-native-your-sdk-name

# Create required directories
mkdir -p src
mkdir -p android/src/main/java/com/yoursdkname
mkdir -p ios
mkdir -p example
```

### Step 2: Initialize NPM Package

```bash
npm init -y
```

### Step 3: Create Essential Configuration Files

**package.json** (SDK configuration):
```json
{
  "name": "react-native-your-sdk-name",
  "version": "1.0.0",
  "description": "Your SDK description",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "react-native": "src/index.ts",
  "source": "src/index.ts",
  "files": [
    "lib",
    "android",
    "ios",
    "src",
    "*.podspec"
  ],
  "scripts": {
    "build": "bob build",
    "prepare": "bob build"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  },
  "devDependencies": {
    "react-native-builder-bob": "^0.20.0",
    "typescript": "^4.5.2"
  }
}
```

**tsconfig.json** (TypeScript configuration):
```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "moduleResolution": "node",
    "declaration": true,
    "strict": true,
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": false
  },
  "exclude": ["example", "lib", "node_modules"]
}
```

---

## Creating TypeScript Interfaces

### Step 3: Define Your SDK's Public API

Create `src/index.ts`:

```typescript
import { NativeModules, Platform } from 'react-native';

// Define data types your SDK will return
export interface YourDataType {
  id: string;
  name: string;
  value: number;
  // Add more properties as needed
}

// Define the native module interface
interface YourSDKInterface {
  // Define methods that will be implemented in native code
  getData(): Promise<YourDataType>;
  performAction(input: string): Promise<boolean>;
  // Add more methods as needed
}

// Error handling for missing native module
const LINKING_ERROR =
  `The package 'react-native-your-sdk-name' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Get the native module with error handling
const YourSDK = NativeModules['YourSDKName']
  ? NativeModules['YourSDKName']
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// Create SDK manager class with enhanced error handling
class YourSDKManager implements YourSDKInterface {
  async getData(): Promise<YourDataType> {
    try {
      return await YourSDK.getData();
    } catch (error) {
      throw new Error(`Failed to get data: ${error}`);
    }
  }

  async performAction(input: string): Promise<boolean> {
    try {
      return await YourSDK.performAction(input);
    } catch (error) {
      throw new Error(`Failed to perform action: ${error}`);
    }
  }
}

// Export the singleton instance
export default new YourSDKManager();

// Export types for consumers
export type { YourSDKInterface, YourDataType };
```

---

## Implementing Android Native Module

### Step 4: Create Android Native Module

**android/build.gradle** (Android build configuration):
```gradle
buildscript {
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath "com.android.tools.build:gradle:7.2.1"
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.10"
  }
}

apply plugin: "com.android.library"
apply plugin: "kotlin-android"

android {
  compileSdkVersion 33
  
  defaultConfig {
    minSdkVersion 21
    targetSdkVersion 33
  }
  
  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
  
  kotlinOptions {
    jvmTarget = "1.8"
  }
}

dependencies {
  implementation "com.facebook.react:react-native:+"
  implementation "org.jetbrains.kotlin:kotlin-stdlib:1.7.10"
}
```

**android/src/main/AndroidManifest.xml** (Permissions):
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.yoursdkname">
  
  <!-- Add permissions your SDK needs -->
  <uses-permission android:name="android.permission.INTERNET" />
  <!-- Add more permissions as needed -->
  
</manifest>
```

**android/src/main/java/com/yoursdkname/YourSDKModule.kt** (Main native module):
```kotlin
package com.yoursdkname

import com.facebook.react.bridge.*

class YourSDKModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    private val context: Context = reactContext

    override fun getName(): String {
        return "YourSDKName"  // This name must match JavaScript import
    }

    @ReactMethod
    fun getData(promise: Promise) {
        try {
            // Your native Android logic here
            val data = Arguments.createMap().apply {
                putString("id", "android_123")
                putString("name", "Android Data")
                putInt("value", 42)
            }
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("GET_DATA_ERROR", "Failed to get data: ${e.message}", e)
        }
    }

    @ReactMethod
    fun performAction(input: String, promise: Promise) {
        try {
            // Your native Android logic here
            val success = processInput(input)
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("ACTION_ERROR", "Failed to perform action: ${e.message}", e)
        }
    }

    // Helper methods
    private fun processInput(input: String): Boolean {
        // Implement your business logic
        return input.isNotEmpty()
    }
}
```

**android/src/main/java/com/yoursdkname/YourSDKPackage.kt** (Package registration):
```kotlin
package com.yoursdkname

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class YourSDKPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(YourSDKModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

---

## Implementing iOS Native Module

### Step 5: Create iOS Native Module

**ios/YourSDK.podspec** (CocoaPods specification):
```ruby
require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "package.json")))

Pod::Spec.new do |s|
  s.name         = "YourSDK"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  s.source_files = "*.{h,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React-Core"
end
```

**ios/YourSDK.m** (Objective-C bridge):
```objc
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(YourSDKName, NSObject)

RCT_EXTERN_METHOD(getData:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(performAction:(NSString *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
```

**ios/YourSDK.swift** (Swift implementation):
```swift
import Foundation

@objc(YourSDKName)
class YourSDK: NSObject {
  
  @objc(getData:rejecter:)
  func getData(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      // Your native iOS logic here
      let data: [String: Any] = [
        "id": "ios_123",
        "name": "iOS Data",
        "value": 42
      ]
      resolve(data)
    } catch {
      reject("GET_DATA_ERROR", "Failed to get data: \(error.localizedDescription)", error)
    }
  }
  
  @objc(performAction:resolver:rejecter:)
  func performAction(input: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      // Your native iOS logic here
      let success = processInput(input)
      resolve(success)
    } catch {
      reject("ACTION_ERROR", "Failed to perform action: \(error.localizedDescription)", error)
    }
  }
  
  // Helper methods
  private func processInput(_ input: String) -> Bool {
    // Implement your business logic
    return !input.isEmpty
  }
}
```

---

## Setting Up Package Configuration

### Step 6: Configure Build and Package Settings

**react-native-your-sdk-name.podspec** (Root podspec):
```ruby
require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-your-sdk-name"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React-Core"
end
```

**Update package.json** with builder configuration:
```json
{
  "react-native-builder-bob": {
    "source": "src",
    "output": "lib",
    "targets": [
      "commonjs",
      "module",
      [
        "typescript",
        {
          "project": "tsconfig.build.json"
        }
      ]
    ]
  }
}
```

**tsconfig.build.json** (Build-specific TypeScript config):
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "lib/typescript"
  },
  "exclude": ["example", "lib", "node_modules"]
}
```

---

## Creating Example Application

### Step 7: Create Demo App

**example/package.json**:
```json
{
  "name": "your-sdk-example",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-your-sdk-name": "file:.."
  }
}
```

**example/App.tsx** (Demo application):
```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import YourSDK, { YourDataType } from 'react-native-your-sdk-name';

const App = () => {
  const [data, setData] = useState<YourDataType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await YourSDK.getData();
      setData(result);
      console.log('SDK Data:', result);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `Failed to get data: ${error}`);
    }
  };

  const performAction = async () => {
    try {
      const success = await YourSDK.performAction('test input');
      Alert.alert('Success', `Action completed: ${success}`);
    } catch (error) {
      Alert.alert('Error', `Action failed: ${error}`);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Your SDK Demo</Text>
      
      {data && (
        <View style={{ marginBottom: 20 }}>
          <Text>ID: {data.id}</Text>
          <Text>Name: {data.name}</Text>
          <Text>Value: {data.value}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={{ backgroundColor: '#007bff', padding: 15, marginBottom: 10 }}
        onPress={fetchData}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Get Data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: '#28a745', padding: 15 }}
        onPress={performAction}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Perform Action</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
```

---

## Building and Testing

### Step 8: Build the SDK

```bash
# Install dependencies
npm install

# Build the SDK
npm run prepare

# The build creates:
# - lib/commonjs/     (CommonJS build)
# - lib/module/       (ES modules build)
# - lib/typescript/   (TypeScript definitions)
```

### Step 9: Test with Example App

```bash
# Navigate to example directory
cd example

# Install dependencies
npm install

# For iOS, install pods
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

### Step 10: Integration Testing

**In a consuming React Native app:**

1. **Install your SDK:**
```bash
npm install react-native-your-sdk-name
```

2. **iOS Setup:**
```bash
cd ios && pod install
```

3. **Use in your app:**
```tsx
import YourSDK from 'react-native-your-sdk-name';

const data = await YourSDK.getData();
```

---

## Publishing the SDK

### Step 11: Prepare for Publishing

**Create .gitignore:**
```
node_modules/
lib/
*.log
.DS_Store
android/build/
ios/build/
example/node_modules/
```

**Create README.md** with:
- Installation instructions
- Usage examples
- API documentation
- Platform requirements
- Troubleshooting guide

### Step 12: Publish to NPM

```bash
# Build the final package
npm run prepare

# Login to NPM (if not already)
npm login

# Publish
npm publish

# Or publish with specific tag
npm publish --tag beta
```

### Step 13: Version Management

```bash
# Update version
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.1 -> 1.1.0
npm version major   # 1.1.0 -> 2.0.0

# Publish new version
npm publish
```

---

## Troubleshooting Common Issues

### Android Issues

**Problem: Module not found**
```
Solution: Ensure the module name in getName() matches the JavaScript import name
```

**Problem: Build failures**
```
Solution: Check Gradle version compatibility and dependencies
```

**Problem: Permissions denied**
```
Solution: Verify AndroidManifest.xml has required permissions
```

### iOS Issues

**Problem: Module not linking**
```
Solution: 
1. Run `pod install` in iOS directory
2. Verify podspec is correctly configured
3. Check Xcode project settings
```

**Problem: Swift compilation errors**
```
Solution:
1. Ensure iOS deployment target is 11.0+
2. Check Swift syntax and imports
3. Verify Objective-C bridge matches Swift methods
```

### JavaScript/TypeScript Issues

**Problem: Type errors**
```
Solution:
1. Ensure TypeScript compilation succeeds
2. Check interface definitions match native implementations
3. Verify export statements are correct
```

**Problem: Runtime errors**
```
Solution:
1. Check native module registration
2. Verify method names match between platforms
3. Add proper error handling in native code
```

### Build Issues

**Problem: Builder bob errors**
```
Solution:
1. Check tsconfig.json configuration
2. Ensure TypeScript is installed
3. Verify package.json build configuration
```

---

## Best Practices

### 1. **Error Handling**
- Always wrap native calls in try-catch blocks
- Provide meaningful error messages
- Use Promise rejection with error codes

### 2. **Performance**
- Minimize bridge calls
- Use async operations for heavy tasks
- Cache results when appropriate

### 3. **Platform Consistency**
- Ensure both platforms return similar data structures
- Handle platform-specific features gracefully
- Provide fallbacks for missing features

### 4. **Documentation**
- Document all public APIs
- Provide usage examples
- Include platform-specific setup instructions

### 5. **Testing**
- Test on both platforms
- Test with different React Native versions
- Include unit tests for native code

### 6. **Versioning**
- Follow semantic versioning
- Maintain changelog
- Test compatibility with major React Native versions

---

## Conclusion

Creating a React Native SDK involves:

1. **Understanding the architecture** - How native code connects to JavaScript
2. **Setting up proper structure** - Organized directories for each platform
3. **Implementing native modules** - Platform-specific code in Kotlin/Swift
4. **Creating TypeScript interfaces** - Type-safe JavaScript API
5. **Configuring build system** - Proper compilation and packaging
6. **Testing thoroughly** - Ensuring it works across platforms and versions
7. **Publishing professionally** - NPM package with proper documentation

The key is understanding that an SDK is essentially a bridge between native platform capabilities and React Native applications, requiring careful coordination between JavaScript, Android, and iOS codebases.

Remember: Start simple, test frequently, and gradually add complexity as you understand the patterns better!

---

## Additional Resources

- [React Native Native Modules Documentation](https://reactnative.dev/docs/native-modules-intro)
- [Android Native Modules Guide](https://reactnative.dev/docs/native-modules-android)
- [iOS Native Modules Guide](https://reactnative.dev/docs/native-modules-ios)
- [React Native Builder Bob](https://github.com/callstack/react-native-builder-bob)
- [CocoaPods Podspec Guide](https://guides.cocoapods.org/syntax/podspec.html)

---

*This guide was created based on building a real Device Info SDK. The patterns and practices shown here are production-ready and follow React Native community standards.*