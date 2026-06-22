import { collection, addDoc, serverTimestamp, query, orderBy, limit as limitConstraint } from 'firebase/firestore'
import { db } from '@/firebase'
import type { AuditEntry } from '@/types'
import { useCollection } from './useCollection'

export async function logAction(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
  const colRef = collection(db, 'adminAuditLog')
  await addDoc(colRef, {
    ...entry,
    timestamp: serverTimestamp()
  })
}

export function useAuditEntries(limitNumber = 50) {
  const colRef = collection(db, 'adminAuditLog')
  const q = query(
    colRef,
    orderBy('timestamp', 'desc'),
    limitConstraint(limitNumber)
  )
  return useCollection<AuditEntry>(q)
}
