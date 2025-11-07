# Mobile Tests

This directory contains unit tests, widget tests, and integration tests for the Flutter application.

## Test Types

### Unit Tests
- Test business logic in isolation
- Test utility functions
- Test data models

### Widget Tests
- Test UI components
- Test user interactions
- Test widget behavior

### Integration Tests
- Test complete user flows
- Test navigation
- Test data flow through app

## Standards

- Follow test-driven development (TDD)
- Aim for >80% code coverage
- Mock external dependencies
- Use descriptive test names
- Group related tests with `group()`

## Running Tests

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific test file
flutter test test/unit/example_test.dart
```
