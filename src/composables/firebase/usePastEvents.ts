import { collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import type { PastEvent, EventTalk } from '@/types'
import { useCollection } from './useCollection'

export function usePastEvents() {
  const colRef = collection(db, 'pastEvents')
  const q = query(colRef, orderBy('date', 'desc'))
  return useCollection<PastEvent>(q)
}

export function usePastEventTalks(eventId: string) {
  const subColRef = collection(db, 'pastEvents', eventId, 'talks')
  return useCollection<EventTalk>(subColRef)
}
