# 🐍 SerpentLK

### Offline Sri Lankan Snake Identification and First-Aid Guide

SerpentLK is a React Native mobile application designed to help users learn about snakes found in Sri Lanka.

The application aims to provide snake species information, identification guidance, snake comparison features, snakebite first-aid information, and personal snake sighting records.

The project is being developed as an individual mobile application coursework project.

## Technologies Used

- React Native
- Expo SDK 58
- TypeScript
- Expo Router
- Git and GitHub
- Visual Studio Code

## Features

### Currently Implemented

- **Home Screen:** Displays the main sections of the application.
- **Snake List Screen:** Displays sample Sri Lankan snake species and their scientific names.
- **Navigation:** Supports Home and Explore tabs, navigation to the Snake List, and returning to the previous screen.

### Planned Features

- Offline dataset of Sri Lankan snake species
- Snake identification information and images
- Search and filter functionality
- Detailed information about each snake
- Snake comparison
- Offline snakebite first-aid guidance
- Personal snake sighting records
- Local data storage
- About screen

## Project Structure

```text
SerpentLK/
├── assets/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── snakes.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       └── explore.tsx
│   ├── components/
│   ├── constants/
│   └── hooks/
├── package.json
├── app.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- Expo Go or Android Emulator (optional for mobile testing)

### 1. Clone the Repository

```bash
git clone https://github.com/NIVETHA990821/SerpentLK.git
```

### 2. Open the Project

```bash
cd SerpentLK
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

```bash
npx expo start
```

### 5. Run the Application

After starting Expo:

- Press `w` to open the web application.
- Press `a` to open the Android application when an emulator is configured.
- Use Expo Go on a compatible Android device for mobile testing.


## Offline Functionality

SerpentLK is designed to work without an internet connection after installation.

The planned implementation will use locally stored snake information, images, and user sighting records without relying on public APIs.

## Safety Notice

SerpentLK is intended for educational purposes. Snake identification based on appearance is not guaranteed to be accurate.

In the event of a suspected snakebite, seek emergency medical care immediately. The application is not a substitute for professional medical advice.

This README will be updated as additional features are completed.