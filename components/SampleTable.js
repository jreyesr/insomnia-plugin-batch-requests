import React, { useState } from 'react';

export default function SampleTable({columnNames, data, numSamples=5}) {
  const sampleData = data.slice(0, numSamples);
  
  return (
    <React.Fragment>
      <table className="table--fancy table--striped table--compact">
        <thead>
          <tr>
            {columnNames.map(n => <th key={n}>{n}</th>)}
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, i) => (
            <tr key={i} className="selectable">
              {columnNames.map(n => <td key={n} className="force-wrap">{row[n] ?? "NULL"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}