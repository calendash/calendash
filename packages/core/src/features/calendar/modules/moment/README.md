# Moment class

A timezone-aware date utility layer that abstracts native Date quirks. It handles parsing, comparisons, offsets, and formatting in a consistent, predictable way. It also provides date navigation and boundary management capabilities.

---

## Constructor

```typescript
constructor(config?: MomentConfig);
```

Creates a new `Moment` instance with the specified configuration options.

### Configuration options

| Option | Type | Description | Default | Accepted Values 
| --- | --- | --- | --- | ---|
| **targetDate** | `Date` \| `string` \| `number` | Sets the initial reference date (target date). | `new Date()` | Any valid `Date`, ISO string, or timestamp |
| **bounds** | `{ min: Date \| string \| number; max: Date \| string \| number; }` | Sets minimum and maximum dates for navigation. | `{ min: new Date('1900-01-01T00:01:01.001Z'), max: new Date('2999-12-31T23:59:59.999Z') }` | Any valid date range |

### Configuration defaults

Defaults are provided internally to ensure a working moment instance out of the box.

```typescript
  const config: MomentConfig = {
    targetDate: new Date(),
    bounds: {
      min: new Date('1900-01-01T00:01:01.001Z'),
      max: new Date('2999-12-31T23:59:59.999Z'),
    },
  };
```

### Example

```javascript
  import { Moment } from '@calendash/core';

  const moment = new Moment({
    // Initial target date (optional)
    targetDate: new Date('2025-01-01'),

    // Date boundaries (optional)
    bounds: {
      min: new Date('2000-01-01T00:00:00.000Z'),
      max: new Date('2050-12-31T23:59:59.999Z'),
    },
  });

  // You can also initialize with default values
  const defaultMoment = new Moment();
```

---

## `moment.date`

The current target date of the calendar. Acts as the reference point from which calendar data is computed.

### Returns

`Date` object.

---

## `moment.bounds`

The current date boundaries of the calendar. Acts as the minimum and maximum allowed dates for navigation.

### Returns

`DateBounds` object.

```typescript
  type DateBounds = {
    min: Date | string | number;
    max: Date | string | number;
  };
```

---

## `moment.add(viewOffsets)`

Applies the specified time offsets to the current `Moment` instance's date, adjusting it by days, weeks, months, etc., as defined in the `viewOffsets` argument.

The method first calculates a new date by applying the offsets, then checks if this new date falls within the allowed bounds of the `Moment` instance. If the new date is within bounds, it updates the internal date; otherwise, the date remains unchanged.

### Parameters

- **viewOffsets** (required): A partial mapping of time units (e.g., `days`, `weeks`, `months`, `years` and/or `decades`) to integer offset values to apply to the current date.

### Returns

The current `Moment` instance, enabling method chaining.

### Example

```javascript
  const moment = new Moment(new Date('2025-01-01'));
  moment.add({ days: 5 }); // Advances the date by 5 days
```

---

## `moment.toZonedDateTime(timeZone)`

Adjusts the current date and date range (`max` and `min`) to the specified time zone.

### Parameters

- **timeZone** (required): The IANA time zone identifier (e.g., "America/New_York").

### Returns

The updated instance with the adjusted time zone.

### Example

```javascript
  const timeZone = 'America/New_York';
  momentInstance.toZonedDateTime(timeZone); // Moment instance adjusted to the New York time zone
```

---

## `moment.from(date)`

Updates the internal date (`year`, `month`, and `day` only) using the provided input.

This method **mutates** the current `Moment` instance and is used internally for synchronizing calendar state with a new reference date, without altering the time components (`hours`, `minutes`, `seconds`, etc.).

If the input date is out of the allowed range, the update is skipped.

### Parameters

- **date** (required): The date to synchronize from. 

> Can be a `Date` object, ISO string, or timestamp.

### Returns

The current `Moment` instance for chaining.

### Example

```javascript
  moment.from(new Date(2024, 4, 10)); // Updates internal state to May 10, 2024
```

---

## `moment.isAdjacentDateVisible(offsetKey, direction)`

Determines whether shifting the current date by the specified offset type and direction results in a date that stays within the allowed bounds.

This method calculates the adjacent date by applying the given offset key (e.g., `'days'`, `'months'`) and navigation direction (`-1` for backward, `1` for forward), then verifies if this new date lies within the configured bounds of the instance.

### Parameters

- **offsetKey** (required): The time unit to offset by (a key of `ViewOffsets` such as `'days'`, `'weeks'`, `'months'`, `'years'` or `'decades'`).
- **direction** (required): The navigation direction: `-1` for backward, `1` for forward.

### Returns

`true` if the calculated adjacent date is within bounds; otherwise, `false`.

### Example

```javascript
  moment.isAdjacentDateVisible('days', 1); // true if the next date is visible, otherwise false
  moment.isAdjacentDateVisible('weeks', -1); // true if the previous date is visible, otherwise false
```
