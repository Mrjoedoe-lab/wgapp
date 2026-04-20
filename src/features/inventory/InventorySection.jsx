import { useMemo, useState } from 'react'
import { useLocalCollection } from '../../hooks/useLocalCollection'

export function InventorySection() {
  const { items, addItem, updateItem, deleteItem } = useLocalCollection('inventory')
  const [form, setForm] = useState({ name: '', quantity: 0, notes: '' })
  const [editingId, setEditingId] = useState(null)

  const neededItems = useMemo(() => items.filter((item) => item.needed), [items])
  const stockedItems = useMemo(() => items.filter((item) => !item.needed), [items])

  function resetForm() {
    setForm({ name: '', quantity: 0, notes: '' })
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
      needed: quantity <= 0,
    }

    if (editingId) {
      updateItem(editingId, (item) => ({ ...item, ...payload }))
      resetForm()
      return
    }

    addItem({
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
    })
  }

  function toggleNeeded(item) {
    updateItem(item.id, { ...item, needed: !item.needed })
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? 'Edit item' : 'Add inventory item'}
        </h2>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Item name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))
            }
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Optional notes"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {editingId ? 'Save item' : 'Add item'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
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
        emptyLabel="Shopping list is clear."
        onToggleNeeded={toggleNeeded}
        onEdit={startEditing}
        onDelete={deleteItem}
      />

      <InventoryList
        title={`In stock (${stockedItems.length})`}
        items={stockedItems}
        emptyLabel="No stocked items yet."
        onToggleNeeded={toggleNeeded}
        onEdit={startEditing}
        onDelete={deleteItem}
      />
    </section>
  )
}

function InventoryList({ title, items, emptyLabel, onToggleNeeded, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 p-3 transition hover:border-slate-300"
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
