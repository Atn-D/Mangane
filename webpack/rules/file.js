const { join } = require('path');
const { settings, packsPath } = require('../configuration');

module.exports = {
  test: new RegExp(`(${settings.static_assets_extensions.join('|')})$`, 'i'),
  use: [
    {
      loader: 'file-loader',
      options: {
        name(file) {
          if (file.includes(settings.source_path)) {
            return packsPath('media/[path][name]-[hash].[ext]');
          }
          return packsPath('media/[folder]/[name]-[hash:8].[ext]');
        },
        context: join(settings.source_path),
      },
    },
  ],
};
