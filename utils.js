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