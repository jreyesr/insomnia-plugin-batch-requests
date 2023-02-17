import { JSONPath } from 'jsonpath-plus';
import fs from "fs";

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

export const applyJsonPath = (jsonpath, data) => {
  return JSONPath({path: jsonpath, json: data, flatten: true, wrap: false});
}

export const readResponseFromFile = (path) => fs.readFileSync(path, {encoding: "utf-8"})