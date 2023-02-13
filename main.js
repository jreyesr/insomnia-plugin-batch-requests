import React from 'react';
import { createRoot } from 'react-dom/client';

import BatchDialog from './components/BatchDialog';
import { templateTags } from './tags';

module.exports.requestActions = [{
  label: 'Batch Requests',
  icon: 'fa-repeat',
  action: (context, {request}) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<BatchDialog request={request}/>)

    context.app.dialog('Batch Requests', container, {
      onHide: () => root.unmount(),
    });
  },
}];

module.exports.templateTags = templateTags;