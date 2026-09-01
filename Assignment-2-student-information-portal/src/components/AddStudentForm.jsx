import { useState } from 'react'
import { TOTAL_SEMESTERS, emptySemesters, isRollNumberTaken, isValidRollNumber, ROLL_NUMBER_LENGTH } from '../utils.js'

const EMPTY_FORM = {
  name: '',
  rollNumber: '',
  department: '',
  semester: '1',
  cgpa: '',
}

function AddStudentForm({ onAdd, existingStudents }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.rollNumber || !form.department || !form.cgpa) {
      setError('Please fill in every field.')
      return
    }

    if (!isValidRollNumber(form.rollNumber)) {
      setError(`Roll number must be exactly ${ROLL_NUMBER_LENGTH} digits (e.g. 231001102238).`)
      return
    }

    const cgpaNum = Number(form.cgpa)
    if (Number.isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      setError('CGPA must be a number between 0 and 10.')
      return
    }

    if (isRollNumberTaken(existingStudents, form.rollNumber)) {
      setError(`A student with roll number "${form.rollNumber.trim()}" already exists.`)
      return
    }

    const semesters = emptySemesters()
    semesters[Number(form.semester) - 1] = cgpaNum

    onAdd({
      name: form.name.trim(),
      rollNumber: form.rollNumber.trim(),
      department: form.department.trim(),
      semesters,
      photo: null,
    })

    setForm(EMPTY_FORM)
    setError('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
        </div>
        <div className="field">
          <label htmlFor="rollNumber">Roll Number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            placeholder="e.g. 231001102238"
            inputMode="numeric"
            maxLength={ROLL_NUMBER_LENGTH}
          />
        </div>
        <div className="field">
          <label htmlFor="department">Department</label>
          <input id="department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Applications" />
        </div>
        <div className="field">
          <label htmlFor="semester">Semester</label>
          <select id="semester" name="semester" value={form.semester} onChange={handleChange}>
            {Array.from({ length: TOTAL_SEMESTERS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>Semester {n}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cgpa">CGPA (this semester)</label>
          <input id="cgpa" name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="e.g. 8.5" type="number" step="0.01" min="0" max="10" />
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-footer">
        <button type="submit" className="add-btn">+ Add Student</button>
        <span className="form-hint">
          You can add results for the other {TOTAL_SEMESTERS - 1} semesters later, right on their card.
        </span>
      </div>
    </form>
  )
}

export default AddStudentForm
