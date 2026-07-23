interface StatCardProps {
  label: string;
  value: number;
  variant:
    | "total"
    | "pending"
    | "progress"
    | "completed"
    | "overdue";
}

export function StatCard({
  label,
  value,
  variant,
}: StatCardProps): JSX.Element {
  return (
    <article
      className={`stat-card stat-card--${variant}`}
    >
      <p className="stat-card__label">
        {label}
      </p>

      <p className="stat-card__value">
        {value}
      </p>
    </article>
  );
}
