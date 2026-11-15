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

- **34 Sri Lankan species** with English, Sinhala and Tamil names, venom level, size, habitat, behaviour, look-alikes and bite symptoms. Version 1.1 adds 12 researched species, including the Hook-nosed Sea Snake, both endemic hump-nosed vipers (*Hypnale zara*, *H. nepa*), the Slender Coral Snake and the endemic Sri Lanka Pipe Snake.
- **Real species photos** loaded from Wikipedia (free-licence images) and cached on the device, with bundled illustrations as the offline fallback. Photos can be switched off or downloaded in one tap from About & Settings.
- **Identify helper:** five safe questions (place, colour, pattern, size, time) rank the most likely species.
- **Search and filters** across all name languages, by danger level, habitat, endemic status and favourites.
- **Compare** look-alike pairs side by side, with differences highlighted.
- **Offline first aid** with the 1990 Suwa Seriya ambulance number.
- **Sightings log** saved privately on the phone with AsyncStorage.

## Bundling real species photos

Run this once on a computer with internet (Node 18+):

```bash
npm run photos
```

It downloads a free-licence photo for every species from Wikipedia / Wikimedia Commons into `assets/snakes/photos/`, regenerates `src/data/images.ts`, and writes the author and licence of each photo to `src/data/photoCredits.json` and `PHOTO_CREDITS.md`. The app then shows the photos with no internet at all, and credits the photographer on each species page. Species without a usable photo keep their illustration. To swap a photo, add a Commons file name to `scripts/photo-overrides.json` and run `npm run photos -- --force`.

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