export const templateTags = [{
    name: 'batchVariable',
    displayName: 'Batch',
    liveDisplayName: ([colName, sample]) => (colName.value ? `CSV[${colName.value}]: ${sample.value}` : 'Batch'),
    description: 'Placeholder for the Batch Requests plugin',
    args: [
        {
            displayName: 'Name',
            description: 'Ensure that this value matches the name of a column in your CSV file',
            type: 'string',
            validate: (val) => (val ? '' : 'Enter a column name!'),
        },
        {
            displayName: 'Sample value',
            description: 'This value will be used when sending the request manually (outside of Batch Requests)',
            type: 'string'
        }
    ],
    async run(context, name, sample) {
        // context.renderPurpose is set to 'send' when actually sending the request
        if(context.renderPurpose === 'send') {
            const extraData = context.context.getExtraInfo("batchExtraData")
            if(extraData) {
                console.debug('[store.get]', extraData);
                return JSON.parse(extraData)[name];
            } else {
                console.error(`Cannot find column ${name} on request extra data! Falling back to sample value.`);
                return sample;
            }
        } else {
            // context.renderPurpose is undefined when previewing the template tag's value
            return sample;
        }
    },
}]