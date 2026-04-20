import { useState } from 'react'
import { TaskSection } from './features/tasks/TaskSection'
import { InventorySection } from './features/inventory/InventorySection'

const tabs = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'inventory', label: 'Inventory' },
]

function App() {
  const [activeTab, setActiveTab] = useState('tasks')

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 pb-3 pt-4 backdrop-blur sm:px-6">
          <p className="text-sm font-medium text-indigo-600">Roommate Hub</p>
          <h1 className="text-xl font-bold">Shared chores and supplies</h1>
          <p className="mt-1 text-sm text-slate-600">
            Keep your place running smoothly.
          </p>
          <nav className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          {activeTab === 'tasks' ? <TaskSection /> : <InventorySection />}
        </main>
      </div>
    </div>
  )
}

export default App
