# Calendar class

The `Calendar` class is the core of the library, providing a flexible and extensible calendar engine.

Its main responsibilities include:

- Managing the target date, view and date boundaries.
- Applying middleware functions to modify the calendar's data.
- Generating calendar data for different views.
- Providing a set of methods for interacting with the calendar.

## Constructor

```typescript
constructor(config?: CalendarConfig);
```

Creates a new `Calendar` instance with the specified configuration options.

### Configuration options

> [!NOTE]   
> All configuration options for `Calendar` are optional. Defaults are provided internally to ensure a working calendar out of the box.

| Option | Type | Description | Default | Accepted Values 
| --- | --- | --- | --- | ---|
| **date** | `Date` \| `string` \| `number` | Sets the initial reference date (target date). | `new Date()` | Any valid `Date`, ISO string, or timestamp |
| **view** | `'day'` \| `'week'` \| `'month'` \| `'year'` \| `'decade'` | Sets the initial calendar view. | `'day'` | One of the supported views |
| **bounds** | `{ min: Date \| string \| number; max: Date \| string \| number; }` | Sets minimum and maximum dates for navigation. | `{ min: new Date('1900-01-01T00:01:01.001Z'), max: new Date('2999-12-31T23:59:59.999Z') }` | Any valid date range |
| **timeZone** | `string` | IANA time zone for consistent date calculations (e.g. `'America/New_York'`). | `undefined` (system time zone) | Any valid IANA time zone string |
| **skipViews** | `string[]` | Views to exclude from navigation (e.g. skip `'decade'`, `'year'`). | `[]` | Any subset of view types |
| **middlewares** | `Middleware[]` | Functions to modify or enrich the generated calendar data. | `[]` | Any matching middleware function |

### Example

```javascript
  import { Calendar, disable } from '@calendash/core';

  const calendar = new Calendar({
    // Initial calendar date (optional)
    date: new Date('2025-03-24T12:00:00.000Z'),

    // Initial view: 'day' | 'week' | 'month' | 'year' | 'decade' (optional)
    view: 'month',

    // Navigation boundaries (optional)
    bounds: {
      min: new Date('2000-03-01T12:00:00.000Z'),
      max: new Date('2050-03-31T12:00:00.000Z'),
    },

    // Time zone for date computations. (optional)
    timeZone: 'America/New_York',

    // Skip certain views (optional)
    skipViews: ['decade', 'year'],

    // Attach middlewares (optional)
    middlewares: [
      disable({
        // Disable exact dates
        dates: ['2025-12-25', '2025-01-01'],

        // Disable weekends (Saturday, Sunday)
        weekends: true,

        // Exclude dates from being disabled even if they fall on a weekend
        exclude: ['2025-07-26'], // Saturday
      }),
    ],
  });

  // You can also initialize with default values
  const defaultCalendar = new Calendar();
```

---

## `calendar.view`

> [!NOTE]   
> It can be one of the following values: `'day'`, `'week'`, `'month'`, `'year'` or `'decade'`.

The current active view of the calendar. Determines the structure of the generated calendar data.

### Retuns

`ViewType` is a TypeScript type alias defined as `'day' | 'week' | 'month' | 'year' | 'decade'`.

## `calendar.target`

The current target date of the calendar. Acts as the reference point from which calendar data is computed.

### Retuns

`Date` object.

## `calendar.data`

The generated calendar data structure for the current view and target date. Its shape depends on the active view (`day`, `week`, etc.), and is suitable for rendering in the UI.

### Retuns

`ViewData[typeof view]` is a TypeScript type alias defined as `Day | Week | Month | Year | Decade`.

Learn more about the `View Structures` in the composer [API reference](./modules/composer/README.md#view-structures).

## `calendar.jumpToDate(date)`

This method uses the `Date` object to update the internal calendar state with a new reference date, without altering the time components such as `hours`, `minutes`, `seconds`, etc. 

> [!IMPORTANT]   
> If the input date is out of the specified boundaries (`min` or `max`), the calendar target date won't be updated.

### Arguments

- **date** (required): The date to navigate to. Must be a valid `Date` object, ISO string, or timestamp.

### Returns

The current `Calendar` instance for method chaining.

#### Example

```javascript
calendar.jumpToDate(new Date('2020-03-24T12:00:00.000Z'));
```

## `calendar.navigate(mode, direction)`

Navigates the calendar based on the specified mode and direction.

- **mode** (required): The navigation mode, either `'date'` or `'view'`.
- **direction** (required): A numeric value representing the navigation direction:
  - `1` to move forward,
  - `-1` to move backward.

### Returns

The current `Calendar` instance for method chaining.

### Example

```javascript
calendar.navigate('date', 1); // Move forward one date interval
calendar.navigate('view', -1); // Move backward one view level
```
