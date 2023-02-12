import React from 'react';

export default function FormRow({label, children, insideLabel=true}) {
  return <div className="form-row">
    <div className="form-control form-control--outlined">
      <label>{label}{insideLabel && children}</label>
      {!insideLabel && children}
    </div>
  </div>
}
