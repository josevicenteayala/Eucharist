# Contributing to the Eucharist Platform

Thank you for your interest in contributing to the Eucharist Understanding Platform! This project aims to help people deepen their understanding and appreciation of the Eucharist through accessible technology.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Getting Started](#getting-started)
4. [Development Process](#development-process)
5. [Content Guidelines](#content-guidelines)
6. [Theological Review](#theological-review)
7. [Pull Request Process](#pull-request-process)
8. [Style Guides](#style-guides)
9. [Community](#community)

## Code of Conduct

### Our Pledge

This project is rooted in Catholic faith and charity. We pledge to:

- Treat all contributors with respect and dignity
- Welcome people of all backgrounds who share our mission
- Maintain theological accuracy and pastoral sensitivity
- Foster a community of learning and growth

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy toward others

### Unacceptable Behavior

- Theological content that contradicts Catholic teaching
- Harassment or discriminatory language
- Publishing others' private information
- Trolling or insulting comments
- Any conduct that would be inappropriate in a church setting

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with:

- Clear descriptive title
- Steps to reproduce the problem
- Expected vs. actual behavior
- Screenshots if applicable
- Environment details (browser, device, OS)

### Suggesting Features

We welcome feature suggestions! Please:

- Check if the feature has already been suggested
- Explain the feature and its benefits
- Consider how it aligns with our mission
- Provide examples or mockups if possible

### Content Contributions

We especially need help with:

- Educational articles about the Eucharist
- Daily Gospel reflections
- Translations (Spanish, Portuguese, etc.)
- Eucharistic miracle stories
- Historical content
- Prayer resources

### Code Contributions

Areas where developers can help:

- Backend API development
- Frontend React components
- Mobile app features (Flutter)
- Bug fixes
- Performance improvements
- Testing and QA

### Design Contributions

Design help needed for:

- UI/UX improvements
- Sacred art and imagery
- Icon design
- Brand identity
- User experience flows

## Getting Started

### Prerequisites

- **For Code:** Node.js v18+, Flutter SDK v3.16+, Git
- **For Content:** Good writing skills, theological knowledge, Markdown familiarity
- **For Design:** Figma or similar design tools

### Setting Up Your Development Environment

1. **Fork the repository**

   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/Eucharist.git
   cd Eucharist
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/josevicenteayala/Eucharist.git
   ```

4. **Install dependencies**

   ```bash
   # Backend
   cd web/backend
   npm install

   # Frontend
   cd ../frontend
   npm install

   # Mobile
   cd ../../mobile
   flutter pub get
   ```

5. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Run the application**

   ```bash
   # Backend
   npm run dev

   # Frontend
   npm run dev

   # Mobile
   flutter run
   ```

## Development Process

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-number-description
# or
git checkout -b content/article-title
```

Branch naming conventions:

- `feature/` - New features
- `bugfix/` - Bug fixes
- `content/` - Content additions
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

### 2. Make Your Changes

- Write clear, self-documenting code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Commit often with clear messages

### 3. Commit Messages

Follow conventional commits format:

```
type(scope): brief description

Longer explanation if needed

Fixes #123
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:

```
feat(gospel): add audio playback for daily readings

fix(auth): resolve login redirect issue

docs(readme): update installation instructions

content(eucharist): add article on Real Presence
```

### 4. Test Your Changes

Before submitting:

```bash
# Run tests
npm test                    # All workspaces
npm test -w web/backend     # Backend only
flutter test                # Mobile

# Run linter and formatter (from root)
npm run lint                # Lint all workspaces
npm run lint:fix            # Auto-fix linting issues
npm run format              # Format all files
npm run format:check        # Check formatting

# Run linter (in specific workspace)
cd web/backend && npm run lint
flutter analyze             # Dart

# Build to check for errors
npm run build              # Frontend
cd web/backend && npm run build  # Backend
flutter build apk          # Mobile
```

**Note:** Git hooks will automatically run linting and formatting on staged files before commit.

### 5. Code Coverage Requirements

All code contributions must maintain or improve test coverage:

**Minimum Coverage Thresholds: 80%**

- Lines: 80%
- Branches: 80%
- Functions: 80%
- Statements: 80%

**Running Coverage Reports:**

```bash
# Backend coverage
cd web/backend && npm run test:coverage

# View coverage report in browser
# Open web/backend/coverage/lcov-report/index.html
```

**Coverage Guidelines:**

- Write tests for all new functions and features
- Test both success and error paths
- Include edge cases and boundary conditions
- Mock external dependencies (databases, APIs)
- Co-locate unit tests next to source files when appropriate
- Use test files named `*.test.ts` or `*.spec.ts`

**CI/CD Integration:**

- Coverage reports are automatically generated on every PR
- Coverage badges show current coverage status
- PRs that significantly decrease coverage may be rejected
- View detailed coverage reports in GitHub Actions artifacts

**Understanding Coverage Reports:**

- **Lines**: Percentage of executable lines run during tests
- **Branches**: Percentage of conditional branches (if/else) tested
- **Functions**: Percentage of functions called during tests
- **Statements**: Percentage of statements executed

### 6. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## Content Guidelines

### Writing Standards

1. **Theological Accuracy**
   - Base content on Catholic teaching
   - Cite sources (Catechism, Church documents, etc.)
   - Avoid personal theological opinions
   - Use language consistent with Church usage

2. **Clarity and Accessibility**
   - Write for a general audience
   - Explain technical terms
   - Use active voice
   - Keep sentences concise
   - Use examples and stories

3. **Pastoral Sensitivity**
   - Be welcoming and encouraging
   - Avoid judgmental language
   - Consider various levels of faith journey
   - Include practical applications

### Content Structure

Educational articles should include:

- **Title**: Clear and descriptive
- **Introduction**: Hook and overview
- **Main Content**: 3-5 sections with headings
- **Practical Application**: How to live this teaching
- **Reflection Questions**: 3-5 questions
- **Further Reading**: Additional resources
- **Metadata**: Category, tags, difficulty level

### Gospel Reflections

Daily reflections should:

- Be 300-500 words
- Connect to daily life
- Include actionable takeaways
- Be prayerful and contemplative
- Avoid overly academic language

## Theological Review

All theological content must be reviewed before publication.

### Review Process

1. **Submit Content**: Create PR with theological content
2. **Initial Review**: Project team reviews for style and clarity
3. **Theological Review**: Qualified theologian/priest reviews for accuracy
4. **Revisions**: Make requested changes
5. **Approval**: Content approved for publication
6. **Publication**: Content merged and deployed

### Theological Reviewers

Current reviewers:

- [To be assigned]

Qualification requirements:

- Advanced degree in theology or equivalent
- Good standing with the Catholic Church
- Experience in catechesis or spiritual formation

## Pull Request Process

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] Commits are clean and well-described
- [ ] Branch is up to date with main

### Submitting a PR

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Content addition
   - [ ] Documentation update

   ## Testing

   How has this been tested?

   ## Checklist

   - [ ] Code builds successfully
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] Follows style guide
   - [ ] Theological review (if applicable)

   ## Screenshots (if applicable)

   Add screenshots here

   ## Related Issues

   Closes #123
   ```

4. **Wait for Review**
   - Maintainers will review your PR
   - Address feedback promptly
   - Be open to suggestions

5. **Merge**
   - Once approved, maintainers will merge
   - Your changes will be deployed

### Review Timeline

- **Code PRs**: Reviewed within 2-3 business days
- **Content PRs**: May take 1-2 weeks (theological review required)
- **Documentation PRs**: Reviewed within 1-2 business days

## Style Guides

### JavaScript/TypeScript

```javascript
// Use ES6+ features
const getData = async () => {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Use descriptive names
const userProfile = getUserProfile(); // Good
const up = getProf(); // Bad

// Add JSDoc comments for functions
/**
 * Fetches daily gospel reading
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Gospel>} Gospel reading object
 */
async function getDailyGospel(date) {
  // Implementation
}
```

### React Components

```jsx
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

const GospelReader = ({ date }) => {
  const [gospel, setGospel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGospel(date).then((data) => {
      setGospel(data);
      setLoading(false);
    });
  }, [date]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="gospel-reader">
      <h2>{gospel.title}</h2>
      <p>{gospel.content}</p>
    </div>
  );
};

export default GospelReader;
```

### Flutter/Dart

```dart
// Use meaningful names
class GospelScreen extends StatefulWidget {
  const GospelScreen({Key? key}) : super(key: key);

  @override
  State<GospelScreen> createState() => _GospelScreenState();
}

class _GospelScreenState extends State<GospelScreen> {
  // Use nullable types appropriately
  Gospel? _gospel;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadGospel();
  }

  Future<void> _loadGospel() async {
    try {
      final gospel = await GospelService.getTodaysGospel();
      setState(() {
        _gospel = gospel;
        _isLoading = false;
      });
    } catch (e) {
      // Handle error
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }

    return Text(_gospel?.content ?? 'No gospel available');
  }
}
```

### CSS/Styling

```css
/* Use BEM naming convention */
.gospel-card {
  padding: 1rem;
  border-radius: 8px;
}

.gospel-card__title {
  font-size: 1.5rem;
  font-weight: bold;
}

.gospel-card__content {
  margin-top: 1rem;
  line-height: 1.6;
}

.gospel-card--featured {
  border: 2px solid gold;
}

/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}
```

### Markdown (Content)

````markdown
# Title in Title Case

## Section Heading

Regular paragraph text. Keep lines to reasonable length.

### Subsection

- Use bullet points for lists
- Keep items concise
- Use parallel structure

1. Use numbered lists for sequential items
2. Maintain consistent formatting
3. Add context where needed

**Bold** for emphasis, _italic_ for subtle emphasis.

> Use blockquotes for important quotes or Church teaching

```code
Use code blocks for technical content
```
````

[Link text](https://example.com) for external links

![Alt text for image](/docs/path/to/image.jpg)

```

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Email**: [To be set up] for private inquiries
- **Discord/Slack**: [To be set up] for real-time chat

### Getting Help

If you need help:
1. Check existing documentation
2. Search GitHub issues
3. Ask in GitHub Discussions
4. Contact maintainers

### Recognition

Contributors will be recognized:
- In project documentation
- On website credits page
- In release notes
- Special acknowledgment for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

## Questions?

Don't hesitate to ask! We're here to help:
- Open an issue with your question
- Use GitHub Discussions
- Contact project maintainers

---

Thank you for contributing to the Eucharist Understanding Platform! Your work helps people grow closer to Christ in the Eucharist. 🙏

*Ad Majorem Dei Gloriam* (For the Greater Glory of God)
```
