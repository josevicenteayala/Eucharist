# Eucharist Mobile Application

Flutter-based mobile application for iOS and Android platforms.

## Structure

- `lib/` - Application source code
  - `core/` - Core functionality, configuration, constants, theme, and utilities
  - `data/` - Data layer with models, repositories, and data sources
  - `domain/` - Business logic layer with entities, repository interfaces, and use cases
  - `presentation/` - UI layer with screens, widgets, and state management providers
  - `services/` - External services integration
- `assets/` - Static assets (images, icons, fonts)
- `test/` - Unit and widget tests

## Tech Stack

- Flutter SDK 3.16+
- Provider/Riverpod for state management
- Clean Architecture pattern (Presentation → Domain → Data)

## Setup

```bash
flutter pub get
flutter run
```

**Note**: This is a planning directory. Implementation code has not been created yet.
