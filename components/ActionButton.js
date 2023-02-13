import React from 'react';

export default function ActionButton({title, onClick, icon, disabled=false}) {
  return <button type="button" title={title} onClick={onClick} disabled={disabled} className="btn btn--clicky btn--super-compact">
    <i className={`fa ${icon} space-right`}></i>
    {title}
  </button>
}