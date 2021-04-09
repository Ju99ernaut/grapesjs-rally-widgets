import loadComponents from './components';
import loadBlocks from './blocks';
import loadCommands from './commands';

export default (editor, opts = {}) => {
  const options = {
    ...{
      // default options

      // Modal title
      modalCopyTitle: 'Widget',

      // Options for extending the codeviewer
      copyViewerOptions: {},

      // Options for extending widget model
      widgetComponent: {},

      // Url for rally api
      rallyUrl: 'https://api.rally.io/v1/',
    }, ...opts
  };
  const fetch = editor.Storage.get('remote').fetch;

  // Add commands
  loadCommands(editor, options);

  fetch(options.rallyUrl + 'creator_coins')
    .then(res => res.json())
    .then(res => {
      options.coinsList = res;
      // Add components
      loadComponents(editor, options);
      // Add blocks
      loadBlocks(editor, options);
    })
    .catch(err => console.log('Error: ', err))
};