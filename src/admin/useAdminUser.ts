import { ref, type Ref } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export function useAdminUser() {
  const role = ref<'admin' | 'superAdmin' | null>(null) as Ref<'admin' | 'superAdmin' | null>
  const loading = ref(true)
  let unsubscribe: (() => void) | null = null

  onAuthStateChanged(auth, (user) => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    if (user) {
      const docRef = doc(db, 'admins', user.uid)
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          role.value = docSnap.data().role || 'admin'
        } else {
          role.value = null
        }
        loading.value = false
      }, (err) => {
        console.error('Failed to listen to admin doc:', err)
        role.value = null
        loading.value = false
      })
    } else {
      role.value = null
      loading.value = false
    }
  })

  return { role, loading }
}
