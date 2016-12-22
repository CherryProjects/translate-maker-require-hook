import requireHacker from 'require-hacker';
import endsWith from 'lodash/endsWith';
import loader, { ExtractLocales } from 'translate-maker-loader';
import debug from 'debug';
import qs from 'qs';
import path from 'path';

const logError = debug('translate-maker-require-hook:error');
const logWarning = debug('translate-maker-require-hook:warning');
const logDependency = debug('translate-maker-require-hook:dependency');

function process(options, dir, extractLocales) {
  const params = {
    options, // getLocalIndent is using it
    query: '?' + qs.stringify(options),
    resourcePath: path.resolve(dir + '/locale'),
    addDependency: (file) => logDependency(file),
    emitWarning: (message) => logWarning(message),
    emitError: (message) => logError(message),
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
