# Mobile Assets

This directory contains static assets for the Flutter mobile application.

## Organization

```
assets/
├── images/     # Image files (PNG, JPG, WebP)
├── icons/      # App icons and UI icons
└── fonts/      # Custom fonts
```

## Guidelines

- Provide multiple resolutions for images (1x, 2x, 3x)
- Use vector graphics (SVG) when possible
- Optimize all images for mobile
- Reference assets in pubspec.yaml
- Include proper licenses for fonts and images

## Asset Registration

All assets must be declared in `pubspec.yaml`:

```yaml
flutter:
  assets:
    - assets/images/
    - assets/icons/
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/CustomFont-Regular.ttf
```
