function ResultGroup({ title, count, emptyLabel, children }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title} ({count})
      </h3>
      {count === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <div className="mt-2 space-y-2">{children}</div>
      )}
    </div>
  )
}

function ResultItem({ title, subtitle, onOpen, label }) {
  return (
    <article className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="ml-2 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-white"
      >
        {label}
      </button>
    </article>
  )
}

export function SearchResults({
  searchTerm,
  taskMatches,
  inventoryMatches,
  roommateMatches,
  roommateNameById,
  onOpenTab,
}) {
  const query = searchTerm.trim()

  return (
    <section className="space-y-3 rounded-3xl border border-indigo-200 bg-indigo-50/70 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Global results
        </p>
        <p className="text-sm text-indigo-700">
          Searching all sections for "{query}".
        </p>
      </div>

      <ResultGroup
        title="Tasks"
        count={taskMatches.length}
        emptyLabel={`No task matches for "${query}".`}
      >
        {taskMatches.slice(0, 3).map((task) => (
          <ResultItem
            key={task.id}
            title={task.title}
            subtitle={`${roommateNameById[task.assigneeId] ?? 'Unassigned'} • ${
              task.recurring ? 'Recurring' : 'One-time'
            }`}
            onOpen={() => onOpenTab('tasks')}
            label="Open"
          />
        ))}
      </ResultGroup>

      <ResultGroup
        title="Inventory"
        count={inventoryMatches.length}
        emptyLabel={`No inventory matches for "${query}".`}
      >
        {inventoryMatches.slice(0, 3).map((item) => (
          <ResultItem
            key={item.id}
            title={item.name}
            subtitle={`Qty: ${item.quantity}${item.notes ? ` • ${item.notes}` : ''}`}
            onOpen={() => onOpenTab('inventory')}
            label="Open"
          />
        ))}
      </ResultGroup>

      <ResultGroup
        title="Roommates"
        count={roommateMatches.length}
        emptyLabel={`No roommate matches for "${query}".`}
      >
        {roommateMatches.slice(0, 3).map((roommate) => (
          <ResultItem
            key={roommate.id}
            title={roommate.name}
            subtitle="Saved roommate"
            onOpen={() => onOpenTab('roommates')}
            label="Open"
          />
        ))}
      </ResultGroup>
    </section>
  )
}
