import React, { useState } from 'react';
import csv from 'csvtojson';
import fs from 'fs';

import SampleTable from './SampleTable';
import FormRow from './FormRow';
import FileChooserButton from './FileChooserButton';


export default function BatchDialog() {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);

  const onFileChosen = (path => {
    csv()
      .on('header', setCsvHeaders)
      .fromFile(path)
      .then(setCsvData);
  });

  return (<React.Fragment>
    <FormRow label="Choose CSV">
      <FileChooserButton onChange={onFileChosen} extensions={["csv"]}/>
    </FormRow>
    {csvData.length ? (
      <FormRow label="Sample data" insideLabel={false}>
        <SampleTable columnNames={csvHeaders} data={csvData} />
      </FormRow>
    ) : <p>Choose a file above to preview it!</p>}

  </React.Fragment>);
}