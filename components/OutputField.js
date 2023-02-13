import React, { useCallback } from 'react';
import ActionButton from './ActionButton';

export default function OutputField({options, name, jsonPath, onChange, onDelete}) {
  const onChangeName = useCallback((e) => {
    onChange(e.target.value, jsonPath)
  }, [jsonPath, onChange]);

  const onChangeJsonPath = useCallback((e) => {
    onChange(name, e.target.value)
  }, [name, onChange]);

  return <div className="form-row">
    <select
      value={name}
      onChange={onChangeName} // ... and update the state variable on any change!
    >
      <option value="">---Choose one---</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <input type="text" value={jsonPath} onChange={onChangeJsonPath} />
    <ActionButton title="" icon="fa-trash" onClick={onDelete} />
  </div>
}