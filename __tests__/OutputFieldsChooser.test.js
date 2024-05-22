import {render, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OutputFieldsChooser from '../components/OutputFieldsChooser'

it('displays default UI', () => {
  const {container} = render(
    <OutputFieldsChooser colNames={["a", "b"]} />,
  );

  expect(container).toHaveTextContent("Add");
});

it('can add a field', async () => {
  const user = userEvent.setup();
  const {getByText, getAllByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={jest.fn()} />,
  );

  await user.click(getByText("Add"));

  expect(getAllByTestId("singlefield")).toHaveLength(1);
});

it('notifies parent when field is added', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  const {getByText} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );

  await user.click(getByText("Add"));

  expect(onChange).toBeCalledWith([{jsonPath: "", name: "", "context": "body"}]);
});

it('notifies parent when field is deleted', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  const {getByText, getByTestId, queryAllByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );
  await user.click(getByText("Add"));
  onChange.mockClear();

  const field = getByTestId("singlefield");
  await user.click(within(field).getByTestId("deletebtn"));

  expect(onChange).toBeCalledWith([]);
  expect(queryAllByTestId("singlefield")).toHaveLength(0);
});

it('notifies parent when field is updated', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  const {getByText, getByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );
  await user.click(getByText("Add"));
  onChange.mockClear();

  const field = getByTestId("singlefield");
  await user.type(within(field).getByTestId("value"), "$.some.field");
  await user.selectOptions(within(field).getByTestId("fieldname"), "a");

  expect(onChange).toHaveBeenLastCalledWith([{"jsonPath": "$.some.field", "name": "a", "context": "body"}]);
});

it("tracks the output's context", async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  const {getByText, getByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );
  await user.click(getByText("Add"));
  onChange.mockClear();

  const field = getByTestId("singlefield");
  await user.selectOptions(within(field).getByTestId("context"), "Status code");

  expect(onChange).toHaveBeenLastCalledWith([{"jsonPath": "", "name": "", "context": "statusCode"}]);
})