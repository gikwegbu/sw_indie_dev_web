import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { logAction } from './useAuditLog'

/**
 * Soft deletes a document by copying it to the /bin collection,
 * deleting the original, and logging the action to the audit logs.
 */
export async function softDeleteDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    throw new Error(`Document ${docId} in collection ${collectionName} does not exist.`)
  }

  const docData = docSnap.data()
  const deletedBy = auth.currentUser?.email || 'Anonymous Admin'
  const deletedAt = new Date()
  const purgeAfter = new Date()
  purgeAfter.setDate(deletedAt.getDate() + 30) // deletedAt + 30 days

  // Copy to /bin
  const binDocRef = doc(db, 'bin', `${collectionName}_${docId}`)
  await setDoc(binDocRef, {
    originalCollection: collectionName,
    data: docData,
    deletedBy,
    deletedAt: deletedAt.toISOString(),
    purgeAfter: purgeAfter.toISOString()
    // TODO: A Cloud Function should be implemented to auto-purge this document after 30 days.
  })

  // Delete the original document
  await deleteDoc(docRef)

  // Log audit action
  await logAction({
    action: 'delete',
    collection: collectionName,
    docId,
    performedBy: auth.currentUser?.uid || 'unknown',
    performedByEmail: auth.currentUser?.email || 'unknown',
    detail: `Soft-deleted document from collection ${collectionName}`
  })
}
