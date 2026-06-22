import { collection, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UpcomingEvent } from '@/types'
import { useCollection } from './useCollection'

export function useUpcomingEvents() {
  const colRef = collection(db, 'upcomingEvents')
  const nowIso = new Date().toISOString()
  const q = query(
    colRef,
    where('date', '>=', nowIso),
    orderBy('date', 'asc')
  )
  return useCollection<UpcomingEvent>(q)
}
