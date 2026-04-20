const STORAGE_KEYS = {
  tasks: 'roommate-app.tasks.v1',
  inventory: 'roommate-app.inventory.v1',
  roommates: 'roommate-app.roommates.v1',
}

const seedData = {
  tasks: [
    {
      id: crypto.randomUUID(),
      title: 'Take out trash',
      assignee: 'Alex',
      recurring: true,
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Clean kitchen counters',
      assignee: 'Sam',
      recurring: false,
      completed: false,
      createdAt: Date.now(),
    },
  ],
  inventory: [
    {
      id: crypto.randomUUID(),
      name: 'Toilet paper',
      quantity: 0,
      needed: true,
      notes: 'Buy pack of 12',
      createdAt: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Dish soap',
      quantity: 1,
      needed: false,
      notes: '',
      createdAt: Date.now(),
    },
  ],
  roommates: [
    {
      id: crypto.randomUUID(),
      name: 'Alex',
      createdAt: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Sam',
      createdAt: Date.now(),
    },
  ],
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback
  } catch {
    return fallback
  }
}

export function readCollection(key) {
  const storageKey = STORAGE_KEYS[key]
  const fallback = seedData[key] ?? []
  const saved = localStorage.getItem(storageKey)

  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(fallback))
    return fallback
  }

  return safeParse(saved, fallback)
}

export function writeCollection(key, data) {
  const storageKey = STORAGE_KEYS[key]
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export { STORAGE_KEYS }
