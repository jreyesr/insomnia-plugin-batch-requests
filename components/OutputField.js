import React, { useCallback } from 'react';
import ActionButton from './ActionButton';

export default function OutputField({options, name, context, jsonPath, onChange, onDelete}) {
  const onChangeName = useCallback((e) => {
    onChange(e.target.value, context, jsonPath)
  }, [context, jsonPath, onChange]);

  const onChangeContext = useCallback((e) => {
    onChange(name, e.target.value, jsonPath)
  }, [name, jsonPath, onChange])

  const onChangeJsonPath = useCallback((e) => {
    onChange(name, context, e.target.value)
  }, [name, context, onChange]);

  const placeholder = {
    body: "$.store.books[*].author",
    headers: "X-Some-Header"
  }[context];
  const shouldShowValueField = ["body", "headers"].includes(context);

  return <div className="form-row" data-testid="singlefield">
    <select
      value={name}
      onChange={onChangeName} // ... and update the state variable on any change!
      data-testid="fieldname"
    >
      <option value="">---Choose one---</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>

    ⟸

    <select value={context} onChange={onChangeContext}>
      <option value="body">From body</option>
      <option value="headers">From header</option>
      <option value="statusCode">Status code</option>
      <option value="reqTime">Request time (millis)</option>
    </select>

    <input
      style={{visibility: shouldShowValueField ? 'visible' : 'hidden' }}
      type="text" value={jsonPath} 
      onChange={onChangeJsonPath} 
      placeholder={placeholder} data-testid="value"/>
    
    <ActionButton title="" icon="fa-trash" onClick={onDelete} data-testid="deletebtn"/>
  </div>
}