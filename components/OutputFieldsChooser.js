import React, {useCallback, useEffect, useState} from 'react';

import ActionButton from './ActionButton';
import FormRow from './FormRow';
import OutputField from './OutputField';

export default function OutputFieldsChooser({colNames, presets, onChange, onSavePreset, onLoadPreset, loadedPreset, onDeletePreset}) {
  const [outputs, setOutputs] = useState([]);

  const addNew = useCallback(() => {
    const newVal = outputs.concat([{name: "", context: "body", jsonPath: ""}]);
    setOutputs(newVal);
    onChange(newVal);
  }, [outputs, setOutputs, onChange]);

  const updateField = useCallback((i) => (newName, newContext, newJsonPath) => {
    // Poor man's deep copy, since I'm not sure if you should modify React state in place
    const cloned = JSON.parse(JSON.stringify(outputs))
    cloned[i] = {name: newName, context: newContext, jsonPath: newJsonPath};
    setOutputs(cloned);
    onChange(cloned);
  }, [outputs, setOutputs, onChange]);

  const deleteField = useCallback((i) => () => {
    let cloned = JSON.parse(JSON.stringify(outputs))
    cloned.splice(i, 1); // Remove one element at position i
    setOutputs(cloned);
    onChange(cloned);
  }, [outputs, setOutputs, onChange]);

  // runs every time parent loads a new preset
  useEffect(() => {
    if (!loadedPreset) return

    setOutputs(loadedPreset)
  }, [setOutputs, loadedPreset]);

  const [selectedPreset, setSelectedPreset] = useState("")
  const onSelectedPresetChange = useCallback((ev) => {
    setSelectedPreset(ev.target.value)
    onLoadPreset(ev)
  }, [setSelectedPreset, onLoadPreset])

  return <FormRow label="Outputs">
    {outputs.map((o, i) =>
      <OutputField key={i}
                   options={colNames}
                   name={o.name} context={o.context} jsonPath={o.jsonPath}
                   onChange={updateField(i)} onDelete={deleteField(i)}
      />
    )}

    <div style={{display: "flex", flexDirection: "row", gap: "1em"}}>
      <ActionButton title="Add" icon="fa-plus" onClick={addNew}/>
      <ActionButton title="Save preset" icon="fa-upload" onClick={onSavePreset} disabled={outputs.length === 0}/>
      <select
        value={selectedPreset}
        onChange={onSelectedPresetChange}
        data-testid="loadPreset"
        disabled={presets.length === 0 || colNames.length === 0}
        style={{width: "auto"}}
      >
        <option value="">Load preset...</option>
        {presets.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
      </select>
      <ActionButton title="" icon="fa-trash" onClick={() => onDeletePreset(selectedPreset)} disabled={presets.length === 0 || selectedPreset === ""}/>
    </div>
  </FormRow>
}