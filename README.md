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

// Create Google Drive API client
const client = google.drive({version: 'v3', auth: 'your-auth-token'});
const drive  = hidden.drive(client);

// Filter file(s)
drive.filter((x) => x.id !== 'some-file-ID');

// Hide all files in a particular folder
drive.hide({q: `'${myFolderId}' in parents`});

// Hide all files
drive.hide({pageSize: 25}).then(console.log);

// `hide()` accepts same options as https://developers.google.com/drive/api/v3/reference/files/list
```
