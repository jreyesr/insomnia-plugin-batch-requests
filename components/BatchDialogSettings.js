import React, { useCallback, useEffect, useState } from 'react';

import ActionButton from './ActionButton';
import DelaySelector from './DelaySelector';
import FormRow from './FormRow';

import { readSettings, writeSettings } from '../utils';

export default function BatchDialogSettings({context}) {
  const [isDirty, setIsDirty] = useState(false);
  const setDirty = () => setIsDirty(true);

  const [defaultDelay, setDefaultDelay] = useState(0);
  // When mounting component, read from storage to init state
  useEffect(() => {
    async function loadSettings() {
      const settings = await readSettings(context.store);
      setDefaultDelay(parseFloat(settings.defaultDelay ?? 0));
    }
    loadSettings();
  }, [])

  const saveSettings = useCallback(async () => {
    await writeSettings(context.store, {
      defaultDelay: defaultDelay,
    });
    context.app.alert("Success!", "Settings saved")
    setIsDirty(false);

    // Refetch data from store, to ensure that it was saved
    const settings = await readSettings(context.store);
    setDefaultDelay(parseFloat(settings.defaultDelay));
  }, [defaultDelay]);

  const onChangeDelay = ({target: {value}}) => {
    if(value < 0) return;
    setDefaultDelay(parseFloat(value));
    setDirty();
  }

  return (<React.Fragment>
    <FormRow label="Default delay">
      <DelaySelector value={defaultDelay} onChange={onChangeDelay}/>
    </FormRow>

    <ActionButton title="Save" icon="fa-save" onClick={saveSettings} disabled={!isDirty}/>
  </React.Fragment>);
}