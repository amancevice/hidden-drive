# Hidden Drive

Sharing files by link is surprisingly easy to enable by accident.

This tool strips the `anyoneWithLink` permission from files in Google Drive.

## Installation

```bash
npm install googleapis hidden-drive
```

## Usage

```javascript
const {google} = require('googleapis');
const hidden   = require('hidden-drive');

const client = google.drive({version: 'v3', auth: 'your-auth-token-here'});
const drive  = hidden.drive(client);

module.exports = async (event, context) => {
  // Hide first page
  var result = await drive.hide({pageSize: 25}),
      hidden = res.data.hidden,
      errors = res.data.errors;

  // Hide subsequent pages
  while (result.data.nextPageToken) {
    result = await drive.hide({pageSize: 25, pageToken: res.data.nextPageToken});
    hidden = hidden.concat(result.data.hidden);
    errors = hidden.concat(res.data.errors);
  }

  // Return hidden files and files failed to be hidden
  return {hidden:hidden, errors:errors};
}
```
