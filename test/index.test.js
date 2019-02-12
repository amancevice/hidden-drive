const assert = require('assert');
const hidden = require('../index');

const mockres = {
  data: {
    nextPageToken: 'FIZZBUZZ',
    files: [
      {
        kind:     'drive#file',
        id:       'fizz-buzz',
        name:     'Fizzing, Buzzing',
        mimeType: 'application/vnd.google-apps.document',
      },
    ],
  },
};
const mockdrive = {
  files:       {list:   (options) => Promise.resolve(JSON.parse(JSON.stringify(mockres)))},
  permissions: {delete: (options) => Promise.resolve({ok: true})},
};
const mockerr = {
  files:       {list:   (options) => Promise.resolve(JSON.parse(JSON.stringify(mockres)))},
  permissions: {delete: (options) => Promise.reject('ERR!')},
};

describe('hide', () => {

  it('Should delete the permission', async () => {
    const app = hidden.drive(mockdrive);
    const ret = await app.hide();
    const exp = {
      nextPageToken: 'FIZZBUZZ',
      errors: [],
      hidden: [
        {
          kind:     'drive#file',
          id:       'fizz-buzz',
          name:     'Fizzing, Buzzing',
          mimeType: 'application/vnd.google-apps.document',
        },
      ],
    };
    assert.deepEqual(ret, exp);
  });

  it('Should filter the file', async () => {
    const app = hidden.drive(mockdrive).filter(x => x.id !== 'fizz-buzz');
    const ret = await app.hide();
    const exp = {
      nextPageToken: 'FIZZBUZZ',
      errors: [],
      hidden: [],
    };
    assert.deepEqual(ret, exp);
  });

  it('Should error', async () => {
    const app = hidden.drive(mockerr);
    const ret = await app.hide();
    const exp = {
      nextPageToken: 'FIZZBUZZ',
      errors: [
        {
          kind:     'drive#file',
          id:       'fizz-buzz',
          name:     'Fizzing, Buzzing',
          mimeType: 'application/vnd.google-apps.document',
        },
      ],
      hidden: [],
    };
    assert.deepEqual(ret, exp);
  });

});
