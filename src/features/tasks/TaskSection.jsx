import { useMemo, useState } from 'react'
import { useLocalCollection } from '../../hooks/useLocalCollection'

export function TaskSection() {
  const { items: tasks, addItem, updateItem, deleteItem } = useLocalCollection('tasks')
  const [form, setForm] = useState({ title: '', assignee: '', recurring: false })
  const [editingId, setEditingId] = useState(null)

  const openTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks])
  const doneTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks])

  function resetForm() {
    setForm({ title: '', assignee: '', recurring: false })
    setEditingId(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.assignee.trim()) return

    const payload = {
      title: form.title.trim(),
      assignee: form.assignee.trim(),
      recurring: form.recurring,
    }

    if (editingId) {
      updateItem(editingId, (task) => ({ ...task, ...payload }))
      resetForm()
      return
    }

    addItem({
      id: crypto.randomUUID(),
      ...payload,
      completed: false,
      createdAt: Date.now(),
    })
    resetForm()
  }

  function startEditing(task) {
    setEditingId(task.id)
    setForm({
      title: task.title,
      assignee: task.assignee,
      recurring: task.recurring,
    })
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? 'Edit task' : 'Add a chore'}
        </h2>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Responsible roommate"
            value={form.assignee}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, assignee: event.target.value }))
            }
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.recurring}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, recurring: event.target.checked }))
              }
            />
            Recurring task
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {editingId ? 'Save task' : 'Add task'}
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

      <TaskList
        title={`Open tasks (${openTasks.length})`}
        tasks={openTasks}
        emptyLabel="No open tasks right now."
        onToggle={(id) => updateItem(id, (task) => ({ ...task, completed: true }))}
        onEdit={startEditing}
        onDelete={deleteItem}
      />

      <TaskList
        title={`Completed (${doneTasks.length})`}
        tasks={doneTasks}
        emptyLabel="Nothing completed yet."
        onToggle={(id) => updateItem(id, (task) => ({ ...task, completed: false }))}
        onEdit={startEditing}
        onDelete={deleteItem}
      />
    </section>
  )
}

function TaskList({ title, tasks, emptyLabel, onToggle, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 space-y-2">
        {tasks.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-xl border border-slate-200 p-3 transition hover:border-slate-300"
          >
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500">
                  {task.assignee} • {task.recurring ? 'Recurring' : 'One-time'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="text-xs font-semibold text-indigo-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
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
