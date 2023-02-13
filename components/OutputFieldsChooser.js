import React, { useCallback, useState } from 'react';

import ActionButton from './ActionButton';
import FormRow from './FormRow';
import OutputField from './OutputField';

export default function OutputFieldsChooser({colNames, onChange}) {
  const [outputs, setOutputs] = useState([]);

  const addNew = useCallback(() => {
    const newVal = outputs.concat([{name: "", jsonPath: ""}]);
    setOutputs(newVal);
    onChange(newVal);
  }, [outputs, setOutputs, onChange]);

  const updateField = useCallback((i) => (newName, newJsonPath) => {
    // Poor man's deep copy, since I'm not sure if you should modify React state in place
    const cloned = JSON.parse(JSON.stringify(outputs))
    cloned[i] = {name: newName, jsonPath: newJsonPath};
    setOutputs(cloned);
    onChange(cloned);
  }, [outputs, setOutputs, onChange]);
  
  const deleteField = useCallback((i) => () => {
    let cloned = JSON.parse(JSON.stringify(outputs))
    cloned.splice(i, 1); // Remove one element at position i
    setOutputs(cloned);
    onChange(cloned);
  }, [outputs, setOutputs, onChange]);

  return <FormRow label="Outputs">
    {outputs.map((o, i) => 
      <OutputField key={i} options={colNames} name={o.name} jsonPath={o.jsonPath} onChange={updateField(i)} onDelete={deleteField(i)}/>
    )}
    <ActionButton title="Add" icon="fa-plus" onClick={addNew}/>
  </FormRow>
}