# WorkNow Testing Documentation

## Overview

This document outlines the testing strategy, framework, and structure for the WorkNow project. The project uses **Vitest** as the primary testing framework with **React Testing Library** for component testing.

## Testing Framework

### Vitest
- **Version**: v3.2.4
- **Configuration**: `vitest.config.js`
- **Setup**: `tests/setup.jsx`
- **Coverage**: Comprehensive unit and integration testing

### React Testing Library
- **Purpose**: Component behavior testing
- **Philosophy**: Test components as users interact with them
- **Utilities**: `render`, `screen`, `userEvent`, `waitFor`

## Test Structure

### Test Files
```
tests/
├── setup.jsx                    # Global test setup and mocks
├── mocks/                       # Mock implementations
│   ├── libs-jobs.js            # Job API mocks
│   ├── libs-utils.js           # Utility function mocks
│   ├── hooks.js                # Custom hook mocks
│   └── LoadingContext.jsx      # Loading context mocks
├── job-form.test.jsx           # Job creation form tests
├── edit-job-form.test.jsx      # Job editing form tests
├── job-card.test.jsx           # Job card component tests
├── home-page.test.jsx          # Home page tests
├── stores.test.jsx             # State management tests
├── hooks.test.jsx              # Custom hook tests
└── utils.test.jsx              # Utility function tests
```

### Test Categories

#### 1. Job Creation Tests (`job-form.test.jsx`)
- **Form Rendering**: Tests form field display and structure
- **Form Interaction**: Tests user input functionality for all form elements
- **Form Submission Simulation**: Tests form submission process and image upload simulation
- **Validation**: Tests form validation and error handling

#### 2. Job Editing Tests (`edit-job-form.test.jsx`)
- **Form Rendering and Data Loading**: Tests edit form display and data population
- **Form Interaction and Editing**: Tests user editing capabilities for all form fields
- **Form Submission and Updates**: Tests form submission structure and readiness
- **Image Handling in Editing**: Tests image display and modification capabilities
- **Data Persistence and Validation**: Tests form state maintenance and validation structure
- **User Experience and Accessibility**: Tests form feedback and accessibility features
- **Edge Cases and Error Handling**: Tests form behavior in various scenarios

#### 3. Job Display Tests (`job-card.test.jsx`)
- **Job Information Display**: Tests job data rendering
- **Navigation**: Tests user profile navigation
- **Image Handling**: Tests job image display and modal functionality
- **Conditional Rendering**: Tests dynamic content display
- **Responsive Design**: Tests styling and layout
- **Accessibility**: Tests proper HTML structure and alt text
- **Edge Cases**: Tests handling of missing or invalid data
- **Performance**: Tests rendering efficiency

#### 4. State Management Tests (`stores.test.jsx`)
- **Language Store**: Tests internationalization state management
- **Filter Store**: Tests job filtering state management

#### 5. Custom Hook Tests (`hooks.test.jsx`)
- **Hook Imports**: Tests custom hook accessibility and functionality

#### 6. Utility Function Tests (`utils.test.jsx`)
- **Toast Notifications**: Tests error and success message display
- **Translation Helpers**: Tests internationalization utilities

## Mocking Strategy

### Global Mocks (`tests/setup.jsx`)
- **ImageUploadContext**: Mocks image upload functionality
- **LoadingContext**: Mocks loading state management
- **useFetchCities**: Mocks city data fetching
- **useFetchCategories**: Mocks category data fetching
- **useLoadingProgress**: Mocks loading progress functionality

### Specific Mocks
- **libs-jobs.js**: Mocks job creation and update API calls
- **libs-utils.js**: Mocks toast notification utilities
- **hooks.js**: Mocks custom data fetching hooks
- **LoadingContext.jsx**: Mocks loading context provider

## Test Results

### Current Status
- **Total Test Files**: 8
- **Total Tests**: 107
- **Status**: All tests passing ✅

### Test Coverage by Component

#### Job Creation Form
- **Tests**: 10
- **Coverage**: Form rendering, interaction, submission, validation
- **Status**: ✅ Passing

#### Job Editing Form
- **Tests**: 19
- **Coverage**: Form rendering, editing, submission, image handling, validation
- **Status**: ✅ Passing

#### Job Card Component
- **Tests**: 30
- **Coverage**: Display, navigation, images, accessibility, edge cases
- **Status**: ✅ Passing

#### Other Components
- **Home Page**: 2 tests ✅
- **Stores**: 21 tests ✅
- **Hooks**: 5 tests ✅
- **Utils**: 16 tests ✅

## Testing Approach

### Unit Testing
- **Component Isolation**: Each component tested independently
- **Mock Dependencies**: External dependencies mocked for isolation
- **Behavior Testing**: Focus on user interactions and component behavior
- **Edge Cases**: Comprehensive coverage of error scenarios

### Integration Testing
- **Form Workflows**: Complete form submission and editing flows
- **State Management**: Integration between components and stores
- **API Integration**: Mocked API calls and responses

### Accessibility Testing
- **Screen Reader Support**: Proper HTML structure and labels
- **Keyboard Navigation**: Form field accessibility
- **ARIA Attributes**: Proper accessibility markup

## Running Tests

### Individual Test Files
```bash
npm test -- tests/edit-job-form.test.jsx
npm test -- tests/job-form.test.jsx
npm test -- tests/job-card.test.jsx
```

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm test -- --watch
```

## Test Development Guidelines

### Writing New Tests
1. **Follow Naming Convention**: `component-name.test.jsx`
2. **Use Descriptive Test Names**: Clear, specific test descriptions
3. **Group Related Tests**: Use `describe` blocks for organization
4. **Test User Behavior**: Focus on how users interact with components
5. **Mock External Dependencies**: Isolate components for testing

### Test Structure
```javascript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup and cleanup
  })

  describe('Feature Category', () => {
    it('should perform specific action', () => {
      // Test implementation
    })
  })
})
```

### Mocking Best Practices
- **Global Mocks**: Place in `tests/setup.jsx`
- **Component-Specific Mocks**: Place in test file or separate mock file
- **Realistic Data**: Use realistic mock data that matches production
- **Consistent Interface**: Maintain consistent mock interfaces

## Future Enhancements

### Planned Improvements
- **E2E Testing**: Add Playwright or Cypress for end-to-end testing
- **Visual Regression Testing**: Add visual testing for UI consistency
- **Performance Testing**: Add performance benchmarks for critical components
- **Coverage Reports**: Generate and track test coverage metrics

### Integration Testing
- **API Integration**: Test real API endpoints in staging environment
- **Database Testing**: Test database operations and migrations
- **Authentication Flow**: Test complete authentication workflows

## Troubleshooting

### Common Issues
1. **Mock Not Working**: Check mock placement and import paths
2. **Component Not Rendering**: Verify component dependencies are mocked
3. **Test Hanging**: Check for unresolved promises or async operations
4. **Import Errors**: Verify file paths and module resolution

### Debug Tips
- Use `console.log` in tests for debugging
- Check test output for error details
- Verify mock implementations match expected interfaces
- Use `screen.debug()` to inspect rendered output

## Conclusion

The WorkNow testing suite provides comprehensive coverage of the application's core functionality. With 107 passing tests across 8 test files, the project maintains high code quality and reliability. The testing strategy focuses on user behavior and component integration, ensuring that the application works correctly from a user's perspective.

The modular approach to mocking and testing allows for easy maintenance and extension of the test suite as new features are added to the application.
