import {render, fireEvent, waitFor} from '@testing-library/react';

import ActionButton from '../components/ActionButton'


it('renders with default values', () => {
  const {container, getByTestId} = render(
    <ActionButton title="Test Title" icon="fa-test" />,
  );

  expect(container).toHaveTextContent("Test Title");
  expect(container.firstChild).toBeEnabled();
  expect(getByTestId("icon")).toHaveClass("fa", "fa-test")
});

it("calls the callback when clicked", async () => {
  const cb = jest.fn();
  const {container} = render(
    <ActionButton onClick={cb} />,
  );

  fireEvent.click(container.firstChild);

  expect(cb).toBeCalled();
});

it("does not call the callback when disabled", async () => {
  const cb = jest.fn();
  const {container} = render(
    <ActionButton onClick={cb} disabled={true}/>,
  );

  fireEvent.click(container.firstChild);

  expect(cb).not.toBeCalled();
});