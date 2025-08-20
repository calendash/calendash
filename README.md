# Calendash

[![build](https://img.shields.io/github/actions/workflow/status/calendash/calendash/ci.yml?style=flat-square)](https://github.com/calendash/calendash/actions/workflows/ci.yml?query=workflow%3Aci)
![types](https://img.shields.io/npm/types/@calendash/core?style=flat-square)
[![chat](https://img.shields.io/badge/Join-Discord-5865F2?style=flat-square&logo=discord&logoColor=FFFFFF)](https://discord.gg/wz3kKbfg6X)
[![Nx](https://img.shields.io/badge/monorepo-nx-143055?style=flat-square&logo=nx&logoColor=white)](https://nx.dev)
[![License](https://img.shields.io/github/license/calendash/calendash?style=flat-square)](https://github.com/calendash/calendash/blob/master/LICENSE)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/calendash?label=Sponsor&logo=githubsponsors&style=flat-square)](https://github.com/sponsors/calendash)

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
