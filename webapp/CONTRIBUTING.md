# Contributing to Vue.js Poker Hand Evaluator

Thank you for your interest in contributing to the Vue.js Poker Hand Evaluator! We welcome contributions from the community to help improve this showcase application.

## Getting Started

1.  **Fork the repository**: Click the "Fork" button at the top right of the repository page.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/gamblingjs.git
    cd gamblingjs/webapp
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a branch**:
    ```bash
    git checkout -b feature/my-new-feature
    ```

## Development Workflow

### Running Locally

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Code Style

We follow standard Vue.js and TypeScript best practices.

-   **Vue**: Use Composition API with `<script setup lang="ts">`.
-   **CSS**: Use Tailwind CSS utility classes where possible. Use DaisyUI components for UI elements.
-   **State**: Use Pinia for global state management.

### Linting and Formatting

Ensure your code is linted and formatted before committing:

```bash
npm run lint
npm run format
```

## Testing

We emphasize comprehensive testing. Please ensure your changes are covered by tests.

### Unit Tests

Run unit tests using Vitest:

```bash
npm run test
```

### End-to-End Tests

Run E2E tests using Playwright:

```bash
npm run test:e2e
```

## Pull Request Process

1.  Update the README.md with details of changes to the interface, if applicable.
2.  Update the `TECHNICAL_SPECIFICATION.md` if you have changed any component interfaces or data structures.
3.  Ensure the test suite passes.
4.  Submit a Pull Request to the `main` branch.

## Reporting Bugs

If you find a bug, please open an issue with the following details:

-   Description of the bug
-   Steps to reproduce
-   Expected behavior
-   Screenshots (if applicable)
-   Browser and OS version

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
