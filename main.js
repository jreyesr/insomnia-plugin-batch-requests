import React from 'react';
import { createRoot } from 'react-dom/client';

import BatchDialog from './components/BatchDialog';
import BatchDialogSettings from './components/BatchDialogSettings';
import { templateTags, MAGIC_FILE_FIELD_PREFIX } from './tags';


module.exports.requestHooks = [
  /*
    Intercepts outgoing requests, and then:
    1. Finds any fields in the req body whose value starts with %INSOMNIA_PLUGIN_BATCH_REQUESTS%
    2. Force-converts them into File fields (they'll be coming in as Text fields)
    3. The file that will be sent on that field will be the rest of the text value 
       (i.e. everything that came _after_ %INSOMNIA_PLUGIN_BATCH_REQUESTS%)
    
    This hook works in concert with the Batch (File) template tag (see tags.js), 
    which generates values with the requisite magic prefix.
  */
  context => {
    const body = context.request.getBody();
    if(body.mimeType === "multipart/form-data" && body.params) {
      for(let param of body.params) {
        if(param.value.startsWith(MAGIC_FILE_FIELD_PREFIX)) {
          param.type = "file"
          param.fileName = param.value.replace(MAGIC_FILE_FIELD_PREFIX, "");
        }
      }
    }
    context.request.setBody(body);
  }
];


// Provides the context menu action that appears when opening the dropdown menu
// for a request, which is the main entrypoint to the plugin's functionality
module.exports.requestActions = [{
  label: 'Batch Requests',
  icon: 'fa-repeat',
  action: (context, {request}) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<BatchDialog context={context} request={request}/>)

    context.app.dialog('Batch Requests', container, {
      onHide: () => root.unmount(),
    });
  },
}];

module.exports.workspaceActions = [{
  label: 'Batch Requests: Settings',
  icon: 'fa-cog',
  action: async (context) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<BatchDialogSettings context={context}/>)

    context.app.dialog('Batch Requests: Settings', container, {
      onHide: () => root.unmount(),
    });
  },
}];


module.exports.templateTags = templateTags;