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