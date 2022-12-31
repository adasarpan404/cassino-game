## Style Guide

use ES7 Syntax of importing and exporting

#### import

- use this

```javascript
import { xyz } from "../xyz";
```

- not this

```javascript
const { xyz } = require("../xyz");
```

### export

- use this

```javascript
export function xyz() {
  // do something
}
// or
export const xyz = () => {
  //do something
};
```

- not this

```javascript
exports.xyz = () => {
  // do something
};
```

### default export

- use this

```javascript
function xyz() {
  // do something
}

export default xyz;
```

- not this

```javascript
function xyz() {
  //do something
}
module.exports = xyz;
```

### Variable

1. use camel case

```javascript
const userObj
```

2. use Comments

```javascript
const /** @const string @description what will these variable do */
    userObj
```

### Function

1. use Comments on top of the function like this

```javascript
/**
 *
 * @param {*} phonenumber String
 * @returns boolean
 */
const validatePhoneNumber = (phonenumber) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phonenumber);
};
```
