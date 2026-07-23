import type {
  TaskPriority,
  TaskQuery,
  TaskSort,
  TaskStatus,
} from "../types/task.types";

interface TaskFiltersProps {
  query: TaskQuery;
  isLoading: boolean;
  onChange: (query: TaskQuery) => void;
  onRefresh: () => void;
}

export function TaskFilters({
  query,
  isLoading,
  onChange,
  onRefresh,
}: TaskFiltersProps): JSX.Element {
  function updateQuery(
    field: keyof TaskQuery,
    value: string,
  ): void {
    onChange({
      ...query,
      [field]: value || undefined,
    });
  }

  function clearFilters(): void {
    onChange({
      search: "",
      status: undefined,
      priority: undefined,
      sort: "newest",
    });
  }

  return (
    <div className="task-filters">
      <div className="task-search">
        <label htmlFor="task-search">
          Search
        </label>

        <input
          id="task-search"
          type="search"
          placeholder="Search by title..."
          value={query.search ?? ""}
          onChange={(event) => {
            updateQuery(
              "search",
              event.target.value,
            );
          }}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="status-filter">
          Status
        </label>

        <select
          id="status-filter"
          value={query.status ?? ""}
          onChange={(event) => {
            updateQuery(
              "status",
              event.target.value as
                | TaskStatus
                | "",
            );
          }}
        >
          <option value="">
            All statuses
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="IN_PROGRESS">
            In progress
          </option>

          <option value="COMPLETED">
            Completed
          </option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="priority-filter">
          Priority
        </label>

        <select
          id="priority-filter"
          value={query.priority ?? ""}
          onChange={(event) => {
            updateQuery(
              "priority",
              event.target.value as
                | TaskPriority
                | "",
            );
          }}
        >
          <option value="">
            All priorities
          </option>

          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="sort-filter">
          Sort
        </label>

        <select
          id="sort-filter"
          value={query.sort ?? "newest"}
          onChange={(event) => {
            updateQuery(
              "sort",
              event.target.value as TaskSort,
            );
          }}
        >
          <option value="newest">
            Newest first
          </option>

          <option value="oldest">
            Oldest first
          </option>

          <option value="dueDate">
            Due date
          </option>
        </select>
      </div>

      <div className="filter-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={clearFilters}
          disabled={isLoading}
        >
          Clear
        </button>

        <button
          className="refresh-button"
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : "Refresh"}
        </button>
      </div>
    </div>
  );
}
