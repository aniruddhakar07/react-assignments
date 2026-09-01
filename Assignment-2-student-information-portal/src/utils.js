export const TOTAL_SEMESTERS = 8

// semesters is an array of length TOTAL_SEMESTERS, each entry either a number (0-10) or null.
export function overallCgpa(semesters) {
  const filled = semesters.filter((v) => v !== null && v !== undefined)
  if (filled.length === 0) return null
  const sum = filled.reduce((acc, v) => acc + v, 0)
  return sum / filled.length
}

export function emptySemesters() {
  return Array(TOTAL_SEMESTERS).fill(null)
}

// Case-sensitive exact match on the trimmed roll number, optionally excluding one
// roll number (used when editing a student's own record).
export function isRollNumberTaken(students, rollNumber, excludeRollNumber = null) {
  const target = rollNumber.trim()
  return students.some((s) => s.rollNumber === target && s.rollNumber !== excludeRollNumber)
}

// Roll numbers must be exactly 12 digits, e.g. 231001102238.
export const ROLL_NUMBER_LENGTH = 12
const ROLL_NUMBER_PATTERN = /^\d{12}$/

export function isValidRollNumber(rollNumber) {
  return ROLL_NUMBER_PATTERN.test(rollNumber.trim())
}
