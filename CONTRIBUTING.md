# Contributing to FireBuild.ai

Thank you for your interest in contributing to FireBuild.ai! We welcome contributions from the community.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- pnpm (recommended) or npm
- Docker (optional, for containerized development)
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/[your-username]/firebuild.git
   cd firebuild
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Using Docker
   docker-compose up -d postgres
   
   # Or use your local PostgreSQL
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Run Tests**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # E2E tests
   npm run test:watch  # Watch mode
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
feat(invoice): add PDF export functionality
fix(auth): resolve session timeout issue
docs(api): update authentication endpoints
```

### Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write tests for new functionality
   - Update documentation as needed
   - Follow the coding standards

3. **Run Quality Checks**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Submit PR**
   - Use a clear, descriptive title
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

### Code Standards

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks for React
- Implement proper error handling
- Add JSDoc comments for complex functions

#### Styling
- Use Tailwind CSS design system tokens
- Follow mobile-first responsive design
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test in both light and dark modes

#### Testing
- Write unit tests for utilities and hooks
- Add integration tests for complex features
- Include E2E tests for critical user flows
- Maintain >80% code coverage

### Security Guidelines

- Never commit sensitive data
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Follow OWASP security best practices
- Report security vulnerabilities privately

## Project Structure

```
firebuild/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript types
│   └── test/           # Test utilities
├── public/             # Static assets
├── e2e/                # E2E tests
├── .github/            # GitHub workflows
└── docker/             # Docker configurations
```

## Testing

### Unit Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
npm run test:e2e:ui  # With Playwright UI
```

### Writing Tests

```typescript
// Example unit test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for public APIs
- Include code examples in documentation
- Keep documentation concise and clear

## Getting Help

- Check existing issues and discussions
- Join our community Discord (if available)
- Ask questions in GitHub Discussions
- Contact maintainers for sensitive issues

## Recognition

Contributors will be recognized in:
- Release notes
- Contributors list
- Project documentation

Thank you for contributing to FireBuild.ai!