# React Native SDK Project Structure

## Complete File Structure

```
react-native-device-info-sdk/
├── 📄 package.json                    # NPM package configuration
├── 📄 tsconfig.json                   # TypeScript configuration  
├── 📄 tsconfig.build.json             # Build-specific TypeScript config
├── 📄 react-native-device-info-sdk.podspec # iOS CocoaPods specification
├── 📄 .gitignore                      # Git ignore rules
├── 📄 README.md                       # Package documentation
├── 📄 HOW_TO_CREATE_RN_SDK.md         # Step-by-step creation guide
├── 📄 PROJECT_STRUCTURE.md            # This file
│
├── 📂 src/                            # JavaScript/TypeScript source
│   └── 📄 index.ts                    # Main SDK interface & types
│
├── 📂 android/                        # Android native implementation
│   ├── 📄 build.gradle                # Android build configuration
│   └── 📂 src/main/
│       ├── 📄 AndroidManifest.xml     # Android permissions
│       └── 📂 java/com/deviceinfosdk/
│           ├── 📄 DeviceInfoSDKModule.kt    # Main Android native module
│           └── 📄 DeviceInfoSDKPackage.kt   # Package registration
│
├── 📂 ios/                            # iOS native implementation
│   ├── 📄 DeviceInfoSDK.swift         # Main iOS native module (Swift)
│   ├── 📄 DeviceInfoSDK.m             # Objective-C bridge
│   └── 📄 DeviceInfoSDK.podspec       # iOS CocoaPods specification
│
├── 📂 example/                        # Demo application
│   ├── 📄 package.json               # Example app dependencies
│   └── 📄 App.tsx                     # Demo app implementation
│
└── 📂 lib/                           # Built output (generated)
    ├── 📂 commonjs/                  # CommonJS build
    ├── 📂 module/                    # ES modules build
    └── 📂 typescript/                # TypeScript definitions
```

## Key File Purposes

### Core SDK Files

| File | Purpose | Contains |
|------|---------|----------|
| `src/index.ts` | Main SDK interface | TypeScript API, interfaces, error handling |
| `package.json` | NPM configuration | Dependencies, scripts, metadata |
| `tsconfig.json` | TypeScript config | Compilation settings |
| `*.podspec` | iOS package spec | CocoaPods configuration |

### Android Implementation

| File | Purpose | Contains |
|------|---------|----------|
| `android/build.gradle` | Build configuration | Dependencies, Kotlin setup |
| `AndroidManifest.xml` | Permissions | Required Android permissions |
| `DeviceInfoSDKModule.kt` | Native module | @ReactMethod implementations |
| `DeviceInfoSDKPackage.kt` | Package registration | Module registration for RN |

### iOS Implementation

| File | Purpose | Contains |
|------|---------|----------|
| `DeviceInfoSDK.swift` | Native module | Swift implementations |
| `DeviceInfoSDK.m` | Objective-C bridge | RCT_EXTERN_MODULE declarations |
| `DeviceInfoSDK.podspec` | CocoaPods spec | iOS dependencies and config |

### Supporting Files

| File | Purpose | Contains |
|------|---------|----------|
| `example/App.tsx` | Demo application | SDK usage examples |
| `README.md` | Documentation | Installation, usage, API reference |
| `HOW_TO_CREATE_RN_SDK.md` | Tutorial | Step-by-step creation guide |
| `.gitignore` | Git configuration | Files to ignore in version control |

## Build Output Structure (`lib/`)

```
lib/
├── commonjs/           # For Node.js/CommonJS environments
│   ├── index.js
│   └── index.js.map
├── module/             # For ES modules/bundlers
│   ├── index.js
│   └── index.js.map
└── typescript/         # TypeScript definitions
    ├── index.d.ts
    └── index.d.ts.map
```

## Data Flow

```
React Native App
       ↓
example/App.tsx (demo usage)
       ↓ (imports)
src/index.ts (TypeScript interface)
       ↓ (calls NativeModules)
React Native Bridge
       ↓ (routes to platform)
┌─────────────────┬─────────────────┐
│    Android      │      iOS        │
│                 │                 │
│ DeviceInfoSDK   │ DeviceInfoSDK   │
│ Module.kt       │ .swift          │
│                 │                 │
│ (Kotlin code)   │ (Swift code)    │
│                 │                 │
│ Android APIs    │ iOS APIs        │
└─────────────────┴─────────────────┘
```

## File Dependencies

### JavaScript Layer
```
App.tsx → src/index.ts → NativeModules['DeviceInfoSDK']
```

### Android Layer
```
DeviceInfoSDKPackage.kt → DeviceInfoSDKModule.kt → Android Platform APIs
```

### iOS Layer
```
DeviceInfoSDK.m → DeviceInfoSDK.swift → iOS Platform APIs
```

## Key Patterns

### 1. **Naming Consistency**
- Module name in `getName()` must match JavaScript import
- Package name should match directory structure
- File names should be descriptive and consistent

### 2. **Platform Symmetry**
- Both platforms implement the same methods
- Return data structures should be consistent
- Error handling should be uniform

### 3. **Type Safety**
- TypeScript interfaces define expected shapes
- Native code validates inputs
- Promises handle async operations

### 4. **Error Boundaries**
- JavaScript layer provides user-friendly errors
- Native layers catch platform-specific errors
- Bridge errors are properly propagated

## Development Workflow

1. **Design API** → Define interfaces in `src/index.ts`
2. **Implement Android** → Create Kotlin modules
3. **Implement iOS** → Create Swift modules  
4. **Test Integration** → Use example app
5. **Build Package** → Run `npm run prepare`
6. **Publish** → `npm publish`

## Testing Strategy

### Unit Testing
- Test individual native methods
- Validate data transformations
- Check error conditions

### Integration Testing  
- Test full JavaScript → Native → Platform flow
- Verify consistent behavior across platforms
- Test with real devices and emulators

### Package Testing
- Install in fresh React Native project
- Test linking and build process
- Verify TypeScript definitions work

This structure provides a complete, professional React Native SDK that can be easily maintained, tested, and distributed.