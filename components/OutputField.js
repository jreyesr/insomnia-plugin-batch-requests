import React, { useCallback } from 'react';
import ActionButton from './ActionButton';

export default function OutputField({options, name, jsonPath, onChange, onDelete}) {
  const onChangeName = useCallback((e) => {
    onChange(e.target.value, jsonPath)
  }, [jsonPath, onChange]);

  const onChangeJsonPath = useCallback((e) => {
    onChange(name, e.target.value)
  }, [name, onChange]);

  return <div className="form-row" data-testid="singlefield">
    <select
      value={name}
      onChange={onChangeName} // ... and update the state variable on any change!
      data-testid="fieldname"
    >
      <option value="">---Choose one---</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <input type="text" value={jsonPath} onChange={onChangeJsonPath} placeholder='$.store.books[*].author' data-testid="value"/>
    <ActionButton title="" icon="fa-trash" onClick={onDelete} data-testid="deletebtn"/>
  </div>
}