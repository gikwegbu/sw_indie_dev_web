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

const handleRemoveFeatured = async () => {
  if (!featuredProject.value || !featuredProject.value.id) return
  try {
    const docRef = doc(db, 'projects', featuredProject.value.id)
    await updateDoc(docRef, {
      featured: false,
      featuredOrder: 9999
    })
    
    await logAction({
      action: 'update',
      collection: 'projects',
      docId: featuredProject.value.id,
      performedBy: auth.currentUser?.uid || 'unknown',
      performedByEmail: auth.currentUser?.email || 'unknown',
      detail: `Removed project ${featuredProject.value.name} from featured`
    })
    
    alert('Removed featured project successfully!')
  } catch (err) {
    console.error('Failed to remove featured project:', err)
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
      <div class="flex flex-col gap-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Currently Featured Project</h3>
        
        <div v-if="featuredProject" class="flex flex-col gap-4 items-start">
          <!-- Public Showcase style Card in Admin palette -->
          <div 
            class="flex flex-col items-stretch text-left rounded-3xl border overflow-hidden max-w-sm w-full shadow-sm"
            style="border-color: var(--admin-border); background-color: var(--admin-card-bg);"
          >
            <!-- Cover Container -->
            <div class="relative aspect-[4/3] w-full overflow-hidden border-b" style="border-color: var(--admin-border);">
              <img
                :src="featuredProject.cover"
                :alt="featuredProject.name"
                class="h-full w-full object-cover"
              />
            </div>
            
            <!-- Content Info -->
            <div class="flex flex-1 flex-col p-6">
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--admin-accent);">
                BY {{ featuredProject.builder }}
              </span>
              <h3 class="mt-2 font-display text-2xl font-bold" style="color: var(--admin-text-primary);">
                {{ featuredProject.name }}
              </h3>
              <p class="mt-2 flex-1 text-sm line-clamp-2" style="color: var(--admin-text-secondary);">
                {{ featuredProject.tagline }}
              </p>
              
              <!-- Footer -->
              <div class="mt-6 flex items-center justify-between border-t pt-4" style="border-color: var(--admin-border);">
                <div class="flex gap-1.5">
                  <span
                    v-for="tag in featuredProject.tags?.slice(0, 2) || []"
                    :key="tag"
                    class="rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
                    style="border-color: var(--admin-border); background-color: var(--admin-bg); color: var(--admin-text-secondary);"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <span class="text-xs font-semibold" style="color: var(--admin-accent);">
                  Featured ★
                </span>
              </div>
            </div>
          </div>

          <!-- Remove featured button -->
          <button
            type="button"
            @click="handleRemoveFeatured"
            class="px-4 py-2 border rounded-lg text-sm font-semibold border-red-500/20 text-red-500 hover:bg-red-500/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Remove featured
          </button>
        </div>

        <div v-else class="p-6 rounded-xl border border-dashed text-center text-sm" style="border-color: var(--admin-border); color: var(--admin-text-muted);">
          No featured project selected.
        </div>
      </div>
    </div>
  </div>
</template>
