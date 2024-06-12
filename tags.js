export const MAGIC_FILE_FIELD_PREFIX = "%INSOMNIA_PLUGIN_BATCH_REQUESTS%"

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
},
/*
    When set on a Text field in a form body, this template tag will replace itself with the value
    "%INSOMNIA_PLUGIN_BATCH_REQUESTS%<field in CSV column>"
    This will be set by Insomnia as the (text) value of the field.
    Then, as the request is going out, it'll be intercepted by a Request hook (see main.js),
    which will strip the prefix and force the field to be interpreted as a File, rather than pure text,
    as if a user had selected a file to begin with, in the Insomnia UI
*/
{
    name: 'batchFile',
    displayName: 'Batch (File)',
    liveDisplayName: ([colName, sample]) => (colName.value ? `CSV[${colName.value}] as File: ${sample.value}` : 'Batch (File)'),
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
                // Magic marker so we can later (in a request hook) identify these fields and mangle them
                return MAGIC_FILE_FIELD_PREFIX + JSON.parse(extraData)[name];
            } else {
                console.error(`Cannot find column ${name} on request extra data! Falling back to sample value.`);
                return MAGIC_FILE_FIELD_PREFIX + sample;
            }
        } else {
            // context.renderPurpose is undefined when previewing the template tag's value
            return "[File contents of " + sample + "]";
        }
    },
}]