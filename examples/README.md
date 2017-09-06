# Examples

Example scripts demonstrating the use of cspace-api.

These examples utilize features of JavaScript [ES2015](https://github.com/lukehoban/es6features#readme) that are not yet natively supported in Node.js. To run an example script, first use [Babel](http://babeljs.io/) to compile it to JavaScript ES5. The `babel-node` program from the [Babel CLI](https://babeljs.io/docs/usage/cli/) package may be used to compile and execute a script using a single command:

```
$ npx babel-node read.js
```

## Contents

The following examples are included:

### CRUD Operations on Records

- [create.js](./create.js) - Create a new object record.
- [read.js](./read.js) - Retrieve an object record by CSID.
- [update.js](./update.js) - Update an object record by CSID.
- [delete.js](./delete.js) - Delete an object record by CSID.
- [uploadFile.js](./uploadFile.js) - Create a new blob record by uploading a file.

### Listing and Searching

- [list.js](./list.js) - List object records.
- [keywordSearch.js](./keywordSearch.js) - Perform a keyword (full text) search on object records.
- [advancedSearch.js](./advancedSearch.js) - Perform an advanced (field-level) search on object records.

### Authentication

- [authCreateToken.js](./authCreateToken.js) - Retrieve a new access token using a username and password.
- [authRefreshToken.js](./authRefreshToken.js) - Refresh an access token using a refresh token.
