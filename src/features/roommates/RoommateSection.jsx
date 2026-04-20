import { useState } from 'react'

export function RoommateSection({
  roommates,
  onAddRoommate,
  onDeleteRoommate,
  searchTerm,
}) {
  const [name, setName] = useState('')
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredRoommates = roommates.filter((roommate) =>
    roommate.name.toLowerCase().includes(normalizedSearch),
  )
  const totalRoommateCount = roommates.length

  function handleSubmit(event) {
    event.preventDefault()
    const created = onAddRoommate(name)
    if (created) {
      setName('')
    }
  }

  return (
    <section className="space-y-4">
      {normalizedSearch && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
          Showing {filteredRoommates.length} of {totalRoommateCount} roommates for "
          {searchTerm.trim()}".
        </div>
      )}
      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">Add roommate</h2>
        <form className="mt-3 flex gap-2" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Roommate name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Add
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Saved roommates ({filteredRoommates.length})
        </h3>
        <div className="mt-3 space-y-3">
          {filteredRoommates.length === 0 && (
            <p className="text-sm text-slate-500">
              {normalizedSearch
                ? `No roommates match "${searchTerm.trim()}".`
                : 'No roommates added yet.'}
            </p>
          )}
          {filteredRoommates.map((roommate) => (
            <article
              key={roommate.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
            >
              <p className="text-sm font-semibold text-slate-900">{roommate.name}</p>
              <button
                type="button"
                onClick={() => onDeleteRoommate(roommate.id)}
                className="text-xs font-semibold text-rose-600"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
