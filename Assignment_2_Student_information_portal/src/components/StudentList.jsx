import StudentCard from './StudentCard.jsx'

function StudentList({ students, onDelete, onUpdateSemester, onUpdateDetails, allStudents }) {
  if (students.length === 0) {
    return <div className="empty-state">No student records yet — add one above to get started.</div>
  }

  return (
    <div className="student-grid">
      {students.map((student) => (
        <StudentCard
          key={student.rollNumber}
          name={student.name}
          rollNumber={student.rollNumber}
          department={student.department}
          semesters={student.semesters}
          photo={student.photo}
          existingStudents={allStudents}
          onDelete={() => onDelete(student.rollNumber)}
          onUpdateSemester={(index, value) => onUpdateSemester(student.rollNumber, index, value)}
          onUpdateDetails={(updates) => onUpdateDetails(student.rollNumber, updates)}
        />
      ))}
    </div>
  )
}

export default StudentList
