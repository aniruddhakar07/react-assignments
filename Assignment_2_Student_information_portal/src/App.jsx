import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import AddStudentForm from './components/AddStudentForm.jsx'
import SearchBar from './components/SearchBar.jsx'
import DepartmentFilter from './components/DepartmentFilter.jsx'
import StudentList from './components/StudentList.jsx'
import StudentTable from './components/StudentTable.jsx'
import Footer from './components/Footer.jsx'
import { overallCgpa } from './utils.js'

const STORAGE_KEY = 'sip-students-v1'
const VIEW_MODE_KEY = 'sip-view-mode-v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadViewMode() {
  try {
    const raw = localStorage.getItem(VIEW_MODE_KEY)
    return raw === 'table' ? 'table' : 'cards'
  } catch {
    return 'cards'
  }
}

function App() {
  const [students, setStudents] = useState(loadFromStorage)
  const [sortOrder, setSortOrder] = useState('none') // 'none' | 'asc' | 'desc'
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [viewMode, setViewMode] = useState(loadViewMode) // 'cards' | 'table'

  // Persist to localStorage any time the student list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    } catch {
      // localStorage can fail (e.g. private browsing, quota) — fail silently,
      // the app still works for the current session.
    }
  }, [students])

  // Remember which view (Cards/Table) the user was last on.
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_KEY, viewMode)
    } catch {
      // ignore — non-critical
    }
  }, [viewMode])

  const handleAdd = (newStudent) => {
    setStudents((prev) => [...prev, newStudent])
  }

  const handleDelete = (rollNumber) => {
    setStudents((prev) => prev.filter((s) => s.rollNumber !== rollNumber))
  }

  const handleUpdateSemester = (rollNumber, semesterIndex, value) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.rollNumber !== rollNumber) return s
        const semesters = [...s.semesters]
        semesters[semesterIndex] = value
        return { ...s, semesters }
      })
    )
  }

  const handleUpdateDetails = (originalRollNumber, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNumber === originalRollNumber ? { ...s, ...updates } : s))
    )
  }

  const handleClearAll = () => {
    if (students.length === 0) return
    if (window.confirm('Remove all student records? This cannot be undone.')) {
      setStudents([])
    }
  }

  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean))
    return [...set].sort()
  }, [students])

  const displayedStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    let filtered = query
      ? students.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.rollNumber.toLowerCase().includes(query)
        )
      : students

    if (departmentFilter !== 'all') {
      filtered = filtered.filter((s) => s.department === departmentFilter)
    }

    if (sortOrder === 'none') return filtered

    return [...filtered].sort((a, b) => {
      const cgpaA = overallCgpa(a.semesters)
      const cgpaB = overallCgpa(b.semesters)
      // Students with no CGPA data yet always sort to the bottom.
      if (cgpaA === null && cgpaB === null) return 0
      if (cgpaA === null) return 1
      if (cgpaB === null) return -1
      return sortOrder === 'asc' ? cgpaA - cgpaB : cgpaB - cgpaA
    })
  }, [students, sortOrder, searchTerm, departmentFilter])

  const handleSortClick = () => {
    setSortOrder((prev) => {
      if (prev === 'none') return 'desc'
      if (prev === 'desc') return 'asc'
      return 'desc'
    })
  }

  const sortLabel =
    sortOrder === 'desc' ? 'Highest first' : sortOrder === 'asc' ? 'Lowest first' : 'Default order'
  const sortArrow = sortOrder === 'asc' ? '\u2191' : sortOrder === 'desc' ? '\u2193' : '\u2195'

  return (
    <>
      <Header />
      <main>
        <div className="wrap">
          <AddStudentForm onAdd={handleAdd} existingStudents={students} />

          <div className="toolbar">
            <span className="count">
              Showing <strong>{displayedStudents.length}</strong> of{' '}
              <strong>{students.length}</strong> student records
            </span>

            <div className="toolbar-controls">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />

              <DepartmentFilter
                departments={departments}
                value={departmentFilter}
                onChange={setDepartmentFilter}
              />

              <div className="view-toggle">
                <button
                  className={viewMode === 'cards' ? 'active' : ''}
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </button>
                <button
                  className={viewMode === 'table' ? 'active' : ''}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
              </div>

              <div className="sort-control">
                <span className="sort-label">Sort by CGPA</span>
                <button className="sort-btn" onClick={handleSortClick}>
                  {sortLabel} <span className="arrow">{sortArrow}</span>
                </button>
              </div>

              {students.length > 0 && (
                <button className="clear-btn" onClick={handleClearAll}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          {viewMode === 'cards' ? (
            <StudentList
              students={displayedStudents}
              allStudents={students}
              onDelete={handleDelete}
              onUpdateSemester={handleUpdateSemester}
              onUpdateDetails={handleUpdateDetails}
            />
          ) : (
            <StudentTable
              students={displayedStudents}
              allStudents={students}
              onDelete={handleDelete}
              onUpdateDetails={handleUpdateDetails}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
