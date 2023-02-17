import React from 'react';

export default function ActionButton({title, onClick, icon, disabled=false, ...props}) {
  return <button type="button" title={title} onClick={onClick} disabled={disabled} className="btn btn--clicky btn--super-compact" {...props}>
    <i className={`fa ${icon} space-right`}></i>
    {title}
  </button>
}