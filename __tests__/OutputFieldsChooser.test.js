import {render, fireEvent, within} from '@testing-library/react';

import OutputFieldsChooser from '../components/OutputFieldsChooser'

it('displays default UI', () => {
  const {container} = render(
    <OutputFieldsChooser colNames={["a", "b"]} />,
  );

  expect(container).toHaveTextContent("Add");
});

it('can add a field', () => {
  const {getByText, getAllByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={jest.fn()} />,
  );

  fireEvent.click(getByText("Add"));

  expect(getAllByTestId("singlefield")).toHaveLength(1);
});

it('notifies parent when field is added', () => {
  const onChange = jest.fn();
  const {getByText} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );

  fireEvent.click(getByText("Add"));

  expect(onChange).toBeCalledWith([{jsonPath: "", name: ""}]);
});

it('notifies parent when field is deleted', () => {
  const onChange = jest.fn();
  const {getByText, getByTestId, queryAllByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );
  fireEvent.click(getByText("Add"));
  onChange.mockClear();

  const field = getByTestId("singlefield");
  fireEvent.click(within(field).getByTestId("deletebtn"));

  expect(onChange).toBeCalledWith([]);
  expect(queryAllByTestId("singlefield")).toHaveLength(0);
});

it('notifies parent when field is updated', () => {
  const onChange = jest.fn();
  const {getByText, getByTestId} = render(
    <OutputFieldsChooser colNames={["a", "b"]} onChange={onChange} />,
  );
  fireEvent.click(getByText("Add"));
  onChange.mockClear();

  const field = getByTestId("singlefield");
  fireEvent.change(within(field).getByTestId("value"), {target: {value: "$.some.field"}});
  fireEvent.change(within(field).getByTestId("fieldname"), {target: {value: "a"}});

  expect(onChange).toHaveBeenLastCalledWith([{"jsonPath": "$.some.field", "name": "a"}]);
});