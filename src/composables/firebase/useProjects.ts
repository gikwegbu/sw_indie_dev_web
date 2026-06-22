import { ref, watch, type Ref } from 'vue'
import { collection, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Project } from '@/types'
import { useCollection } from './useCollection'

export function useProjects() {
  return useCollection<Project>('projects')
}

export function useFeaturedProject() {
  const colRef = collection(db, 'projects')
  const q = query(
    colRef,
    where('featured', '==', true),
    orderBy('featuredOrder', 'asc'),
    limit(1)
  )

  const { docs, loading, error } = useCollection<Project>(q)
  const project = ref<Project | null>(null) as Ref<Project | null>

  watch(docs, (newDocs) => {
    if (newDocs && newDocs.length > 0) {
      project.value = newDocs[0]
    } else {
      project.value = null
    }
  }, { immediate: true })

  return { doc: project, loading, error }
}
