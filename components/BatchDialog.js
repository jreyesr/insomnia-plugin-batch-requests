import React, { useCallback, useState } from 'react';
import csv from 'csvtojson';
import { stringify } from 'csv-stringify/sync';

import { applyJsonPath, readResponseFromFile, writeFile } from '../utils';

import SampleTable from './SampleTable';
import FormRow from './FormRow';
import FileChooserButton from './FileChooserButton';
import ActionButton from './ActionButton';
import OutputFieldsChooser from './OutputFieldsChooser';
import ProgressBar from './ProgressBar';
import DelaySelector from './DelaySelector';

export default function BatchDialog({context, request}) {
  const [csvPath, setCsvPath] = useState("");
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [outputConfig, setOutputConfig] = useState([]);
  const [sent, setSent] = useState(0);
  const [delay, setDelay] = useState(0);

  const onFileChosen = (path => {
    setCsvPath(path);
    csv()
      .on('header', setCsvHeaders)
      .fromFile(path)
      .then(setCsvData)
      .then(() => setSent(0));
  });

  const saveCsv = useCallback(() => {
    const outString = stringify(csvData, {columns: csvHeaders, header: true});
    writeFile(csvPath, outString);
  }, [csvData, csvHeaders, csvPath]);

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

      // Sleep for a bit
      console.debug("sleep started, delay =", delay)
      await new Promise(r => setTimeout(r, delay * 1000));
      console.debug("sleep ended")

      if(outputConfig.length === 0){
        // No need to process the response, the user hasn't asked for any outputs
        console.debug("skipping response extraction")
        continue;
      }
      // At this point, we know that we need to extract response data

      // Check that the Content-Type header is sensible, otherwise error out
      if(!response.contentType.startsWith("application/json")) {
        context.app.alert("Error!", `The response has invalid Content-Type "${response.contentType}", needs "application/json"! Alternatively, delete all Outputs and try again.`)
        continue; // There's no point in attempting to parse the response, just jump to the next request
      }

      console.debug("parsing response data")
      // Read the response data, then apply JSONPath expressions on it and update the CSV data
      const responseData = JSON.parse(readResponseFromFile(response.bodyPath));
      console.debug(responseData)
      for(const {name, jsonPath} of outputConfig) {
        let out = applyJsonPath(jsonPath, responseData) ?? null;
        console.debug(name, "+", jsonPath, "=>", out);

        let nextData = [...csvData]; // Copy the array so that it can trigger a state update
        out = JSON.stringify(out);
        // BUGFIX: If value was a string, remove the quotes, since they look weird, and we expect strings to be one
        // of the primary output values of the plugin
        if(out.startsWith('"') && out.endsWith('"')) {
          out = out.substring(1, out.length - 1);
        }
        nextData[i][name] = out; // Mutate the required field, save it as a string
        setCsvData(nextData);
      }
    }
  };

  const totalRequests = csvData.length;

  const onChangeOutputFields = (x) => {
    setOutputConfig(x)
  }

  const onChangeDelay = ({target: {value}}) => {
    if(value < 0) return;
    setDelay(value)
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

    <FormRow label="Run config">
      <DelaySelector value={delay} onChange={onChangeDelay}/>
    </FormRow>

    <FormRow label="Progress">
      <ProgressBar bgcolor="#a11" completed={sent * 100 / totalRequests} text={`${sent}/${totalRequests}`} />
    </FormRow>
    
    <ActionButton title="Run!" icon="fa-person-running" onClick={onRun} disabled={!canRun}/>
    <ActionButton title="Save" icon="fa-save" onClick={saveCsv} disabled={!canRun} style={{marginLeft: 5}}/>
  </React.Fragment>);
}