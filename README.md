# tachyons-js

Use tachyons with your favorite CSS-in-JS composition solution.

Works great with [aphrodite](https://github.com/Khan/aphrodite):
```
import { StyleSheet } from 'aphrodite';
import t from 'tachyons-js';

const styles = StyleSheet.create({
  foo: {
    ...t.ma2,
    ...t.ma2_ns,
    ...t.bg_black,
    ...t.bg_silver_m,
    ...t.bg_white__l,
  },
});
```

WIP, hmu if it breaks.
