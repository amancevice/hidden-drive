const assert = require('assert');
const hidden = require('../index');

const mockdrive = {
  files: {
    list: async (options) => {
      return {
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
    },
  },
  permissions: {
    delete: async (options) => {
      return {ok: true};
    }
  }
}
const drive = hidden.drive(mockdrive);

describe('hide', () => {
  it('Should delete the permission', async () => {
    const ret = await drive.hide({pageSize: 1});
    const exp = {
          data: {
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
          },
        };
    assert.deepEqual(exp, ret);
  });
});
