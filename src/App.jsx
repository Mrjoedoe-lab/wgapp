import { useState } from 'react'
import { TaskSection } from './features/tasks/TaskSection'
import { InventorySection } from './features/inventory/InventorySection'
import { RoommateSection } from './features/roommates/RoommateSection'
import { useLocalCollection } from './hooks/useLocalCollection'

const tabs = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'roommates', label: 'Roommates' },
]

function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const { items: roommates, addItem, deleteItem } = useLocalCollection('roommates')

  function addRoommate(name) {
    const cleanedName = name.trim()
    if (!cleanedName) return null

    const existing = roommates.find(
      (roommate) => roommate.name.toLowerCase() === cleanedName.toLowerCase(),
    )
    if (existing) return existing

    const roommate = {
      id: crypto.randomUUID(),
      name: cleanedName,
      createdAt: Date.now(),
    }
    addItem(roommate)
    return roommate
  }

  return (
    <div className="min-h-screen bg-slate-200/70 px-2 py-4 text-slate-900 sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-[#f4f5f7] shadow-[0_24px_80px_rgba(76,70,255,0.15)]">
        <header className="rounded-b-[1.75rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-4 pb-5 pt-4 text-white sm:px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/25 text-lg shadow-inner">
                👥
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">Roomie</p>
                <p className="text-sm text-indigo-100">Shared chores and inventory</p>
              </div>
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/40 bg-white/10 text-xl"
            >
              ⋮
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-white px-3 py-2 text-slate-500 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-base">🔎</span>
              <span>Search tasks, items or roommate</span>
            </div>
          </div>

          <nav className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/20 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-indigo-100 hover:bg-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-1 space-y-4 px-4 py-4 sm:px-5">
          {activeTab === 'tasks' && (
            <TaskSection roommates={roommates} onAddRoommate={addRoommate} />
          )}
          {activeTab === 'inventory' && (
            <InventorySection roommates={roommates} onAddRoommate={addRoommate} />
          )}
          {activeTab === 'roommates' && (
            <RoommateSection
              roommates={roommates}
              onAddRoommate={addRoommate}
              onDeleteRoommate={deleteItem}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
