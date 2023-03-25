import {render, fireEvent, waitFor} from '@testing-library/react';

import BatchDialog from '../components/BatchDialog'


const mockAlert = jest.fn((title, text) => {});
const mockGetItem = jest.fn(k => JSON.stringify({defaultDelay: 0}));

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
  await waitFor(() => expect(delayField).toHaveValue(0));

  expect(getByText(/run!/i)).toBeDefined();
});

