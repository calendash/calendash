# Composer class

Responsible for generating calendar view data (`day`, `week`, `month`, `year`, `decade`), applying middlewares, and optimizing builds through internal caching.

---

## Constructor

```typescript
constructor(config?: ComposerConfig);
```

Creates a new composer instance. Configuration is optional.

### Configuration options

| Option | Type | Description |
| --- | --- | --- |
| **timeZone** | `string` | IANA time zone string (e.g., "America/New_York"). |
| **bounds** | `{ min, max }` | Optional date boundaries to indicate whether the generated data falls outside the defined bounds. |
| **middlewares** | `Middleware[]` | Optional array of functions to intercept and modify cell metadata. |

### Configuration defaults

Defaults are provided internally to ensure a working composer instance out of the box.

```typescript
  const config: ComposerConfig = {
    timeZone: undefined,
    bounds: {
      min: new Date('1900-01-01T00:01:01.001Z'),
      max: new Date('2999-12-31T23:59:59.999Z'),
    },
    middlewares: [],
  };
```

### Example

```javascript
  import { Composer, disable } from '@calendash/core';

  const composer = new Composer({
    // Time zone for date computations. (optional)
    timeZone: 'America/New_York',

    // Date boundaries (optional).
    bounds: {
      min: new Date('2000-03-01T12:00:00.000Z'),
      max: new Date('2050-03-31T12:00:00.000Z'),
    },

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
  const defaultComposer = new Composer();
```

---

## `composer.data(view, target)`

Generates structured data for a specific view (`day`, `week`, etc.) and target date.

Internally cached to avoid recomputation if input hasn't changed.

### Parameters

- **view** (required): The view type to build (`'day'`, `'week'`, `'month'`, `'year'` or `'decade'`).
- **target** (required): The target date to generate data for.

### Returns

One of the following shapes depending on view: `Day`, `Week`, `Month`, `Year`, or `Decade`.

> See [View Structures](#view-structures) for return shape.

---

## View structures

Each view provides a cells grid (`Grid<T> = T[][]`) and a flag such as `isCurrentX`.

> [!NOTE]   
> Use `data.cells[row][col]` or nested `forEach()` for traversal.

### Day structure

| Property | Type | Description |
| --- | --- | --- |
| `isCurrentDay` | `boolean` | Indicates whether the target date corresponds to **today** or not. |
| `cells` | `Grid<DayCell>` | A 1x1 grid, where the single `DayCell` represents the selected day. |

```typescript
  const data: Day = composer.data('day', new Date());

  // Properties
  data.isCurrentDay;
  for (const row of data.cells) {
    for (const cell of row) {
      console.log({
        timestamp: cell.timestamp,
        dayOfMonth: cell.dayOfMonth,
        weekday: cell.weekday,
        monthIndex: cell.monthIndex,
        year: cell.year,
        isSelected: cell.isSelected,
        isDisabled: cell.isDisabled,
      });
    }
  }
```

### Week structure

| Property | Type | Description |
| --- | --- | --- |
| `isCurrentWeek` | `boolean` | Indicates whether the target week includes **today** or not. |
| `cells` | `Grid<WeekCell>` | A 1x7 grid, where each cell represents a single day in the week. |

```typescript
  const data: Week = composer.data('week', new Date());

  // Properties
  data.isCurrentWeek;
  for (const row of data.cells) {
    for (const cell of row) {
      console.log({
        timestamp: cell.timestamp,
        dayOfMonth: cell.dayOfMonth,
        weekday: cell.weekday,
        monthIndex: cell.monthIndex,
        year: cell.year,
        isCurrentDay: cell.isCurrentDay,
        isSelected: cell.isSelected,
        isDisabled: cell.isDisabled,
      });
    }
  }
```

### Month structure

| Property | Type | Description |
| --- | --- | --- |
| `isCurrentMonth` | `boolean` | Indicates whether the target month includes **today** or not. |
| `cells` | `Grid<MonthCell>` | A 6x7 grid, where each cell represents a single day in the month. |

```typescript
  const data: Month = composer.data('month', new Date());

  // Properties
  data.isCurrentMonth;
  for (const row of data.cells) {
    for (const cell of row) {
      console.log({
        timestamp: cell.timestamp,
        dayOfMonth: cell.dayOfMonth,
        weekday: cell.weekday,
        monthIndex: cell.monthIndex,
        year: cell.year,
        isCurrentDay: cell.isCurrentDay,
        isCurrentWeek: cell.isCurrentWeek,
        isOutsideView: cell.isOutsideView,
        isSelected: cell.isSelected,
        isDisabled: cell.isDisabled,
      });
    }
  }
```

### Year structure

| Property | Type | Description |
| --- | --- | --- |
| `isCurrentYear` | `boolean` | Indicates whether the target year includes **today** or not. |
| `cells` | `Grid<YearCell>` | A 4x3 grid, where each cell represents a single month in the year. |

```typescript
  const data: Year = composer.data('year', new Date());

  // Properties
  data.isCurrentYear;
  for (const row of data.cells) {
    for (const cell of row) {
      console.log({
        timestamp: cell.timestamp,
        monthIndex: cell.monthIndex,
        year: cell.year,
        isCurrentMonth: cell.isCurrentMonth,
        isSelected: cell.isSelected,
        isDisabled: cell.isDisabled,
      });
    }
  }
```

### Decade structure

| Property | Type | Description |
| --- | --- | --- |
| `isCurrentDecade` | `boolean` | Indicates whether the target decade is the same as the current decade. |
| `cells` | `Grid<DecadeCell>` | A 4x3 grid, where each cell represents a single year in the decade. |

```typescript
  const data: Decade = composer.data('decade', new Date());

  // Properties
  data.isCurrentDecade;
  for (const row of data.cells) {
    for (const cell of row) {
      console.log({
        timestamp: cell.timestamp,
        year: cell.year,
        isCurrentYear: cell.isCurrentYear,
        isOutsideView: cell.isOutsideView,
        isSelected: cell.isSelected,
        isDisabled: cell.isDisabled,
      });
    }
  }
```

---

## Property definitions

| Property | Type | Description |
| --- | --- | --- |
| **timestamp** | `number` | Timestamp in milliseconds since the Unix epoch (`Date.getTime()`). |
| **dayOfMonth** | `number` | The day of the month (1–31).
| **weekday** | `number` | The day of the week (0–6), where 0 = Sunday and 6 = Saturday. |
| **monthIndex** | `number` | The zero-based month index (0 = January, 11 = December). |
| **year** | `number` | The full year (e.g., 2025). |
| **isCurrentDay** | `boolean` | Indicates whether this cell represents today's date. |
| **isCurrentWeek** | `boolean` | Indicates whether this cell represents today's week. |
| **isCurrentMonth** | `boolean` | Indicates whether this cell represents today's month. |
| **isCurrentYear** | `boolean` | Indicates whether this cell represents today's year. |
| **isOutsideView** | `boolean` | Indicates whether this cell falls outside the current visible calendar view. For example, a day in a previous or next month rendered in a monthly view grid. |
| **isSelected** | `boolean` | Indicates whether this cell is current date target. |
| **isDisabled** | `boolean` | Indicates whether this cell falls outside the defined bounds or is disabled by middleware. |
