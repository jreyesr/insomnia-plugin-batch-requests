import {render, fireEvent} from '@testing-library/react';

import SampleTable from '../components/SampleTable'

const sampleData = [
  { a: "a1", b: "b1", c: "c1" },
  { a: "a2", b: "b2", c: "c2" },
  { a: "a3", b: "b3", c: "c3" },
  { a: "a4", b: "b4", c: "c4" },
  { a: "a5", b: "b5", c: "c5" },
  { a: "a6", b: "b6", c: "c6" },
  { a: "a7", b: "b7", c: "c7" },
]

it('renders with first 5 data', () => {
  const {container} = render(
    <SampleTable columnNames={["a", "b"]} data={sampleData} />,
  );

  expect(container).toHaveTextContent("a1");
  expect(container).not.toHaveTextContent("a6");
});

it('can override the amount of data shown', () => {
  const {container} = render(
    <SampleTable columnNames={["a", "b"]} data={sampleData} numSamples={10} />,
  );

  expect(container).toHaveTextContent("a6");
});

it('only shows the passed columns', () => {
  const {container} = render(
    <SampleTable columnNames={["a", "b"]} data={sampleData}/>,
  );

  expect(container).toHaveTextContent("a1");
  expect(container).not.toHaveTextContent("c1");
});

it('handles missing data', () => {
  const {container} = render(
    <SampleTable columnNames={["a"]} data={[{}]}/>,
  );

  expect(container).toHaveTextContent("NULL");
});
