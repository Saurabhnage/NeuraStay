# Contributing Guide

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Format with Prettier
- Write meaningful commit messages

## Development Workflow

1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Commit: `git commit -am 'Add feature'`
7. Push: `git push origin feature/name`
8. Create Pull Request

## Testing Requirements

- Unit tests for all functions
- Integration tests for API endpoints
- E2E tests for critical flows
- Minimum 70% code coverage

## Commit Messages

\`\`\`
type(scope): subject

body

footer
\`\`\`

Types: feat, fix, docs, style, refactor, test, chore

## Pull Request Process

1. Update README if needed
2. Add tests for new features
3. Update CHANGELOG
4. Request review from maintainers
5. Address feedback
6. Squash commits before merge
