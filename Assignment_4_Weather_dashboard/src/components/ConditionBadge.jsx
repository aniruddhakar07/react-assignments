import { conditionGroup, isNightCode } from '../utils/conditionGroup'

export default function ConditionBadge({ description, icon }) {
  if (!description) return null
  const group = conditionGroup(icon)
  // Clear skies at night should read as "night", not "sunny" — the sun
  // color badge next to a moon icon looks mismatched.
  const tone = group === 'clear' && isNightCode(icon) ? 'clear-night' : group
  return <span className={`condition-badge condition-${tone}`}>{description}</span>
}
