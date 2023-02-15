import React, { useState } from 'react';
import csv from 'csvtojson';

import SampleTable from './SampleTable';
import FormRow from './FormRow';
import FileChooserButton from './FileChooserButton';
import ActionButton from './ActionButton';
import OutputFieldsChooser from './OutputFieldsChooser';
import ProgressBar from './ProgressBar';

export default function BatchDialog({context, request}) {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [outputConfig, setOutputConfig] = useState([]);
  const [sent, setSent] = useState(0);

  const onFileChosen = (path => {
    csv()
      .on('header', setCsvHeaders)
      .fromFile(path)
      .then(setCsvData)
      .then(() => setSent(0));
  });

  const canRun = csvData.length > 0 && outputConfig.every(x => x.name && x.jsonPath);
  const onRun = async () => {
    setSent(0);
    for(const row of csvData) {
      const storeKey = `${request._id}.batchExtraData`;
      await context.store.setItem(storeKey, JSON.stringify(row));
      let response = await context.network.sendRequest(request);
      await context.store.removeItem(storeKey);
      setSent(s => s + 1);

      console.log(response);
    }
  };

  const totalRequests = csvData.length;

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
    <FormRow label="Progress">
      <ProgressBar bgcolor="#a11" completed={sent * 100 / totalRequests} text={`${sent}/${totalRequests}`} />
    </FormRow>
    
    <ActionButton title="Run!" icon="fa-person-running" onClick={onRun} disabled={!canRun}/>
  </React.Fragment>);
}