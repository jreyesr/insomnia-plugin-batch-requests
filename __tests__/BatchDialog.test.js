import {render, within, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as utils from '../utils';
import BatchDialog from '../components/BatchDialog'


const mockAlert = jest.fn();
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockSendRequest = jest.fn();

const originalReadCsv = utils.readCsv;
const originalSelectFile = utils.selectFile;
utils.readCsv = jest.fn();
utils.selectFile = jest.fn();

beforeEach(() => {
  mockGetItem.mockReturnValue(JSON.stringify({defaultDelay: 0.1}));
  utils.readCsv.mockImplementation(originalReadCsv);
  utils.selectFile.mockImplementation(originalSelectFile);
})

afterEach(() => {
  jest.clearAllMocks();
})

const mockContext = {
  store: {
    hasItem: jest.fn(k => true),
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
  },
  app: {
    alert: mockAlert,
  },
  network: {
    sendRequest: mockSendRequest,
  }
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

it('reads a CSV file when clicking Load button', async () => {
  utils.selectFile.mockReturnValue({canceled: false, filePath: "test.csv.file"});
  utils.readCsv.mockReturnValue({
    headers: ["a", "b"], 
    results: [{a: "a1", b: "b1", c: "c1"}]
  });
  const user = userEvent.setup();
  const {queryByLabelText, getByText, getByTestId} = render(
    <BatchDialog context={mockContext}/>,
  );

  const delayField = queryByLabelText(/delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.1));
  await user.click(getByText("Choose File"));

  expect(utils.readCsv).toBeCalledWith("test.csv.file");
  expect(within(getByTestId("sampletable")).queryAllByText("a1")).toHaveLength(1);
  expect(within(getByTestId("sampletable")).queryAllByText("b1")).toHaveLength(1);
  expect(within(getByTestId("sampletable")).queryAllByText("c1")).toHaveLength(0);
});

it('does not read file when file selection canceled', async () => {
  utils.selectFile.mockReturnValue({canceled: true, filePath: "test.csv.file"});
  const user = userEvent.setup();
  const {queryByLabelText, getByText, getByTestId} = render(
    <BatchDialog context={mockContext}/>,
  );

  const delayField = queryByLabelText(/delay/i);
  // wait for onMount effects to run
  await waitFor(() => expect(delayField).toHaveValue(0.1));
  await user.click(getByText("Choose File"));

  expect(utils.readCsv).not.toBeCalled();
});

const prepareForSending = () => {
  utils.selectFile.mockReturnValue({canceled: false, filePath: "test.csv.file"});
  utils.readCsv.mockReturnValue({
    headers: ["a", "b"], 
    results: [{a: "a1", b: "b1", c: "c1"}, {a: "a2", b: "b2", c: "c2"}]
  });
  mockGetItem.mockReturnValue(JSON.stringify({defaultDelay: 0}));
}

it('sets and deletes storage across requests', async () => {
  const user = userEvent.setup();
  prepareForSending();
  const {getByText} = render(
    <BatchDialog context={mockContext} request={{_id: "test-req-id"}}/>,
  );

  await user.click(getByText("Choose File"));
  await user.click(getByText("Run!"));

  expect(mockSetItem).toBeCalledTimes(2); // once for every line in the CSV
  expect(mockSetItem).toHaveBeenNthCalledWith(1, 
    "test-req-id.batchExtraData", 
    '{"a":"a1","b":"b1","c":"c1"}')
  expect(mockRemoveItem).toHaveBeenLastCalledWith("test-req-id.batchExtraData");
});

it('actually makes network requests', async () => {
  const user = userEvent.setup();
  prepareForSending();
  const {getByText} = render(
    <BatchDialog context={mockContext} request={{_id: "test-req-id"}}/>,
  );

  await user.click(getByText("Choose File"));
  await user.click(getByText("Run!"));

  expect(mockSendRequest).toBeCalledTimes(2); // once for every line in the CSV
  expect(mockSendRequest).toHaveBeenLastCalledWith({_id: "test-req-id"})
});

it('processes response data', async () => {
  const user = userEvent.setup();
  prepareForSending();
  const {getByText} = render(
    <BatchDialog context={mockContext} request={{_id: "test-req-id"}}/>,
  );

  await user.click(getByText("Choose File"));
  await user.click(getByText("Run!"));

  expect(mockSendRequest).toBeCalledTimes(2); // once for every line in the CSV
  expect(mockSendRequest).toHaveBeenLastCalledWith({_id: "test-req-id"})
});
