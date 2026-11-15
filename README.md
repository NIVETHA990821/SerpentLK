# 🐍 SerpentLK

### Offline Sri Lankan Snake Identification and First-Aid Guide

SerpentLK is a React Native application developed to help users learn about snakes found in Sri Lanka.

The application provides information about Sri Lankan snake species, identification guidance, snake comparisons, first-aid information, and personal snake sighting records.

SerpentLK is developed as an individual mobile application coursework project using React Native and Expo.

## Technologies Used

- React Native
- Expo SDK 58
- TypeScript
- Expo Router
- AsyncStorage
- Git and GitHub
- Visual Studio Code

## Main Features

### 1. Sri Lankan Snake Information
- Information about 34 Sri Lankan snake species.
- English, Tamil, and Sinhala snake names.
- Venom level, habitat, size, and behaviour.
- Information about similar-looking snakes.
- Snake photographs and illustrations.
- Detailed snake information pages.

### 2. Multilingual Support
- English
- தமிழ் (Tamil)
- සිංහල (Sinhala)

The application provides multilingual information to make it more accessible to users in Sri Lanka.

### 3. Snake Identification Helper
- Helps users narrow down possible snake species.
- Uses questions about location, colour, pattern, size, and time.
- Displays possible matching species.

The identification helper is intended for educational guidance and cannot guarantee accurate identification.

### 4. Search and Filtering
- Search snakes by name.
- Filter by venom level and habitat.
- Filter endemic species.
- View favourite snakes.

### 5. Snake Comparison
- Compare similar-looking snakes.
- View important differences between species.
- Compare appearance, characteristics, and other information.

### 6. Snakebite First Aid
- Offline first-aid information.
- Emergency guidance.
- Sri Lanka's 1990 Suwa Seriya ambulance number.

### 7. Snake Sighting Records
- Record snake sightings.
- Save sighting information locally using AsyncStorage.
- View previously recorded sightings.
- Support for recording unidentified snake sightings.

### 8. Offline Snake Photographs
- Bundled snake photographs for offline viewing.
- Photo attribution and licence information.
- Illustrations available where suitable photographs are unavailable.

### 9. Application Settings
- Language preferences.
- Application appearance settings.
- Photo-related preferences.

## Project Structure

The project uses Expo Router with a `src/app` directory.

```text
SerpentLK/
├── assets/
│   └── snakes/
│       └── photos/
├── scripts/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── first-aid.tsx
│   │   │   └── snakes.tsx
│   │   ├── snake/
│   │   │   └── [id].tsx
│   │   ├── about.tsx
│   │   ├── add-sighting.tsx
│   │   ├── compare.tsx
│   │   └── identify.tsx
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── i18n/
│   ├── types/
│   └── utils/
├── PHOTO_CREDITS.md
├── package.json
├── app.json
└── README.md
```

*This is a simplified structure showing the main folders and selected screens.*

## Getting Started

### Prerequisites

- Node.js and npm
- Visual Studio Code or another code editor
- A compatible Android device with Expo Go, or an Android emulator (optional)

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

For web development:

```bash
npx expo start -w
```

### 5. Run on a Device

- Press `w` to launch the web version.
- Press `a` to launch Android if an emulator is configured.
- Scan the QR code using a compatible Expo Go installation to test on a mobile device.

## Photo Attribution

SerpentLK includes snake photographs sourced from Wikimedia Commons and other documented sources.

Photo credits and licence information are recorded in:

- `PHOTO_CREDITS.md`
- `src/data/photoCredits.json`

The project also includes a photo preparation script:

```bash
npm run photos
```

This script requires an internet connection and should be run only when updating the photo dataset.

## Offline Functionality

SerpentLK is designed to provide important functionality without requiring a continuous internet connection.

Offline features include:

- Locally stored snake information.
- Bundled snake photographs and illustrations.
- Snake search and filtering using local data.
- First-aid information.
- Local snake sighting records using AsyncStorage.

Some development tasks, such as installing dependencies or obtaining additional photographs, require internet access.

## GitHub Development Workflow

Git and GitHub were used to manage the development of SerpentLK.

The project includes:

- Regular commits documenting development progress.
- A `main` branch for the main project.
- A feature branch for multilingual improvements.
- A pull request used to review and merge changes.

### Feature Branch

`feature/multilingual-improvements`

### Pull Request

**Pull Request #1 — Add multilingual snake details and offline photo improvements**

The feature branch was merged into `main`.

[View Pull Request #1](https://github.com/NIVETHA990821/SerpentLK/pull/1)

## Application Screenshots

Screenshots of the following application screens can be added here:

- Home
- Snake List
- Snake Details
- Identify Snake
- Compare Snakes
- First Aid
- Sighting Records
- Settings

## Testing

The project has been checked using the TypeScript compiler:

```bash
npx tsc --noEmit
```

The command completed successfully without TypeScript errors.

Additional manual testing should verify navigation, searching, filtering, language switching, offline functionality, and local data storage.

## Safety Notice

SerpentLK is intended for educational and informational purposes only.

Snake identification based on appearance is not guaranteed to be accurate. Users should not approach, handle, or attempt to capture snakes based on information provided by the application.

In the event of a suspected snakebite, seek emergency medical attention immediately.

SerpentLK is not a substitute for professional medical advice.

## Developer

Developed as an individual React Native mobile application coursework project.

**GitHub Repository:** https://github.com/NIVETHA990821/SerpentLK