function DepartmentFilter({ departments, value, onChange }) {
  if (departments.length === 0) return null

  return (
    <select
      className="dept-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by department"
    >
      <option value="all">All departments</option>
      {departments.map((dept) => (
        <option key={dept} value={dept}>{dept}</option>
      ))}
    </select>
  )
}

export default DepartmentFilter
