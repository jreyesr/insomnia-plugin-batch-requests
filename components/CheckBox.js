import React from "react";

export default function CheckBox({title, state, onToggle}) {
  return <label style={{paddingInline: 5}}>
    <button title={title} onClick={() => onToggle(!state)}>
      <i class={`fa fa${state ? '-check' : ''}-square-o`}></i>
    </button>
    {title}
  </label>
}
