---
# 📱 Welcome to Your Expo App

This project was bootstrapped using [**Create Expo App**](https://www.npmjs.com/package/create-expo-app), which sets up a modern React Native environment with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction) for file-based navigation.
---

## 🚀 Getting Started

Follow the steps below to set up and run the app on your local machine.

### 1. Install Dependencies

Make sure you have Node.js and npm installed, then run:

```bash
npm install
```

### 2. Start the App

Choose the appropriate platform to run your app:

#### For Android:

```bash
npm run android
```

#### For iOS:

```bash
npm run ios
```

Once started, you’ll see options to open the app using:

- 📱 **Development build**  
  [Learn more](https://docs.expo.dev/develop/development-builds/introduction/)

- 💻 **Android emulator**  
  [Set up emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

- 🖥 **iOS simulator**  
  [Set up simulator](https://docs.expo.dev/workflow/ios-simulator/)

- 📦 **Expo Go**  
  A sandbox environment for previewing your app  
  [Install Expo Go](https://expo.dev/go)

---

## 🌐 Deep Linking

The app supports **deep linking**, allowing you to open specific screens with query parameters directly.

### 🔧 Test Deep Links

Use the following commands in your terminal to simulate deep linking:

#### iOS:

```bash
npx uri-scheme open slotsCreation://viewSlots?timezone=UTC --ios
```

#### Android:

```bash
npx uri-scheme open slotsCreation://viewSlots?timezone=UTC --android
```

> You can replace `UTC` with any other value to test different behaviors.

Make sure the app is running in a simulator or on a device when executing these commands.

---

## 📦 Sample APK

You can install a development build of the app on a physical Android device using the link below:

👉 [Download APK](https://expo.dev/accounts/fouadmagdy2001/projects/SlotsCreator/builds/66700e03-cdd4-4c8e-89f9-9e5ced690c0d)

---

## 🗂 File-Based Routing

This project uses **file-based routing** powered by `expo-router`. To define screens and routes:

1. Navigate to the `app/` directory.
2. Create a new file or folder that matches your desired route (e.g. `app/viewSlots.tsx`).
3. Configure screen options using layout files or `export const options = {}` in each screen.

For more information, visit the [Expo Router documentation](https://expo.dev/accounts/fouadmagdy2001/projects/SlotsCreator/builds/d43034f8-2e68-4e78-9df7-4262ced2d19e).

---
