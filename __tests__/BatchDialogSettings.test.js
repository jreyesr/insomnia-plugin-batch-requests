import {render, fireEvent, waitFor} from '@testing-library/react';

import BatchDialogSettings from '../components/BatchDialogSettings'

const mockAlert = jest.fn((title, text) => {});
const mockGetItem = jest.fn(k => JSON.stringify({defaultDelay: 0.2}));

afterEach(() => {
  mockAlert.mockClear();
  mockGetItem.mockClear();
})

const mockContext = {
  store: {
    hasItem: jest.fn(k => true),
    getItem: mockGetItem,
  },
  app: {
    alert: mockAlert,
  },
};

it('renders with the saved value', async () => {
  const {queryByLabelText} = render(
    <BatchDialogSettings context={mockContext} />,
  );
  const delayField = queryByLabelText(/default delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.2));

  expect(mockGetItem).toHaveBeenCalledWith("settings_global")
});

it('triggers the save function', async () => {
  const mockSetItem = jest.fn((k,v) => {})
  const mockContextWithSet = {
    ...mockContext,
    store: {
      ...mockContext.store,
      setItem: mockSetItem,
    },
  }
  const {getByText, getByLabelText} = render(
    <BatchDialogSettings context={mockContextWithSet} />,
  );

  fireEvent.change(getByLabelText(/default delay/i), {target: {value: 0.3}})
  fireEvent.click(getByText("Save"));
  await waitFor(() => expect(mockSetItem).toBeCalled())
});

it('rejects negative numbers', async () => {
  const {queryByLabelText, getByText, getByLabelText} = render(
    <BatchDialogSettings context={mockContext} />,
  );

  const delayField = queryByLabelText(/default delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.2));
  
  fireEvent.change(delayField, {target: {value: -.1}})
  expect(delayField).toHaveValue(0.2);
});

it("doesn't enable the Save button when loading", async () => {
  const {getByText, getByLabelText} = render(
    <BatchDialogSettings context={mockContext} />,
  );
  // wait for onMount effects to run
  await waitFor(() => expect(getByLabelText(/default delay/i)).toHaveValue(0.2));
  
  expect(getByText("Save")).toBeDisabled();
});

it("enables the Save button after a change is made", async () => {
  const {getByText, getByLabelText} = render(
    <BatchDialogSettings context={mockContext} />,
  );
  // wait for onMount effects to run
  await waitFor(() => expect(getByLabelText(/default delay/i)).toHaveValue(0.2));
  
  fireEvent.change(getByLabelText(/default delay/i), {target: {value: 0.3}})
  expect(getByText("Save")).toBeEnabled();
});

it("redisables the Save button after saving changes", async () => {
  const mockSetItem = jest.fn((k,v) => {})
  const mockContextWithSet = {
    ...mockContext,
    store: {
      ...mockContext.store,
      setItem: mockSetItem,
    },
  }
  const {getByText, getByLabelText} = render(
    <BatchDialogSettings context={mockContextWithSet} />,
  );
  fireEvent.change(getByLabelText(/default delay/i), {target: {value: 0.3}})
  fireEvent.click(getByText("Save"));

  // wait for effects to settle
  await waitFor(() => expect(getByText("Save")).toBeDisabled());
});

it('handles a missing config setting', async () => {
  const mockDoesntHaveItem = jest.fn(k => false);
  const mockContextMissing = {
    store: {
      hasItem: mockDoesntHaveItem,
    },
  }
  const {queryByLabelText} = render(
    <BatchDialogSettings context={mockContextMissing} />,
  );
  const delayField = queryByLabelText(/default delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0));

  expect(mockDoesntHaveItem).toHaveBeenCalledWith("settings_global")
  expect(mockGetItem).not.toHaveBeenCalled();
});