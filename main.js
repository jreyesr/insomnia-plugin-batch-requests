import React from 'react';
import { createRoot } from 'react-dom/client';

import BatchDialog from './components/BatchDialog';

export const requestActions = [{
  label: 'Batch Requests',
  icon: 'fa-repeat',
  action: (context) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<BatchDialog/>)
    console.debug(root);

    context.app.dialog('Batch Requests', container, {
      onHide: () => root.unmount(),
    });
  },
}];