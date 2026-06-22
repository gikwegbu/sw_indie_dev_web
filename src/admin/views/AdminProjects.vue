<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useCollection } from '@/composables/firebase/useCollection'
import { softDeleteDocument } from '@/composables/firebase/useSoftDelete'
import { logAction } from '@/composables/firebase/useAuditLog'
import type { Project, ProjectLink, Member } from '@/types'
import ShimmerTable from '../components/ShimmerTable.vue'
import EmptyState from '../components/EmptyState.vue'
import DataTable from '../components/DataTable.vue'
import AddButton from '../components/AddButton.vue'
import RichTextEditor from '../components/RichTextEditor.vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose
} from 'radix-vue'
import { X, Plus, Minus, Star, StarOff } from 'lucide-vue-next'

const { docs: projects, loading, error } = useCollection<Project>('projects')
const { docs: members } = useCollection<Member>('members')

const columns = [
  { key: 'cover', label: 'Cover', width: '80px' },
  { key: 'name', label: 'Title' },
  { key: 'builder', label: 'Builder' },
  { key: 'tags', label: 'Tags' },
  { key: 'featured', label: 'Featured?', width: '100px' },
  { key: 'createdAt', label: 'Created' }
]

// Modal states
const showFormModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<string | null>(null)
const viewingProject = ref<Project | null>(null)

// Form state
const initialForm = () => ({
  name: '',
  tagline: '',
  builder: '',
  cover: '',
  screenshots: ['', '', ''] as string[],
  description: '',
  monetisation: '',
  tags: '',
  featured: false,
  featuredOrder: 1,
  links: [] as ProjectLink[]
})

const form = ref(initialForm())

const openAdd = () => {
  editingId.value = null
  form.value = initialForm()
  showFormModal.value = true
}

const openEdit = (id: string) => {
  const project = projects.value.find(p => p.id === id)
  if (project) {
    editingId.value = id
    
    // Pad screenshots list to length 3
    const rawScreenshots = project.screenshots || []
    const paddedScreenshots = [
      rawScreenshots[0] || '',
      rawScreenshots[1] || '',
      rawScreenshots[2] || ''
    ]

    form.value = {
      name: project.name || '',
      tagline: project.tagline || '',
      builder: project.builder || '',
      cover: project.cover || '',
      screenshots: paddedScreenshots,
      description: project.description || '',
      monetisation: project.monetisation || '',
      tags: project.tags ? project.tags.join(', ') : '',
      featured: !!project.featured,
      featuredOrder: project.featuredOrder || 1,
      links: project.links ? JSON.parse(JSON.stringify(project.links)) : []
    }
    showFormModal.value = true
  }
}

const openView = (id: string) => {
  const project = projects.value.find(p => p.id === id)
  if (project) {
    viewingProject.value = project
    showViewModal.value = true
  }
}

const handleDelete = async (id: string) => {
  try {
    await softDeleteDocument('projects', id)
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const addLinkRow = () => {
  form.value.links.push({
    label: '',
    url: '',
    icon: 'web'
  })
}

const removeLinkRow = (index: number) => {
  form.value.links.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    // Process tags into array
    const cleanTags = form.value.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '')

    // Filter screenshots to populated items only
    const cleanScreenshots = form.value.screenshots
      .map(s => s.trim())
      .filter(s => s !== '')

    const payload = {
      name: form.value.name,
      tagline: form.value.tagline,
      builder: form.value.builder,
      cover: form.value.cover,
      screenshots: cleanScreenshots,
      description: form.value.description,
      monetisation: form.value.monetisation,
      tags: cleanTags,
      featured: form.value.featured,
      featuredOrder: form.value.featured ? Number(form.value.featuredOrder) : 9999,
      links: form.value.links,
      updatedAt: serverTimestamp()
    }

    // If marked as featured, update all other projects to featured: false
    if (form.value.featured) {
      const otherFeatured = projects.value.filter(p => p.featured && p.id !== editingId.value)
      for (const p of otherFeatured) {
        if (p.id) {
          await updateDoc(doc(db, 'projects', p.id), {
            featured: false,
            featuredOrder: 9999
          })
        }
      }
    }

    if (editingId.value) {
      // Update
      const docRef = doc(db, 'projects', editingId.value)
      await updateDoc(docRef, payload)
      await logAction({
        action: 'update',
        collection: 'projects',
        docId: editingId.value,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Updated project ${form.value.name}`
      })
    } else {
      // Add
      const colRef = collection(db, 'projects')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      await logAction({
        action: 'create',
        collection: 'projects',
        docId: docRef.id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Created new project ${form.value.name}`
      })
    }
    showFormModal.value = false
  } catch (err) {
    console.error('Submit error:', err)
  }
}

const toggleFeatured = async (project: any) => {
  if (!project.id) return
  try {
    const isCurrentlyFeatured = !!project.featured
    
    if (isCurrentlyFeatured) {
      const docRef = doc(db, 'projects', project.id)
      await updateDoc(docRef, {
        featured: false,
        featuredOrder: 9999
      })
      await logAction({
        action: 'update',
        collection: 'projects',
        docId: project.id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Removed project ${project.name} from featured`
      })
    } else {
      const otherFeatured = projects.value.filter(p => p.featured && p.id !== project.id)
      for (const p of otherFeatured) {
        if (p.id) {
          await updateDoc(doc(db, 'projects', p.id), {
            featured: false,
            featuredOrder: 9999
          })
        }
      }
      
      const docRef = doc(db, 'projects', project.id)
      await updateDoc(docRef, {
        featured: true,
        featuredOrder: 1
      })
      
      await logAction({
        action: 'update',
        collection: 'projects',
        docId: project.id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: 'Marked as featured project'
      })
    }
  } catch (err) {
    console.error('Failed to toggle featured status:', err)
  }
}

const formatDate = (val: any) => {
  if (!val) return '—'
  if (val.seconds) {
    return new Date(val.seconds * 1000).toLocaleDateString()
  }
  return new Date(val).toLocaleDateString()
}
</script>

<template>
  <div class="p-8 flex flex-col gap-6 text-left">
    <!-- Header -->
    <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--admin-border);">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Projects</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage showcase projects shipped by community members.</p>
      </div>
      <AddButton label="Project" @click="openAdd" />
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- Table content -->
    <ShimmerTable v-if="loading" />
    <EmptyState v-else-if="projects.length === 0" />
    <DataTable
      v-else
      :columns="columns"
      :rows="projects"
      @view="openView"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <!-- Custom cells -->
      <template #cell(cover)="{ row }">
        <img
          :src="row.cover || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=120&auto=format&fit=crop'"
          alt="cover"
          class="h-8 w-12 rounded object-cover border"
          style="border-color: var(--admin-border);"
        />
      </template>
      <template #cell(tags)="{ row }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in row.tags"
            :key="tag"
            class="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase"
            style="background-color: var(--admin-sidebar-bg); color: var(--admin-text-secondary); border: 1px solid var(--admin-border);"
          >
            {{ tag }}
          </span>
        </div>
      </template>
      <template #cell(featured)="{ row }">
        <button
          type="button"
          @click="toggleFeatured(row)"
          class="p-1 rounded hover:bg-gray-150 dark:hover:bg-stone-850 cursor-pointer flex items-center justify-center transition-colors mx-auto"
          style="color: var(--admin-accent);"
          :title="row.featured ? 'Remove featured status' : 'Mark as featured'"
        >
          <Star v-if="row.featured" class="h-4 w-4 fill-amber-400 text-amber-500" />
          <StarOff v-else class="h-4 w-4 text-gray-400" />
        </button>
      </template>
      <template #cell(createdAt)="{ row }">
        <span>{{ formatDate(row.createdAt) }}</span>
      </template>
    </DataTable>

    <!-- Radix Form Modal -->
    <DialogRoot :open="showFormModal" @update:open="showFormModal = $event">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          class="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-xl outline-none focus:outline-none flex flex-col gap-4 text-left"
          style="background-color: var(--admin-card-bg); border-color: var(--admin-border); color: var(--admin-text-primary);"
        >
          <!-- Top Title Close -->
          <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--admin-border);">
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">
              {{ editingId ? 'Edit Project' : 'Add Project' }}
            </h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <!-- Fields -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Title</label>
                <input v-model="form.name" required class="admin-input" placeholder="Chronos Planner" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Builder (Member)</label>
                <select v-model="form.builder" required class="admin-input" style="appearance: auto;">
                  <option value="" disabled>Select builder</option>
                  <option v-for="m in members" :key="m.id" :value="m.name">{{ m.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Tagline</label>
                <input v-model="form.tagline" required class="admin-input" placeholder="A premium planning calendar tool" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Cover Image URL</label>
                <input v-model="form.cover" required class="admin-input" placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <!-- Screenshots (3 URLs) -->
            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <label class="admin-label">App Screenshots (3 URLs)</label>
              <div class="flex flex-col gap-2">
                <input v-model="form.screenshots[0]" class="admin-input py-1.5 text-xs" placeholder="Screenshot URL 1" />
                <input v-model="form.screenshots[1]" class="admin-input py-1.5 text-xs" placeholder="Screenshot URL 2 (Optional)" />
                <input v-model="form.screenshots[2]" class="admin-input py-1.5 text-xs" placeholder="Screenshot URL 3 (Optional)" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Tags (comma-separated)</label>
                <input v-model="form.tags" class="admin-input" placeholder="Productivity, Health, iOS" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Monetisation Description</label>
                <input v-model="form.monetisation" required class="admin-input" placeholder="Free / $4.99 Premium subscription" />
              </div>
            </div>

            <!-- Featured Toggles -->
            <div class="p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/10" style="border-color: var(--admin-border);">
              <div class="flex items-center gap-2">
                <input id="featured" type="checkbox" v-model="form.featured" class="h-4 w-4 rounded accent-[#6248d4]" />
                <label for="featured" class="text-sm font-semibold select-none cursor-pointer" style="color: var(--admin-text-primary);">
                  Mark as Featured Project
                </label>
              </div>
              <div v-if="form.featured" class="flex items-center gap-2 text-sm">
                <span style="color: var(--admin-text-secondary);">Featured Order:</span>
                <input type="number" v-model="form.featuredOrder" min="1" class="admin-input w-20 py-1" />
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col">
              <label class="admin-label">Project Description</label>
              <RichTextEditor v-model="form.description" placeholder="Write description..." />
            </div>

            <!-- Links Repeatable subform -->
            <div class="border-t pt-4" style="border-color: var(--admin-border);">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Download Links</h3>
                <button
                  type="button"
                  @click="addLinkRow"
                  class="flex items-center gap-1 text-xs font-bold text-white bg-green-600 rounded px-2.5 py-1 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <Plus class="h-3 w-3" />
                  <span>Add Link</span>
                </button>
              </div>

              <div class="flex flex-col gap-3">
                <div
                  v-for="(link, index) in form.links"
                  :key="index"
                  class="p-4 rounded-xl border flex flex-col gap-2 relative bg-gray-50/20"
                  style="border-color: var(--admin-border);"
                >
                  <button
                    type="button"
                    @click="removeLinkRow(index)"
                    class="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                    title="Remove Link"
                  >
                    <Minus class="h-4 w-4" />
                  </button>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pr-6">
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">Label</label>
                      <input v-model="link.label" required class="admin-input py-1.5 text-xs" placeholder="App Store" />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">URL</label>
                      <input v-model="link.url" required class="admin-input py-1.5 text-xs" placeholder="https://..." />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">Store / Icon</label>
                      <select v-model="link.icon" class="admin-input py-1.5 text-xs" style="appearance: auto;">
                        <option value="apple">Apple Icon</option>
                        <option value="play">Google Play Icon</option>
                        <option value="web">Browser/Web Icon</option>
                        <option value="download">Download File Icon</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit actions -->
            <div class="flex justify-end gap-3 mt-4 border-t pt-4" style="border-color: var(--admin-border);">
              <DialogClose
                type="button"
                class="px-4 py-2 border rounded-lg text-sm font-semibold hover:opacity-85 cursor-pointer"
                style="border-color: var(--admin-border); color: var(--admin-text-secondary); background-color: var(--admin-bg);"
              >
                Cancel
              </DialogClose>
              <button type="submit" class="admin-btn-primary">
                Save changes
              </button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <!-- Radix View Modal -->
    <DialogRoot :open="showViewModal" @update:open="showViewModal = $event">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-xl outline-none focus:outline-none flex flex-col gap-4 text-left"
          style="background-color: var(--admin-card-bg); border-color: var(--admin-border); color: var(--admin-text-primary);"
        >
          <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--admin-border);">
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">Project Details</h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <div v-if="viewingProject" class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <img :src="viewingProject.cover" class="h-16 w-24 rounded object-cover border" style="border-color: var(--admin-border);" />
              <div>
                <h4 class="text-xl font-bold">{{ viewingProject.name }}</h4>
                <p class="text-sm font-semibold" style="color: var(--admin-accent);">by {{ viewingProject.builder }}</p>
                <span v-if="viewingProject.featured" class="text-xs text-amber-500 font-bold">★ Featured</span>
              </div>
            </div>

            <div>
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Tagline</h5>
              <p class="text-sm">{{ viewingProject.tagline }}</p>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</h5>
              <div class="prose max-w-none text-sm" v-html="viewingProject.description"></div>
            </div>

            <div v-if="viewingProject.screenshots && viewingProject.screenshots.length > 0" class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Screenshots</h5>
              <div class="grid grid-cols-3 gap-2">
                <img v-for="s in viewingProject.screenshots" :key="s" :src="s" class="rounded border object-cover h-24 w-full" style="border-color: var(--admin-border);" />
              </div>
            </div>

            <div v-if="viewingProject.links && viewingProject.links.length > 0" class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Links</h5>
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="link in viewingProject.links"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  class="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-85"
                  style="border-color: var(--admin-border); background-color: var(--admin-bg); color: var(--admin-text-primary);"
                >
                  {{ link.label }} ({{ link.icon }})
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
