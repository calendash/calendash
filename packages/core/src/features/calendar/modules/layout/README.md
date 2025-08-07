# Layout class

Responsible for determining the view of the calendar by processing the skipped views (if applicable) and providing view navigation functionality.

---

## Constructor

```typescript
constructor(config?: LayoutConfig);
```

Creates a new layout instance. Configuration is optional.

### Configuration options

| Option | Type | Description | Default | Accepted Values 
| --- | --- | --- | --- | ---|
| **viewTarget** | `'day'` \| `'week'` \| `'month'` \| `'year'` \| `'decade'` | The preferred initial view to activate (e.g., `'month'`, `'week'`, etc.). If not provided or invalid, the first available view will be used. | `'day'` | Any valid view type |
| **skipViews** | `string[]` | Views to exclude from navigation (e.g. skip `'decade'`, `'year'`). | `[]` | Any subset of view types |

> [!CAUTION]   
> If `skipViews` is provided, it must not exclude all views. If it does, error will be thrown.

### Configuration defaults

Defaults are provided internally to ensure a working layout instance out of the box.

```typescript
  const config: LayoutConfig = {
    viewTarget: 'day',
    skipViews: [],
  };
```

### Example

```javascript
  import { Layout } from '@calendash/core';

  const layout = new Layout({
    // Initial view: 'day' | 'week' | 'month' | 'year' | 'decade' (optional)
    viewTarget: 'month',

    // Skip certain views (optional)
    skipViews: ['decade', 'year'],
  });

  // You can also initialize with default values
  const defaultLayout = new Layout();
```

---

## `layout.view`

> [!NOTE]   
> It can be one of the following values: `'day'`, `'week'`, `'month'`, `'year'` or `'decade'`.

The current active view of the calendar.

### Returns

`ViewType` is a TypeScript type alias defined as `'day' | 'week' | 'month' | 'year' | 'decade'`.

---

## `layout.getAdjacentView(direction)`

This method attempts to resolve the next or previous view relative to the current one, using the specified direction (`-1` for previous, `1` for next). If the direction is invalid or no adjacent view exists, it returns `undefined`.

### Parameters

- **direction** (required): The navigation direction: `-1` for previous, `1` for next.

### Returns

The adjacent `ViewType` if it exists; otherwise, `undefined`.

### Example

```javascript
  layout.getAdjacentView(1); // Gets the next visible view
  layout.getAdjacentView(-1); // Gets the previous visible view
```

---

## `layout.shift(direction)`

Attempts to shift the current view in the specified direction.

This method tries to move the current view to the adjacent visible view based on the given `direction` (`-1` for backward, `1` for forward). If no adjacent view exists in that direction, the current view remains unchanged.

### Parameters

- **direction** (required): The direction to shift the view: `-1` for backward, `1` for forward.

### Returns

The current instance of `Layout`, allowing method chaining.

### Example

```javascript
  layout.shift(1); // Attempts to move to the next view.
  layout.shift(-1); // Attempts to move to the previous view.
```