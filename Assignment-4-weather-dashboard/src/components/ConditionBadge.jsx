import { conditionGroup } from '../utils/conditionGroup'

export default function ConditionBadge({ description, icon }) {
  if (!description) return null
  const group = conditionGroup(icon)
  return <span className={`condition-badge condition-${group}`}>{description}</span>
}
