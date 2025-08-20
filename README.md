# Calendash

[![build](https://img.shields.io/github/actions/workflow/status/calendash/calendash/ci.yml?style=flat-square)](https://github.com/calendash/calendash/actions/workflows/ci.yml)
![types](https://img.shields.io/npm/types/@calendash/core?style=flat-square)
[![nx](https://img.shields.io/badge/monorepo-nx-143055?style=flat-square&logo=nx&logoColor=white)](https://nx.dev)
[![license](https://img.shields.io/github/license/calendash/calendash?style=flat-square)](https://github.com/calendash/calendash/blob/master/LICENSE)

**@calendash/core** is a modular, framework-agnostic calendar engine that generates structured data for multiple views, with fine-grained control over navigation, behavior, and logic via a flexible middleware system.

## Packages

This monorepo is managed with [pnpm workspaces](https://pnpm.io/workspaces) and contains the following packages:

| Package | Description |
|---------|-------------|
| [`@calendash/core`](./packages/core) | Framework-agnostic calendar engine for generating structured data across multiple views, with customizable behavior through middlewares. |

## Roadmap

- [x] Core calendar engine (`@calendash/core`)
- [ ] Middlewares registry and utilities
- [ ] DOM integration (`@calendash/dom`)
- [ ] React integration (`@calendash/react`)
- [ ] Vue integration (`@calendash/vue`)
- [ ] Docs site

## Code of conduct

Please review and follow our [code of conduct](./CODE_OF_CONDUCT.md).

## Contributing

Please read our [contribution guidelines](./CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the [MIT License](./LICENSE)
