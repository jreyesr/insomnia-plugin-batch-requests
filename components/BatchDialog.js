import React, { useState } from 'react';
import csv from 'csvtojson';

import { applyJsonPath, readResponseFromFile } from '../utils';

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
    for(const [i, row] of csvData.entries()) {
      const storeKey = `${request._id}.batchExtraData`;
      await context.store.setItem(storeKey, JSON.stringify(row));
      let response = await context.network.sendRequest(request);
      await context.store.removeItem(storeKey);
      setSent(s => s + 1);
      console.debug(response);

      // If we need to extract response data, check that the Content-Type header is sensible, otherwise error out
      if(outputConfig.length > 0 && !response.contentType.startsWith("application/json")) {
        context.app.alert("Error!", `The response has invalid Content-Type "${response.contentType}", needs "application/json"! Alternatively, delete all Outputs and try again.`)
        continue; // There's no point in attempting to parse the response, just jump to the next request
      }

      // Read the response data, then apply JSONPath expressions on it and update the CSV data
      const responseData = JSON.parse(readResponseFromFile(response.bodyPath));
      console.debug(responseData)
      for(const {name, jsonPath} of outputConfig) {
        const out = applyJsonPath(jsonPath, responseData) ?? null;
        console.debug(name, "+", jsonPath, "=>", out);

        let nextData = [...csvData]; // Copy the array so that it can trigger a state update
        nextData[i][name] = JSON.stringify(out); // Mutate the required field, save it as a string
        setCsvData(nextData);
      }
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