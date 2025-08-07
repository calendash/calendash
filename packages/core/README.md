# @calendash/core

[![license](https://img.shields.io/github/license/calendash/calendash?style=flat-square)](https://github.com/calendash/calendash/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@calendash/core?style=flat-square)](https://www.npmjs.com/package/@calendash/core)
[![npm downloads](https://img.shields.io/npm/dm/@calendash/core?style=flat-square)](https://www.npmjs.com/package/@calendash/core)

**@calendash/core** is a modular, framework-agnostic calendar engine that generates structured data for multiple views, with fine-grained control over navigation, behavior, and logic via a flexible middleware system.

## Table of contents

- [Features](#features)
- [Install](#install)
- [Getting started](#getting-started)
- [Internal modules](#internal-modules)
  - [Moment class](#moment-class)
  - [Layout class](#layout-class)
  - [Composer class](#composer-class)
- [Middlewares](#middlewares)
  - [Disable middleware](#disable-middleware)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Composable core modules** — Use `Layout`, `Composer` and `Moment` separately to build advanced calendar features or extend behavior.
- **Multiple views** — Generates structured data for `day`, `week`, `month`, `year`, and `decade` views out of the box.
- **Time zone & boundaries** — Handles IANA time zones and configurable date limits.
- **View & date navigation** — Navigate forward/backward in time or switch between views (`day`, `week`, etc.) programmatically.
- **Custom view skipping** — Optionally skip views (e.g., hide `year` or `decade`) to streamline navigation paths.
- **Middleware architecture** — Inject custom logic into the calendar's data generation pipeline.
- **Optimized for performance** — Built with lightweight, side-effect-free logic that runs safely on both the server and client.
- **Framework-agnostic** — Integrates with any UI library or framework.
- **Type-safe** — Built in TypeScript with strong types throughout.

## Install

Install **@calendash/core** using your preferred package manager:

```bash
  npm install @calendash/core
  # or
  yarn add @calendash/core
```

## Getting started

Create a calendar instance and navigate through views and dates:

```javascript
  import { Calendar } from '@calendash/core';

  // Initialize a calendar with default settings
  const calendar = new Calendar();

  // Current active view (defaults to "day")
  calendar.view; // "day"

  // Current reference date (defaults to today's date)
  calendar.target; // Date object

  // Generated data for the current view and target date
  calendar.data; // Day object (structured data for rendering)

  // Navigate forward one view level (e.g., day → week)
  calendar.navigate('view', 1);
  calendar.view; // "week"

  // Navigate backward one date interval based on the current view (e.g., one week back)
  calendar.navigate('date', -1);
  calendar.target; // Updated date
  calendar.data; // Week object (new structured data)

  // Jump directly to a specific date
  calendar.jumpToDate(new Date('2020-03-24T12:00:00.000Z'))
```

Learn more about the `Calendar` class and its customization options in the [API reference](https://github.com/calendash/calendash/blob/master/packages/core/features/calendar/README.md).

## Internal modules

The `Calendar` class is built on top of three modular engines — each responsible for a distinct part of the calendar logic:

### Moment class

A timezone-aware date utility layer that abstracts native Date quirks. It handles parsing, comparisons, offsets, and formatting in a consistent, predictable way. It also provides date navigation and boundary management capabilities.

#### Example

```javascript
  import { Moment } from '@calendash/core';

  const moment = new Moment();
  moment.date; // Date object
  moment.bounds; // Date boundaries
  moment.add({ days: 1 }); // Advances the date by one day
  moment.isAdjacentDateVisible('days', 1); // true if the next date is visible, otherwise false
  moment.toZonedDateTime('America/New_York'); // Returns the date in the New York time zone
  moment.from('2020-03-24T12:00:00.000Z'); // Updates the internal date to March 24, 2020
```

Learn more about the `Moment` class and its customization options in the [API reference](https://github.com/calendash/calendash/blob/master/packages/core/features/calendar/modules/moment/README.md).

### Layout class

Responsible for determining the view of the calendar by processing the skipped views (if applicable) and providing view navigation functionality.

#### Example

```javascript
  import { Layout } from '@calendash/core';

  const layout = new Layout();
  layout.view; // "day"
  layout.shift(1); // Advances the view by one view level
  layout.getAdjacentView(1); // Returns the next view type (e.g., "week")
```

Learn more about the `Layout` class and its customization options in the [API reference](https://github.com/calendash/calendash/blob/master/packages/core/features/calendar/modules/layout/README.md).

### Composer class

Generates structured calendar data for the specified view (day, week, month, year or decade). It orchestrates the transformation of layout grids into date-rich structures, applies view-specific logic, and passes the result through configured middlewares.

#### Example

```javascript
  import { Composer } from '@calendash/core';

  const composer = new Composer();
  const data = composer.data('day', new Date());

  data.isCurrentDay; // true or false
  data.cells.flat().forEach((cell) => {
    cell.timestamp; // Timestamp in milliseconds
    cell.dayOfMonth; // 1-31
    cell.weekday; // 0-6 (Sunday to Saturday)
    cell.monthIndex; // 0-11 (January-December)
    cell.year; // 2025
    cell.isSelected; // true or false
    cell.isDisabled; // true or false
  });
```

Learn more about the `Composer` class and its customization options & view data structure in the [API reference](https://github.com/calendash/calendash/blob/master/packages/core/features/calendar/modules/composer/README.md).

## Middlewares

Middlewares are functions that modify or enrich the generated calendar data.

### Disable middleware

The `disable` middleware disables specific dates and/or weekends in a calendar.

#### Example

```javascript
  import { disable } from '@calendash/core';

  const disableMiddleware = disable({
    // Disable exact dates or holidays
    dates: ['2025-12-25', '2025-01-01'],

    // Disable all Saturdays and Sundays
    weekends: true,

    // Exclude dates from being disabled even if they fall on a weekend
    exclude: ['2025-07-26'], // Saturday
  });
```

## Contributing

Please read our [contribution guidelines](https://github.com/calendash/calendash/blob/master/CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the [MIT License](https://github.com/calendash/calendash/blob/master/LICENSE)
