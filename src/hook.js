import requireHacker from 'require-hacker';
import endsWith from 'lodash/endsWith';
import loader, { ExtractLocales } from 'translate-maker-loader';
import debug from 'debug';
import qs from 'qs';
import path from 'path';

const log = debug('translate-maker-require-hook');

function process(options, dir, extractLocales) {
  const params = {
    query: '?' + qs.stringify(options),
    resourcePath: path.resolve(dir + '/locale'),
    addDependency: (file) => log('Dependecy: ' + file),
    emitWarning: (message) => log('WARNING: ' + message),
    emitError: (message) => log('ERROR: ' + message),
  };

  if (options.path) {
    params.addExtractedLocale = extractLocales.addExtractedLocale;
  }

  return loader.call(params);
}

export default function hook(options = {}) {
  const extractLocales = new ExtractLocales(options);

  const hookInstance = requireHacker.global_hook('translate-maker', (requirePath, module) => {
    const currentPath = requireHacker.resolve(requirePath, module);

    if (endsWith(currentPath, '/locale/locale')) {
      const parts = currentPath.split('/');
      parts.pop();

      const newPath = parts.join('/');
      return process(options, newPath, extractLocales);
    } else if (endsWith(currentPath, '/locale')) {
      return process(options, currentPath, extractLocales);
    }

    return void 0;
  });

  hookInstance.save = () => extractLocales.save();

  return hookInstance;
}
