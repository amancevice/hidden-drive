const hideFile = (drive, data) => {
  return async (file) => {
    const options = {fileId:file.id, permissionId:'anyoneWithLink'};
    return drive.permissions.delete(options)
      // Store hidden file object
      .then((res)  => { data.hidden = data.hidden.concat(file); })
      // Store error
      .catch((err) => { data.errors = data.errors.concat(file); });
  };
};

const hidePage = (drive) => {
  return async (result) => {
    var data = {hidden:[], errors:[]};
    if (result.data.nextPageToken) {
      data.nextPageToken = result.data.nextPageToken;
    }
    await Promise.all(result.data.files.map(hideFile(drive, data)));
    return data;
  };
};

const hide = (drive) => {
  return async (options = {}) => {
    options.q = options.q || `visibility='anyoneWithLink'`;
    return {
      data: await drive.files.list(options).then(hidePage(drive)),
    };
  };
};

let drive;

exports.drive = (client) => {
  drive = {
    client: client,
    hide: hide(client),
  }
  return drive;
}
