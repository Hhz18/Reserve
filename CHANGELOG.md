
# Development Log - Correction Loop

This document records the development history, feature implementations, and UI modifications for the Correction Loop application.

## 2024-05-24 (Current Session)

### 9. Avatar Management & API Docs
**Goal**: Implement avatar updates with a "Database + Object Storage" architecture mindset.
- **Documentation**: Updated `README.md` with:
    - `POST /api/upload/avatar` (simulated Object Storage upload).
    - `PUT /api/users/me` (Profile update).
- **Features**:
    - **AvatarModal**: A new component allowing users to view their avatar in large format and edit it.
    - **Upload Simulation**: Implemented file selection -> Base64 conversion -> LocalStorage save to simulate an S3 upload process.
    - **URL Support**: Users can also paste a direct image URL.
- **Data**: Added `updateUser` to `dataService.ts`.
- **Integration**: Updated `UserProfile` and `App` to ensure avatar changes reflect immediately in the UI (Sidebar and Profile view).

### 8. User Profile & Account Management
**Goal**: Add detailed user identity management.
- **UI**: Created `UserProfile.tsx` for displaying user details (Avatar, Email, Password-masked, Address, Age, Gender) and `EditProfile.tsx` (Mock UI) for editing.
- **Components**: Updated `Sidebar` header to display Avatar (default white circle) and Name (default 'Asig'). Added "Logout" and "Delete Account" buttons.
- **Navigation**: Updated `App.tsx` and `SettingsModal` to enable switching between "System View", "Profile View", and "Edit Profile View".
- **Data**: Extended `User` type with profile fields and updated `dataService.ts` to generate mock data for these fields.
- **Documentation**: Updated `README.md` with the new SQL schema columns.

### 7. Bug Fix: Gemini API Schema
**Issue**: The API returned a 400 error because `responseSchema` defined a `Type.OBJECT` with empty properties (attempting dynamic keys).
**Fix**: Updated `services/geminiService.ts` to request a `Type.ARRAY` of objects with strict `word` and `translation` properties, then mapped the result back to the expected dictionary format.

### 6. UI Detail Refinement
**Goal**: Ensure visual consistency between global theme and card interactions.
**Update**: Modified `VocabSystem` so that the back side of flipped vocabulary cards uses the active `globalTheme` background color instead of a hardcoded color.

### 5. UI Expansion & System Management
**Goal**: Improve header aesthetics and allow system deletion.
- **Visuals**: Expanded the header background color in `VocabSystem` and `AlgoSystem` to cover the full top section ("Full Coverage").
- **Feature**: Added a trash icon to the Sidebar for deleting custom systems.
- **Logic**: Implemented `handleDeleteSystem` in `App.tsx` and updated `dataService.ts` to cascade delete items associated with a system.
- **Docs**: Updated `README.md` with SQL/API specs for the delete endpoint.

### 4. Internationalization & Global Themes
**Goal**: Add multi-language support (CN/EN) and a global theme switcher.
- **New Files**:
  - `translations.ts`: Dictionary for English and Chinese strings.
  - `contexts/AppContext.tsx`: Global state for `language` and `globalTheme`.
  - `components/ThemeSwitcher.tsx`: Animated circular color picker.
  - `components/SettingsModal.tsx`: Modal to switch languages.
- **Refactoring**: Wrapped `App` in `AppProvider`. Updated `Sidebar`, `VocabSystem`, and `AlgoSystem` to use dynamic translation keys (`t('key')`) and global theme colors.

### 3. UI Polish (Neo-Brutalism Softening)
**Goal**: Fix visibility issues and soften the "hard" UI edges.
- **Fix**: Removed `opacity: 0.8` from `body` in `index.html` which was causing text to look washed out.
- **Style**: Added rounded corners (`rounded-lg`, `rounded-xl`, `rounded-2xl`) to Buttons, Modals, Inputs, Cards, and the Sidebar to make the interface friendlier while maintaining the Neo-Brutalism aesthetic.
- **Contrast**: Enforced high-contrast text colors in inputs and modals.

### 2. Dev Environment Convenience
**Goal**: Bypass login screen during development.
- **Logic**: Updated `App.tsx` to automatically register and log in a default user (`2307567045@qq.com`) on mount.
- **UI**: Added a loading state to prevent the login screen from flashing during auto-auth.

### 1. Project Initialization
**Goal**: Scaffolding the core application.
- **Stack**: React, Vite, Tailwind CSS.
- **Core Features**:
  - **Vocab System**: Flashcards with Ebbinghaus spaced repetition logic.
  - **Algo System**: Markdown-based problem logging.
  - **Gemini AI**: Service integration for automatic word translation.
  - **Data Service**: LocalStorage-based mock backend simulating a SQL database.
  - **UI Library**: Custom Neo-Brutalism components (`Button`, `Modal`, `Sidebar`).
