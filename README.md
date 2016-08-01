# tachyons-js

Use tachyons with your favorite CSS-in-JS composition solution. WIP, not
published to npm just yet.

## Differences:
- `snake_cased` rather than `kebab-cased`

Works great with [aphrodite](https://github.com/Khan/aphrodite):
```javascript
import { StyleSheet } from 'aphrodite';
import t from 'tachyons-js';

const styles = StyleSheet.create({
  foo: {
    ...t.ma2,
    ...t.ma2_ns,
    ...t.bg_black,
    ...t.ph2,
    ...t.ph3_m,
    ...t.ph3_l,
  },
});
```

hmu if it breaks.