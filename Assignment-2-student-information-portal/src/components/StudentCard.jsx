import { useState } from 'react'
import { overallCgpa, isRollNumberTaken, isValidRollNumber, ROLL_NUMBER_LENGTH } from '../utils.js'

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function SemesterBox({ index, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')

  const commit = () => {
    const num = Number(draft)
    if (draft !== '' && !Number.isNaN(num) && num >= 0 && num <= 10) {
      onSave(index, num)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        className="sem-box sem-box-input"
        type="number"
        step="0.01"
        min="0"
        max="10"
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
    )
  }

  return (
    <button
      type="button"
      className={`sem-box ${value !== null ? 'filled' : 'empty'}`}
      onClick={() => { setDraft(value ?? ''); setEditing(true) }}
      title={value !== null ? `Semester ${index + 1}: ${value}` : `Add Semester ${index + 1} result`}
    >
      <span className="sem-num">S{index + 1}</span>
      <span className="sem-val">{value !== null ? value.toFixed(1) : '–'}</span>
    </button>
  )
}

function StudentCard({
  name,
  rollNumber,
  department,
  semesters,
  photo,
  onDelete,
  onUpdateSemester,
  onUpdateDetails,
  existingStudents,
}) {
  const cgpa = overallCgpa(semesters)
  const [editingDetails, setEditingDetails] = useState(false)
  const [draft, setDraft] = useState({ name, rollNumber, department })
  const [detailsError, setDetailsError] = useState('')

  const startEdit = () => {
    setDraft({ name, rollNumber, department })
    setDetailsError('')
    setEditingDetails(true)
  }

  const cancelEdit = () => {
    setEditingDetails(false)
    setDetailsError('')
  }

  const saveEdit = () => {
    if (!draft.name.trim() || !draft.rollNumber.trim() || !draft.department.trim()) {
      setDetailsError('None of these fields can be empty.')
      return
    }
    if (!isValidRollNumber(draft.rollNumber)) {
      setDetailsError(`Roll number must be exactly ${ROLL_NUMBER_LENGTH} digits.`)
      return
    }
    if (isRollNumberTaken(existingStudents, draft.rollNumber, rollNumber)) {
      setDetailsError(`Roll number "${draft.rollNumber.trim()}" is already in use.`)
      return
    }
    onUpdateDetails({
      name: draft.name.trim(),
      rollNumber: draft.rollNumber.trim(),
      department: draft.department.trim(),
    })
    setEditingDetails(false)
    setDetailsError('')
  }

  const handleDeleteClick = () => {
    if (window.confirm(`Remove ${name}'s record? This cannot be undone.`)) {
      onDelete()
    }
  }

  return (
    <article className="student-card">
      <div className="card-actions">
        {!editingDetails && (
          <button className="edit-btn" onClick={startEdit} aria-label={`Edit ${name}`}>
            ✎
          </button>
        )}
        <button className="delete-btn" onClick={handleDeleteClick} aria-label={`Remove ${name}`}>
          ×
        </button>
      </div>

      {editingDetails ? (
        <div className="edit-details-form">
          <div className="field">
            <label>Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Roll Number</label>
            <input
              value={draft.rollNumber}
              onChange={(e) => setDraft((d) => ({ ...d, rollNumber: e.target.value }))}
              inputMode="numeric"
              maxLength={ROLL_NUMBER_LENGTH}
            />
          </div>
          <div className="field">
            <label>Department</label>
            <input
              value={draft.department}
              onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
            />
          </div>
          {detailsError && <div className="form-error">{detailsError}</div>}
          <div className="edit-details-actions">
            <button className="add-btn small" onClick={saveEdit}>Save</button>
            <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="card-top">
            <div className="avatar">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(name)
              )}
            </div>
            <div className="names">
              <h3>{name}</h3>
              <div className="roll">Roll No. {rollNumber}</div>
            </div>
          </div>

          <div className="card-fields">
            <div className="card-field">
              <span className="k">Department</span>
              <span className="v">{department}</span>
            </div>
          </div>
        </>
      )}

      <div className="cgpa-badge">
        <span className="label">Overall CGPA</span>
        <span className="score">{cgpa !== null ? cgpa.toFixed(2) : '—'}</span>
      </div>

      <div className="sem-grid">
        {semesters.map((value, index) => (
          <SemesterBox
            key={index}
            index={index}
            value={value}
            onSave={onUpdateSemester}
          />
        ))}
      </div>
    </article>
  )
}

export default StudentCard
