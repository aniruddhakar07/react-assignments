import React from 'react';
import { Search, LayoutGrid, List, RotateCcw } from 'lucide-react';

export const TaskFilterBar = ({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onReset
}) => {
  const isFiltered = searchQuery || priorityFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="filter-bar">
      <div className="filter-search-box">
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-controls">
        <div className="select-wrapper">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter by Status"
          >
            <option value="ALL">All Statuses</option>
            <option value="Raised">Raised</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            title="Filter by Priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            title="Filter by Category"
          >
            <option value="ALL">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort tasks"
          >
            <option value="NEWEST">Sort: Recently Raised</option>
            <option value="DUE_DATE">Sort: Due Date (Earliest)</option>
            <option value="PRIORITY">Sort: Priority (High to Low)</option>
          </select>
        </div>

        {isFiltered && (
          <button 
            onClick={onReset} 
            className="btn btn-secondary btn-sm"
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}

        <div className="view-toggle-btns">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
