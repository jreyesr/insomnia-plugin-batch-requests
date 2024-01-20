import React, { useCallback, useEffect, useState } from 'react';
import { stringify } from 'csv-stringify/sync';

import { writeFile, readCsv, readSettings, makeRequest } from '../utils';
import Queue from "queue-promise"

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

  // Load default delay from plugin settings on mount
  useEffect(() => {
    async function loadSettings() {
      const settings = await readSettings(context.store);
      setDelay(parseFloat(settings.defaultDelay ?? 0))
    }
    loadSettings();
  }, [])

  const onFileChosen = async (path) => {
    setCsvPath(path);
    const {headers, results} = await readCsv(path);
    setCsvHeaders(headers);
    setCsvData(results);
    setSent(0);
  };

  const saveCsv = useCallback(() => {
    const outString = stringify(csvData, {columns: csvHeaders, header: true});
    writeFile(csvPath, outString);
  }, [csvData, csvHeaders, csvPath]);

  const canRun = csvData.length > 0 && outputConfig.every(x => x.name && x.jsonPath);
  const onRun = async () => {
    setSent(0);

    const queue = new Queue({
      concurrent: 4,
      interval: 0,
      start: false,
    });
    
    // Hook a promise to the queue's "end" event
    const isDone = new Promise(resolve => queue.on("end", resolve))
    for(const [i, row] of csvData.entries()) {
      queue.enqueue(() => makeRequest(context, request, i, row, delay, outputConfig, setSent, setCsvData))
    }

    // Kick off the queue...
    queue.start();
    // ... and wait until complete
    await isDone
  }

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