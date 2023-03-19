export default function DelaySelector({value, onChange}) {
  return <label>
    Delay in seconds
    <input
      type="number"
      step="0.1"
      value={value}
      onChange={onChange}
    />
  </label>
}