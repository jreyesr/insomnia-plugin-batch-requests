# insomnia-plugin-batch-requests

The Batch Requests plugin for [Insomnia](https://insomnia.rest) adds a context menu option that lets you send a request repeatedly, changing parts of every request by variable data, taken from a CSV file. For every response, some data can be collected and added to the CSV file. See below for a diagram:

![A diagram displaying the flow of data in the plugin](images/flow.png)

## Installing

Go to the `Application>Preferences` menu in Insomnia, then go to the `Plugins` tab, search for `insomnia-plugin-batch-requests` and install it.

## Usage

The plugin adds a template tag to mark the places that you want to replace. To add it, press `Ctrl+Space`, search for the `Batch` tag and press `Enter`. Then, double click the tag to configure it.

![A screenshot showing a template tag that marks a replacement location. It specifies the CSV column that will be used and a sample value that will be sent when manually sending the request](images/templatetag.png)

When configuring the tag, set the following two values:

* The name of the CSV column that will be replaced in this tag's location. Copy it from the first line of the CSV file, exactly (including capitalization)
* A sample value. This value will be used when sending the request manually. This is the value that you would have to edit manually if this plugin did not exist.

The live preview will always show the value of the `Sample value` field. The value will only vary when sending the request via the Batch Request dropdown option (see below).

![A screenshot showing the configuration UI for the template tag. It contains form fields to configure the column name that will be accessed from the CSV file, and a sample value that will be sent when manually sending the request](images/templatetag_config.png)

The plugin also adds a context menu option to all requests. To see it, right-click a request, then select the `Batch Requests` option under the `Plugins` section. This will open the plugin dialog.

![A screenshot showing the context menu aded by the plugin. A request has been right-clicked, and the context menu contains a new "Batch Requests" option under the Plugins section](images/context_menu.png)

On the plugin dialog (see the image below), you should:

1. Select a CSV file using the button. The file should have one column for each different placeholder/template tag that you have selected, plus one column for each result that you want to extract from the responses. The response/output columns can be empty, since they will be filled by the plugin.
2. Review the loaded data in the table. It will show the first five rows of the CSV file. It is provided as a sanity check, so that you can verify that the CSV is being parsed correctly.
3. Configure the data that you want to output by adding `Outputs`. For each one, use the dropdown on the left to specify a CSV column, and write a JSONPath expression in the text field on the right. In the image below, the `$.total` field will be extracted to the `sales` column in the CSV file.
4. Click the `Run!` button at the bottom of the dialog. It will only become active when you have chosen a file and provided at least one Output.

![A screenshot showing the main plugin UI. From top to bottom, there is a button to load a file, a table showing a preview of the data, a series of fields to specify output data, and a button to run the request multiple times](images/runner_ui.png)


