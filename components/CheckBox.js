import React from "react";

export default function CheckBox({title, state, onToggle}) {
  return <label style={{paddingInline: 5}}>
    <button title={title} onClick={() => onToggle(!state)}>
      <i className={`fa fa${state ? '-check' : ''}-square-o`} data-testid="icon"></i>
    </button>
    {title}
  </label>
}
