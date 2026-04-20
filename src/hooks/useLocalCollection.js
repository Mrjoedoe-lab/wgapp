import { useCallback, useEffect, useState } from 'react'
import { readCollection, writeCollection } from '../lib/storage'

export function useLocalCollection(key) {
  const [items, setItems] = useState(() => readCollection(key))

  useEffect(() => {
    writeCollection(key, items)
  }, [items, key])

  const addItem = useCallback((item) => {
    setItems((prev) => [item, ...prev])
  }, [])

  const updateItem = useCallback((id, updater) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        return typeof updater === 'function' ? updater(item) : updater
      }),
    )
  }, [])

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { items, setItems, addItem, updateItem, deleteItem }
}
