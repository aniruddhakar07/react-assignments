import { summarize } from '../utils/summary'

export default function SummaryLine({ weather, units }) {
  return <p className="summary-line">{summarize(weather, units)}</p>
}
