import { useState } from 'react'

export function RoommatePicker({
  label,
  value,
  onChange,
  roommates,
  onAddRoommate,
  placeholder = 'Choose a roommate',
}) {
  const [newRoommateName, setNewRoommateName] = useState('')

  function handleAddRoommate() {
    if (!newRoommateName.trim()) return
    const created = onAddRoommate(newRoommateName.trim())
    if (created) {
      onChange(created.id)
      setNewRoommateName('')
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">{placeholder}</option>
        {roommates.map((roommate) => (
          <option key={roommate.id} value={roommate.id}>
            {roommate.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Add new roommate"
          value={newRoommateName}
          onChange={(event) => setNewRoommateName(event.target.value)}
        />
        <button
          type="button"
          onClick={handleAddRoommate}
          className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Add
        </button>
      </div>
    </div>
  )
}
