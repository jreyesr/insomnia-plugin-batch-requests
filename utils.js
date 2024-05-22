import fs from "fs";

import csv from 'csvtojson';
import { JSONPath } from 'jsonpath-plus';


export const selectFile = async ({ extensions }) => {
  let title = 'Select File'; 

  const options = {
    title,
    buttonLabel: 'Select',
    properties: ["openFile"],
    // @ts-expect-error https://github.com/electron/electron/pull/29322
    filters: [{
      name: "Filtered",
      extensions: (extensions?.length ? extensions : ['*']),
    }],
  };

  const { canceled, filePaths } = await window.dialog.showOpenDialog(options);

  return {
    filePath: filePaths[0],
    canceled,
  };
};

export const writeFile = (path, content) => {
  fs.writeFileSync(path, content, {encoding: "utf8"});
}

export const readCsv = async (path) => {
  let headers;
  let results = await csv()
    .on('header', (h) => {headers = h;})
    .fromFile(path);
  return {headers, results};
}

export const applyJsonPath = (jsonpath, data) => {
  return JSONPath({path: jsonpath, json: data, flatten: true, wrap: false});
}

export const readResponseFromFile = (path) => fs.readFileSync(path, {encoding: "utf-8"})

const STORE_KEY = "settings_global";
export const readSettings = async (store) => {
  if(await store.hasItem(STORE_KEY)) return JSON.parse(await store.getItem(STORE_KEY))
  else return {}
};

export const writeSettings = async (store, newSettings) => await store.setItem(STORE_KEY, JSON.stringify(newSettings));

export async function makeRequest(context, request, i, row, delay, outputConfig, setSent, setCsvData) {
  // Sleep for a bit
  console.debug("sleep started, delay =", delay)
  await new Promise(r => setTimeout(r, delay * 1000))
  console.debug("sleep ended")
    
  const extraData = [{name: "batchExtraData", value: JSON.stringify(row)}]
  // NOTE: The second argument to sendRequests() isn't really documented, but it's there
  // See the run() function on tags.js for an example of how to use it. It may not be supported, but it Seems To Work For Me (TM)
  let response = await context.network.sendRequest(request, extraData)

  setSent(s => s + 1); // Atomically (?) increment the count of sent requests by one
  console.debug(response);

  if(outputConfig.length === 0){
    // No need to process the response, the user hasn't asked for any outputs
    // This means that non-JSON responses are also usable in this plugin,
    // as long as you don't try to read any data out from it (since we don't know how to parse things that aren't JSON)
    console.debug("skipping response extraction")
    return
  }

  let responseData = {};
  // If any outputConfigs refer to the response body, we must parse it
  if(outputConfig.some(x => x.context === "body")) {
    // Check that the Content-Type header is sensible, otherwise error out
    if(!response.contentType.includes("json")) {
      context.app.alert("Error!", `The response has invalid Content-Type "${response.contentType}", needs "application/json"! Alternatively, delete all Outputs and try again.`)
      return // There's no point in attempting to parse the response, just jump to the next request
    }

    console.debug("parsing response data")
    // NOTE: The exports.XYZ is required so mocks can hook this
    // See https://medium.com/welldone-software/jest-how-to-mock-a-function-call-inside-a-module-21c05c57a39f
    responseData = JSON.parse(exports.readResponseFromFile(response.bodyPath))
  }
  console.debug(responseData)

  // WEIRD: Labeled statement! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
  writerForLoop:
  for(const {name, jsonPath, context: ctx} of outputConfig) {
    let out;
    switch(ctx) {
      case "body":
        out = applyJsonPath(jsonPath, responseData) ?? null
        break
      case "headers":
        out = response.headers.find(h => h.name.toLowerCase() === jsonPath.toLowerCase()).value
        break
      case "statusCode":
        out = response.statusCode.toString()
        break
      case "reqTime":
        out = response.elapsedTime.toString()
        break
      default:
        console.error("Unknown outputConfig context:", "name", name, "jsonPath", jsonPath, "context", ctx)
        continue writerForLoop // Skip to next outputConfig
    } 
    console.debug(name, "+", jsonPath, "@", ctx, "=>", out)

    setCsvData(csvData => {
      let newData = [...csvData] // Make a copy of the old data so we can mutate it normally
      // NOTE: If we mutate csvData instead, all state updates are delayed by one tick 
      // and the UI updates one person too late (the last one isn't updated)

      out = JSON.stringify(out);
      // If value was a string, remove the quotes, since they look weird, and we expect strings to be one
      // of the primary output values of the plugin
      if(out.startsWith('"') && out.endsWith('"')) {
        out = out.substring(1, out.length - 1)
      }
      newData[i][name] = out; // Mutate the required field, save it as a string
      return newData
    })
  }
}

