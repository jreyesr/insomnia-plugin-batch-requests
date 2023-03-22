import React from 'react';
import { createRoot } from 'react-dom/client';

import BatchDialog from './components/BatchDialog';
import BatchDialogSettings from './components/BatchDialogSettings';
import { templateTags } from './tags';

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