import { useMemo, useState } from 'react'
import { RoommatePicker } from '../roommates/RoommatePicker'

export function InventorySection({
  inventoryItems,
  roommates,
  onAddRoommate,
  onAddInventoryItem,
  onUpdateInventoryItem,
  onDeleteInventoryItem,
}) {
  const [form, setForm] = useState({ name: '', quantity: 0, notes: '', requestedById: '' })
  const [editingId, setEditingId] = useState(null)
  const roommateNameById = useMemo(
    () =>
      roommates.reduce((acc, roommate) => {
        acc[roommate.id] = roommate.name
        return acc
      }, {}),
    [roommates],
  )

  const neededItems = useMemo(
    () => inventoryItems.filter((item) => item.needed),
    [inventoryItems],
  )
  const stockedItems = useMemo(
    () => inventoryItems.filter((item) => !item.needed),
    [inventoryItems],
  )

  function resetForm() {
    setForm({ name: '', quantity: 0, notes: '', requestedById: '' })
    setEditingId(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return

    const quantity = Number(form.quantity) || 0
    const payload = {
      name: form.name.trim(),
      quantity,
      notes: form.notes.trim(),
      requestedById: form.requestedById,
      needed: quantity <= 0,
    }

    if (editingId) {
      onUpdateInventoryItem(editingId, (item) => ({ ...item, ...payload }))
      resetForm()
      return
    }

    onAddInventoryItem({
      id: crypto.randomUUID(),
      ...payload,
      createdAt: Date.now(),
    })
    resetForm()
  }

  function startEditing(item) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      quantity: item.quantity,
      notes: item.notes,
      requestedById: item.requestedById ?? '',
    })
  }

  function toggleNeeded(item) {
    onUpdateInventoryItem(item.id, { ...item, needed: !item.needed })
  }

  return (
    <section className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          Need to buy: {neededItems.length}
        </div>
        <div className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          In stock: {stockedItems.length}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? 'Edit item' : 'Add inventory item'}
        </h2>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Item name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            type="number"
            min="0"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))
            }
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Optional notes"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
          <RoommatePicker
            label="Requested by"
            value={form.requestedById}
            onChange={(requestedById) => setForm((prev) => ({ ...prev, requestedById }))}
            roommates={roommates}
            onAddRoommate={onAddRoommate}
            placeholder="Optional"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {editingId ? 'Save item' : 'Add item'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <InventoryList
        title={`Need to buy (${neededItems.length})`}
        items={neededItems}
        roommateNameById={roommateNameById}
        emptyLabel="Shopping list is clear."
        onToggleNeeded={toggleNeeded}
        onEdit={startEditing}
        onDelete={onDeleteInventoryItem}
      />

      <InventoryList
        title={`In stock (${stockedItems.length})`}
        items={stockedItems}
        roommateNameById={roommateNameById}
        emptyLabel="No stocked items yet."
        onToggleNeeded={toggleNeeded}
        onEdit={startEditing}
        onDelete={onDeleteInventoryItem}
      />
    </section>
  )
}

function InventoryList({
  title,
  items,
  roommateNameById,
  emptyLabel,
  onToggleNeeded,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 space-y-3">
        {items.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl bg-slate-50 p-3 transition hover:bg-slate-100"
          >
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={item.needed}
                onChange={() => onToggleNeeded(item)}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  Qty: {item.quantity}
                  {item.notes ? ` • ${item.notes}` : ''}
                  {item.requestedById
                    ? ` • Requested by ${roommateNameById[item.requestedById] ?? 'Unknown'}`
                    : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="text-xs font-semibold text-indigo-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-xs font-semibold text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
