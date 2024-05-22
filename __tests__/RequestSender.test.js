import * as utils from '../utils';

const mockSendRequest = jest.fn();

const originalReadResponseFromFile = utils.readResponseFromFile
utils.readResponseFromFile = jest.fn()

beforeEach(() => {
  utils.readResponseFromFile.mockImplementation(originalReadResponseFromFile)
})

afterEach(() => {
  jest.clearAllMocks();
})

const mockContext = {
  network: {
    sendRequest: mockSendRequest,
  },
};

it('parses outputs', async () => {
  // Set up a mock response. We need to mock the actual response object,
  // and also the code that reads the response's body from disk (on Insomnia,
  // the response object only holds the filesystem path to the response body, plus resp. metadata)
  mockSendRequest.mockReturnValue({
    bytesRead: 42,
    contentType: "application/json; charset=utf-8",
    headers: [{name: "content-LENGTH", value: "123"}, {name: "X-Header", value: "X-Header value"}],
    statusCode: 418, //  I'm a teapot!
    elapsedTime: 999.999,
  })
  // this is the actual response body, we're intercepting code that reads data from disk
  jest.spyOn(utils, "readResponseFromFile").mockReturnValue('{"foo": "Bar", "baz": "quux"}')

  // CSV has two rows, first one will be changed
  let csvData = [{row: 1}, {row: 2}]; 
  const setCsvData = (cb) => {csvData = cb(csvData)};

  await utils.makeRequest(mockContext, /*request*/null, 
    /*i*/0, /*row*/csvData[0], 
    /*delay*/0,
    /*outputConfig*/[
      {name: "d", context: "body", jsonPath: "$.foo"},
      {name: "e", context: "headers", jsonPath: "CONTENT-length"},
      {name: "f", context: "statusCode", jsonPath: ""},
      {name: "g", context: "reqTime", jsonPath: ""},
    ],
    /*setSent*/() => {}, setCsvData
  )

  // Expected value: still two rows, second one must be untouched.
  // First row has some columns added, one for each output field passed
  // Values of output fields must be taken from the (mock) "response"
  expect(csvData).toEqual([{row: 1, d: "Bar", e: "123", f: "418", g: "999.999"}, {row: 2}])
});