import should from 'should';
import hook from '../src';

describe('Loader', () => {
  let currentHook = null;

  it('should be able to add hook', () => {
    currentHook = hook({
      localIdentName: '[name]_[hash:base64:7]',
      path: __dirname + '/output',
      defaultLocale: 'en_US',
      babel: {
        presets: ['es2015'],
      },
    });
  });

  it('should be able to parse locales', () => {
    const locale = require('./locale/locale');
    locale.button.main.should.equal('file_1lHUZ59.button.main');
  });

  it('should be able to unmount hook', () => {
    currentHook.unmount();
  });
});
