import { ref, onUnmounted, type Ref } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

export function useDocument<T>(collectionName: string, docId: string) {
  const document = ref<T | null>(null) as Ref<T | null>
  const loading = ref(true)
  const error = ref<string | null>(null)

  const docRef = doc(db, collectionName, docId)

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        document.value = { id: snapshot.id, ...snapshot.data() } as unknown as T
      } else {
        document.value = null
      }
      loading.value = false
    },
    (err) => {
      console.error('useDocument error:', err)
      error.value = err.message
      loading.value = false
    }
  )

  onUnmounted(() => {
    unsubscribe()
  })

  return { doc: document, loading, error }
}
