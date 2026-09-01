import { useState } from 'react'
import { overallCgpa, isRollNumberTaken, isValidRollNumber, ROLL_NUMBER_LENGTH, TOTAL_SEMESTERS } from '../utils.js'

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function StudentTableRow({ student, existingStudents, onDelete, onUpdateDetails }) {
  const { name, rollNumber, department, semesters } = student
  const cgpa = overallCgpa(semesters)
  const filledCount = semesters.filter((v) => v !== null && v !== undefined).length

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name, rollNumber, department })
  const [error, setError] = useState('')

  const startEdit = () => {
    setDraft({ name, rollNumber, department })
    setError('')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setError('')
  }

  const saveEdit = () => {
    if (!draft.name.trim() || !draft.rollNumber.trim() || !draft.department.trim()) {
      setError('Fields cannot be empty.')
      return
    }
    if (!isValidRollNumber(draft.rollNumber)) {
      setError(`Roll number must be exactly ${ROLL_NUMBER_LENGTH} digits.`)
      return
    }
    if (isRollNumberTaken(existingStudents, draft.rollNumber, rollNumber)) {
      setError('Roll number already in use.')
      return
    }
    onUpdateDetails({
      name: draft.name.trim(),
      rollNumber: draft.rollNumber.trim(),
      department: draft.department.trim(),
    })
    setEditing(false)
    setError('')
  }

  const handleDeleteClick = () => {
    if (window.confirm(`Remove ${name}'s record? This cannot be undone.`)) {
      onDelete()
    }
  }

  if (editing) {
    return (
      <tr className="editing-row">
        <td colSpan={6}>
          <div className="row-edit-form">
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Name"
            />
            <input
              value={draft.rollNumber}
              onChange={(e) => setDraft((d) => ({ ...d, rollNumber: e.target.value }))}
              placeholder="Roll Number"
              inputMode="numeric"
              maxLength={ROLL_NUMBER_LENGTH}
            />
            <input
              value={draft.department}
              onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
              placeholder="Department"
            />
            <div className="row-edit-actions">
              <button className="add-btn small" onClick={saveEdit}>Save</button>
              <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
            </div>
            {error && <span className="form-error">{error}</span>}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td className="cell-student">
        <span className="mini-avatar">{getInitials(name)}</span>
        <span>{name}</span>
      </td>
      <td className="cell-mono">{rollNumber}</td>
      <td>{department}</td>
      <td className="cell-mono">{filledCount}/{TOTAL_SEMESTERS}</td>
      <td className="cell-cgpa">{cgpa !== null ? cgpa.toFixed(2) : '—'}</td>
      <td className="cell-actions">
        <button className="edit-btn" onClick={startEdit} aria-label={`Edit ${name}`}>✎</button>
        <button className="delete-btn" onClick={handleDeleteClick} aria-label={`Remove ${name}`}>×</button>
      </td>
    </tr>
  )
}

function StudentTable({ students, allStudents, onDelete, onUpdateDetails }) {
  if (students.length === 0) {
    return <div className="empty-state">No student records yet — add one above to get started.</div>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Department</th>
            <th>Semesters</th>
            <th>CGPA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentTableRow
              key={student.rollNumber}
              student={student}
              existingStudents={allStudents}
              onDelete={() => onDelete(student.rollNumber)}
              onUpdateDetails={(updates) => onUpdateDetails(student.rollNumber, updates)}
            />
          ))}
        </tbody>
      </table>
      <div className="table-note">
        Tip: switch to Cards view to add or edit individual semester CGPAs.
      </div>
    </div>
  )
}

export default StudentTable
