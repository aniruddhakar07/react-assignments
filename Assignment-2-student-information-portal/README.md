# Student Information Management using Props — Assignment 2

React + Vite. Student data lives in `App.jsx` (as real state, `useState`) and flows down to
every other component purely through props. No hardcoded seed data — the list starts empty and
you add records through the form. Data persists in the browser's `localStorage`, so refreshing
the page doesn't wipe your records.

## Data model

Each student now tracks **all 8 semesters**, not a single CGPA:

```js
{
  rollNumber: '231001102238',
  name: 'Riya Sharma',
  department: 'Computer Applications',
  semesters: [8.5, null, null, null, null, null, null, null], // one slot per semester
  photo: null,
}
```

"Overall CGPA" (shown on each card and used for sorting) is the average of whichever semesters
have a value — see `overallCgpa()` in `src/utils.js`.

## Components

1. **`App`** — holds the `students` state, sort-order state, and search-term state; owns
   `handleAdd`, `handleDelete`, `handleUpdateSemester`, `handleClearAll`; loads from and saves
   to `localStorage`; computes the filtered + sorted list and passes it down as props.
2. **`Header`** — static masthead, no props needed.
3. **`AddStudentForm`** — controlled form; adds a student with one semester's result filled in.
   Roll numbers follow a numeric format, e.g. `231001102238`.
4. **`SearchBar`** — controlled input; receives `value` and `onChange` as props, filters live as
   you type.
5. **`StudentList`** — receives the `students` array, `onDelete`, and `onUpdateSemester` as
   props, maps over the array, and passes each student's fields down to `StudentCard`.
6. **`StudentCard`** — receives a student's fields plus `onDelete` and `onUpdateSemester` as
   props. Shows overall CGPA and an 8-box semester grid — click any box to fill in or edit that
   semester's result inline. Also supports inline editing of name/roll number/department.
7. **`StudentTable`** — the dense alternative to `StudentList`, one row per student. Shows name,
   roll number, department, "semesters filled" count, and overall CGPA, with the same edit/delete
   actions as the card view (minus per-semester editing — switch to Cards for that).
8. **`Footer`** — static footer.

## Cards vs. Table view

A "Cards / Table" toggle sits in the toolbar. Cards are nicer for a handful of students and are
the only place you can edit individual semester scores. Table is a compact, ledger-style view —
much easier to scan through when you have dozens or hundreds of records, since each student is
one row instead of a whole card.

## Persistence

Every change to the student list is written to `localStorage` under the key `sip-students-v1`.
On load, `App` reads that key back in. This is a fine solution for a course assignment or a
single-user tool, but it only lives in one browser on one device — for a real multi-user system
(1000+ students, accessed by multiple staff) you'd eventually want a real backend + database
instead, since `localStorage` is per-browser and has a small storage limit (a few MB).

## Searching & filtering

Type into the search box to filter by name or roll number (case-insensitive, partial match).
A department dropdown next to it narrows the list further — it's built automatically from
whichever departments are actually present in your data, and only appears once you have at
least one student. Search, department filter, and sort all combine in `App`.

## Adding / editing / removing students

- **Add**: fill in Name, Roll Number, Department, pick a Semester, and enter that semester's
  CGPA (0–10), then click **+ Add Student**. Roll numbers must be exactly 12 digits (e.g.
  `231001102238`); adding a duplicate roll number is also blocked, both with inline errors.
- **Edit a semester**: click any of the 8 boxes on a student's card, type a CGPA, press Enter
  (or click away).
- **Edit name / roll number / department**: click the pencil (✎) icon on a card to edit those
  fields inline. Changing the roll number to one that's already taken (by a different student)
  is blocked the same way.
- **Remove a student**: click the **×** in the top-right corner of their card — a confirmation
  prompt appears first so a misclick can't silently delete a record.
- **Clear everything**: the "Clear all" button in the toolbar (appears once you have at least
  one student), also with a confirmation prompt.

## Sorting by CGPA

The "Sort by CGPA" button in the toolbar cycles through: default order → highest first →
lowest first → highest first... Students with no semester data yet always sort to the bottom.
The sort itself happens once in `App` (via `useMemo`); children never sort anything themselves.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. **Important:** keep `index.html` in the project root (next to
`package.json`) — Vite won't find it if it's moved into `public/`.
