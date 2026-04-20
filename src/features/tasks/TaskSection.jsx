import { useMemo, useState } from 'react'
import { RoommatePicker } from '../roommates/RoommatePicker'

export function TaskSection({
  tasks,
  roommates,
  onAddRoommate,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const [form, setForm] = useState({ title: '', assigneeId: '', recurring: false })
  const [editingId, setEditingId] = useState(null)
  const roommateNameById = useMemo(
    () =>
      roommates.reduce((acc, roommate) => {
        acc[roommate.id] = roommate.name
        return acc
      }, {}),
    [roommates],
  )

  const openTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks])
  const doneTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks])

  function resetForm() {
    setForm({ title: '', assigneeId: '', recurring: false })
    setEditingId(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.assigneeId) return

    const payload = {
      title: form.title.trim(),
      assigneeId: form.assigneeId,
      recurring: form.recurring,
    }

    if (editingId) {
      onUpdateTask(editingId, (task) => ({ ...task, ...payload }))
      resetForm()
      return
    }

    onAddTask({
      id: crypto.randomUUID(),
      ...payload,
      completed: false,
      createdAt: Date.now(),
    })
    resetForm()
  }

  function startEditing(task) {
    const fallbackRoommate = roommates.find(
      (roommate) => roommate.name.toLowerCase() === (task.assignee ?? '').toLowerCase(),
    )

    setEditingId(task.id)
    setForm({
      title: task.title,
      assigneeId: task.assigneeId ?? fallbackRoommate?.id ?? '',
      recurring: task.recurring,
    })
  }

  return (
    <section className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          Open: {openTasks.length}
        </div>
        <div className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          Done: {doneTasks.length}
        </div>
        <div className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          Roommates: {roommates.length}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? 'Edit task' : 'Add a chore'}
        </h2>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <RoommatePicker
            label="Responsible roommate"
            value={form.assigneeId}
            onChange={(assigneeId) => setForm((prev) => ({ ...prev, assigneeId }))}
            roommates={roommates}
            onAddRoommate={onAddRoommate}
          />
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
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
              className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {editingId ? 'Save task' : 'Add task'}
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

      <TaskList
        title={`Open tasks (${openTasks.length})`}
        tasks={openTasks}
        roommateNameById={roommateNameById}
        emptyLabel="No open tasks right now."
        onToggle={(id) => onUpdateTask(id, (task) => ({ ...task, completed: true }))}
        onEdit={startEditing}
        onDelete={onDeleteTask}
      />

      <TaskList
        title={`Completed (${doneTasks.length})`}
        tasks={doneTasks}
        roommateNameById={roommateNameById}
        emptyLabel="Nothing completed yet."
        onToggle={(id) => onUpdateTask(id, (task) => ({ ...task, completed: false }))}
        onEdit={startEditing}
        onDelete={onDeleteTask}
      />
    </section>
  )
}

function TaskList({
  title,
  tasks,
  roommateNameById,
  emptyLabel,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 space-y-3">
        {tasks.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl bg-slate-50 p-3 transition hover:bg-slate-100"
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
                  {roommateNameById[task.assigneeId] ?? task.assignee ?? 'Unassigned'} •{' '}
                  {task.recurring ? 'Recurring' : 'One-time'}
                </p>
              </div>
              <div className="flex gap-3">
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
