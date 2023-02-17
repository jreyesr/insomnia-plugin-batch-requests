// This component comes almost directly from 
// https://dev.to/ramonak/react-how-to-create-a-custom-progress-bar-component-in-5-minutes-2lcl

import React from "react";

export default function ProgressBar(props) {
  const { bgcolor, completed, text } = props;

  const containerStyles = {
    height: 15,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 10,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width .2s ease-in-out',
  }

  const labelStyles = {
    paddingInline: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{text || `${completed}%`}</span>
      </div>
    </div>
  );
};