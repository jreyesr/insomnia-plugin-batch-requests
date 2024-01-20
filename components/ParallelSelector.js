export default function ParallelSelector({value, onChange}) {
  return <label>
    Parallel requests
    <input
      type="number"
      step="1"
      min="1"
      value={value}
      onChange={onChange}
    />
  </label>
}