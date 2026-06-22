import { ref, onUnmounted, type Ref } from 'vue'
import { collection, onSnapshot, Query } from 'firebase/firestore'
import { db } from '@/firebase'

export function useCollection<T>(collectionOrQuery: string | Query) {
  const docs = ref([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref<string | null>(null)

  const q = typeof collectionOrQuery === 'string'
    ? collection(db, collectionOrQuery)
    : collectionOrQuery

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const results: T[] = []
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as unknown as T)
      })
      docs.value = results
      loading.value = false
    },
    (err) => {
      console.error('useCollection error:', err)
      error.value = err.message
      loading.value = false
    }
  )

  onUnmounted(() => {
    unsubscribe()
  })

  return { docs, loading, error }
}
