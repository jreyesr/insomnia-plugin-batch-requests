import { useCallback } from 'react';
import { selectFile } from '../utils.js';

import ActionButton from './ActionButton.js';

export default function FileChooserButton({title="Choose File", onChange, extensions}) {
  const _handleChooseFile = useCallback(async () => {
    const { canceled, filePath } = await selectFile({extensions,});

    // Only change the file if a new file was selected
    if (canceled) {
      return;
    }

    onChange(filePath);
  }, [onChange]);

  return <ActionButton title={title} icon="fa-file-o" onClick={_handleChooseFile} />
}