<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useCollection } from '@/composables/firebase/useCollection'
import { logAction } from '@/composables/firebase/useAuditLog'
import type { Project } from '@/types'

const { docs: projects, loading, error } = useCollection<Project>('projects')

const featuredProject = computed(() => projects.value.find(p => p.featured))

const selectedProjectId = ref('')

// Initialize selectedProjectId when data loads
watch(featuredProject, (newVal) => {
  if (newVal?.id) {
    selectedProjectId.value = newVal.id
  } else {
    selectedProjectId.value = ''
  }
}, { immediate: true })

const handleSelect = async () => {
  if (!selectedProjectId.value) return
  
  try {
    // 1. Set all other projects to featured = false
    const otherProjects = projects.value.filter(p => p.id !== selectedProjectId.value)
    for (const p of otherProjects) {
      if (p.id && p.featured) {
        await updateDoc(doc(db, 'projects', p.id), {
          featured: false,
          featuredOrder: 9999
        })
      }
    }
    
    // 2. Set the chosen project to featured = true
    const docRef = doc(db, 'projects', selectedProjectId.value)
    await updateDoc(docRef, {
      featured: true,
      featuredOrder: 1
    })

    const targetProject = projects.value.find(p => p.id === selectedProjectId.value)

    await logAction({
      action: 'update',
      collection: 'projects',
      docId: selectedProjectId.value,
      performedBy: auth.currentUser?.uid || 'unknown',
      performedByEmail: auth.currentUser?.email || 'unknown',
      detail: `Marked project ${targetProject?.name || ''} as featured`
    })

    alert('Featured project updated successfully!')
  } catch (err) {
    console.error('Failed to update featured project:', err)
  }
}
</script>

<template>
  <div class="p-8 flex flex-col gap-6 text-left max-w-2xl">
    <!-- Header -->
    <div class="border-b pb-4" style="border-color: var(--admin-border);">
      <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Featured Project</h1>
      <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Highlight one app at the top of the showcase showcase page.</p>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-10 w-full bg-border/20 rounded-lg" style="background-color: var(--admin-border); opacity: 0.4;"></div>
      <div class="h-40 w-full bg-border/20 rounded-xl" style="background-color: var(--admin-border); opacity: 0.4;"></div>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Selector Dropdown Form -->
      <div class="admin-card flex flex-col gap-4">
        <div class="flex flex-col">
          <label class="admin-label">Select Featured Project</label>
          <div class="flex gap-3">
            <select v-model="selectedProjectId" class="admin-input flex-1" style="appearance: auto;">
              <option value="" disabled>Select project to feature</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <button @click="handleSelect" class="admin-btn-primary shrink-0">
              Apply
            </button>
          </div>
        </div>
      </div>

      <!-- Current Featured Card -->
      <div>
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Currently Featured Project</h3>
        <div v-if="featuredProject" class="admin-card flex flex-col md:flex-row gap-6 items-stretch md:items-center">
          <img :src="featuredProject.cover" class="h-28 w-44 rounded-xl object-cover border" style="border-color: var(--admin-border);" />
          <div class="flex-grow text-left">
            <span class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--admin-accent);">BY {{ featuredProject.builder }}</span>
            <h4 class="text-xl font-bold mt-1" style="color: var(--admin-text-primary);">{{ featuredProject.name }}</h4>
            <p class="text-sm mt-2" style="color: var(--admin-text-secondary);">{{ featuredProject.tagline }}</p>
          </div>
        </div>
        <div v-else class="p-6 rounded-xl border border-dashed text-center text-sm" style="border-color: var(--admin-border); color: var(--admin-text-muted);">
          No featured project selected.
        </div>
      </div>
    </div>
  </div>
</template>
