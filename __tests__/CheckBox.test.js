import {render, fireEvent} from '@testing-library/react';

import CheckBox from '../components/CheckBox'


it('renders when checked', () => {
  const {container, getByTestId} = render(
    <CheckBox title="Test Title" state={true} />,
  );

  expect(container).toHaveTextContent("Test Title");
  expect(container.firstChild).toBeEnabled();
  expect(getByTestId("icon")).toHaveClass("fa", "fa-check-square-o")
});

it('renders when unchecked', () => {
  const { getByTestId} = render(
    <CheckBox state={false} />,
  );

  expect(getByTestId("icon")).toHaveClass("fa-square-o")
  expect(getByTestId("icon")).not.toHaveClass("fa-check-square-o")
});

it("calls the callback when clicked", async () => {
  const cb = jest.fn();
  const {container} = render(
    <CheckBox state={false} onToggle={cb} />,
  );

  fireEvent.click(container.firstChild);

  expect(cb).toBeCalled();
  expect(cb).toBeCalledWith(true);
});