# Examples

Example scripts demonstrating the use of cspace-api.

These examples utilize features of JavaScript [ES2015](https://github.com/lukehoban/es6features#readme) that are not yet natively supported in Node.js. To run an example script, first use [Babel](http://babeljs.io/) to compile it to JavaScript ES5. The `babel-node` program from the [Babel CLI](https://babeljs.io/docs/usage/cli/) package may be used to compile and execute a script using a single command:

```
$ ./node_modules/.bin/babel-node examples/read.js
```

## Table of Contents

The following examples are included:

### CRUD Operations on Records

- [create.js](./create.js)
- [read.js](./read.js)
- [update.js](./update.js)
- [delete.js](./delete.js)

### Listing and Searching

- [list.js](./list.js)
- [keywordSearch.js](./keywordSearch.js)
- [advancedSearch.js](./advancedSearch.js)

### Authentication

- [authCreateToken.js](./authCreateToken.js)
- [authRefreshToken.js](./authRefreshToken.js)