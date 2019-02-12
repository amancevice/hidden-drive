exports.drive = (client) => {
  var app = {
    _filters: [],
    client: client,

    filter: function filter(fn) {
      this._filters = this._filters.concat(fn);
      return this;
    },

    hide: async function hide(options = {}) {
      var res  = await this.list(options),
          data = {hidden:[], errors:[]};
      if (res.data.nextPageToken) {
        data.nextPageToken = res.data.nextPageToken;
      }
      return Promise.all(res.data.files.map((file) => {
        return this.client.permissions.delete({fileId:file.id, permissionId:'anyoneWithLink'})
          // Store hidden file object
          .then((res)  => { data.hidden = data.hidden.concat(file); })
          // Store error
          .catch((err) => { data.errors = data.errors.concat(file); });
      })).then(() => data);
    },

    list: async function list(options = {}) {
      options.q = `(visibility='anyoneWithLink') and (${options.q || ''})`;
      var res = await this.client.files.list(options);
      res.data.files = this._filters.reduce((x, fn) => x.filter(fn), res.data.files);
      return res;
    },
  }
  return app;
};
