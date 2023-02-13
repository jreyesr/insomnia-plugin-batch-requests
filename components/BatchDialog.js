import React, { useState } from 'react';
import csv from 'csvtojson';

import SampleTable from './SampleTable';
import FormRow from './FormRow';
import FileChooserButton from './FileChooserButton';
import ActionButton from './ActionButton';
import OutputFieldsChooser from './OutputFieldsChooser';

export default function BatchDialog({context, request}) {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [outputConfig, setOutputConfig] = useState([]);

  const onFileChosen = (path => {
    csv()
      .on('header', setCsvHeaders)
      .fromFile(path)
      .then(setCsvData);
  });

  const canRun = csvData.length > 0 && outputConfig.length > 0 && outputConfig.every(x => x.name && x.jsonPath);
  const onRun = async () => {
    for(const row of csvData) {
      const storeKey = `${request._id}.batchExtraData`;
      await context.store.setItem(storeKey, JSON.stringify(row));
      await context.network.sendRequest(request);
      await context.store.removeItem(storeKey);
    }
  };

  const onChangeOutputFields = (x) => {
    setOutputConfig(x)
  }

  return (<React.Fragment>
    <FormRow label="Choose CSV">
      <FileChooserButton onChange={onFileChosen} extensions={["csv"]}/>
    </FormRow>
    {csvData.length ? (
      <FormRow label="Sample data" insideLabel={false}>
        <SampleTable columnNames={csvHeaders} data={csvData} />
      </FormRow>
    ) : <p>Choose a file above to preview it!</p>}

    <OutputFieldsChooser colNames={csvHeaders} onChange={onChangeOutputFields} />
    <ActionButton title="Run!" icon="fa-person-running" onClick={onRun} disabled={!canRun}/>
  </React.Fragment>);
}