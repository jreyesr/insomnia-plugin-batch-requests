import {render, waitFor} from '@testing-library/react';

import BatchDialog from '../components/BatchDialog'


const mockAlert = jest.fn((title, text) => {});
const mockGetItem = jest.fn(k => JSON.stringify({defaultDelay: 0.1}));

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

it('renders with default delay', async () => {
  const {queryByLabelText, getByText} = render(
    <BatchDialog context={mockContext}/>,
  );

  const delayField = queryByLabelText(/delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.1));

  expect(getByText(/run!/i)).toBeDefined();
});

it('does not enable the buttons on load', async () => {
  const {queryByLabelText, getByText} = render(
    <BatchDialog context={mockContext}/>,
  );

  const delayField = queryByLabelText(/delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.1));

  expect(getByText(/run!/i)).toBeDisabled();
  expect(getByText(/save/i)).toBeDisabled();
});

it('prompts the user to choose a file', async () => {
  const {queryByLabelText, getByText} = render(
    <BatchDialog context={mockContext}/>,
  );

  const delayField = queryByLabelText(/delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.1));

  expect(getByText(/choose a file above to preview it!/i)).toBeDefined();
});
