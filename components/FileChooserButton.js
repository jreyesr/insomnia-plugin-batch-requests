import React, { useCallback } from 'react';
import { selectFile } from '../utils.js';

export default function FileChooserButton({title="Choose File", onChange, extensions}) {
  const _handleChooseFile = useCallback(async () => {
    const { canceled, filePath } = await selectFile({extensions,});

    // Only change the file if a new file was selected
    if (canceled) {
      return;
    }

    onChange(filePath);
  }, [onChange]);

  return <button type="button" title={title} onClick={_handleChooseFile} className="btn btn--clicky btn--super-compact">
    <i className="fa fa-file-o space-right"></i>
    {title}
  </button>
}