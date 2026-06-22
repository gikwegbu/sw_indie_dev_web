<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, updateDoc, doc, deleteDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useCollection } from '@/composables/firebase/useCollection'
import { logAction } from '@/composables/firebase/useAuditLog'
import type { OutreachActivity } from '@/types'
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
import { X, Plus, Minus } from 'lucide-vue-next'

const { docs: activities, loading, error } = useCollection<OutreachActivity>('outreach')

const columns = [
  { key: 'coverImage', label: 'Cover', width: '80px' },
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'createdAt', label: 'Created' }
]

// Modal states
const showFormModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<string | null>(null)
const viewingActivity = ref<OutreachActivity | null>(null)

// Form state
const initialForm = () => ({
  title: '',
  summary: '',
  fullDescription: '',
  date: '', // YYYY-MM-DD
  coverImage: '',
  gallery: [] as { url: string }[],
  tagsString: ''
})

const form = ref(initialForm())

const openAdd = () => {
  editingId.value = null
  form.value = initialForm()
  showFormModal.value = true
}

const openEdit = (id: string) => {
  const act = activities.value.find(a => a.id === id)
  if (act) {
    editingId.value = id
    form.value = {
      title: act.title || '',
      summary: act.summary || '',
      fullDescription: act.fullDescription || '',
      date: act.date || '',
      coverImage: act.coverImage || '',
      gallery: act.gallery ? act.gallery.map(url => ({ url })) : [],
      tagsString: act.tags ? act.tags.join(', ') : ''
    }
    showFormModal.value = true
  }
}

const openView = (id: string) => {
  const act = activities.value.find(a => a.id === id)
  if (act) {
    viewingActivity.value = act
    showViewModal.value = true
  }
}

const handleDelete = async (id: string) => {
  try {
    const docRef = doc(db, 'outreach', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const docData = docSnap.data()
      const deletedBy = auth.currentUser?.email || 'Anonymous Admin'
      const deletedAt = new Date()
      const purgeAfter = new Date()
      purgeAfter.setDate(deletedAt.getDate() + 30)

      // Copy to bin
      const binDocRef = doc(db, 'bin', `outreach_${id}`)
      await setDoc(binDocRef, {
        originalCollection: 'outreach',
        data: docData,
        deletedBy,
        deletedAt: deletedAt.toISOString(),
        purgeAfter: purgeAfter.toISOString()
        // TODO: A Cloud Function should be implemented to auto-purge this document after 30 days.
      })

      // Delete original
      await deleteDoc(docRef)

      // Log action
      await logAction({
        action: 'delete',
        collection: 'outreach',
        docId: id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Soft-deleted outreach activity: ${docData.title}`
      })
    }
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const addGalleryImage = () => {
  form.value.gallery.push({ url: '' })
}

const removeGalleryImage = (index: number) => {
  form.value.gallery.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const tags = form.value.tagsString
      ? form.value.tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: form.value.title,
      summary: form.value.summary,
      fullDescription: form.value.fullDescription,
      date: form.value.date,
      coverImage: form.value.coverImage,
      gallery: form.value.gallery.map(item => item.url).filter(Boolean),
      tags,
      updatedAt: serverTimestamp()
    }

    if (editingId.value) {
      const docRef = doc(db, 'outreach', editingId.value)
      await updateDoc(docRef, payload)
      await logAction({
        action: 'update',
        collection: 'outreach',
        docId: editingId.value,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Updated outreach activity: ${form.value.title}`
      })
    } else {
      const colRef = collection(db, 'outreach')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      await logAction({
        action: 'create',
        collection: 'outreach',
        docId: docRef.id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Created outreach activity: ${form.value.title}`
      })
    }
    showFormModal.value = false
  } catch (err) {
    console.error('Submit error:', err)
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
    <!-- Header Page Row -->
    <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--admin-border);">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Outreach Initiatives</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage community cleanups, workshops, and green actions.</p>
      </div>
      <AddButton label="Outreach Activity" @click="openAdd" />
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- View Content Wrapper -->
    <ShimmerTable v-if="loading" />
    <EmptyState v-else-if="activities.length === 0" />
    <DataTable
      v-else
      :columns="columns"
      :rows="activities"
      @view="openView"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <!-- Custom cells formatting -->
      <template #cell(coverImage)="{ row }">
        <img
          :src="row.coverImage || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=80&auto=format&fit=crop'"
          alt="thumbnail"
          class="h-8 w-14 rounded object-cover border"
          style="border-color: var(--admin-border);"
        />
      </template>
      <template #cell(date)="{ row }">
        <span>{{ formatDate(row.date) }}</span>
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
          <!-- Top Close Bar -->
          <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--admin-border);">
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">
              {{ editingId ? 'Edit Outreach Activity' : 'Add Outreach Activity' }}
            </h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <!-- Fields -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Initiative Title</label>
                <input v-model="form.title" required class="admin-input" placeholder="Bristol Parks Cleanup" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Cover Image URL</label>
                <input v-model="form.coverImage" required class="admin-input" placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Date (YYYY-MM-DD)</label>
                <input v-model="form.date" type="date" required class="admin-input" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Tags (comma-separated)</label>
                <input v-model="form.tagsString" class="admin-input" placeholder="Community, Bristol, Green" />
              </div>
            </div>

            <div class="flex flex-col">
              <label class="admin-label">Summary (one-liner)</label>
              <input v-model="form.summary" required class="admin-input" placeholder="A short description summarizing the event details." />
            </div>

            <!-- Full Description Editor -->
            <div class="flex flex-col">
              <label class="admin-label">Full Description (HTML copy)</label>
              <RichTextEditor v-model="form.fullDescription" placeholder="Write the details of the green action..." />
            </div>

            <!-- Repeatable Gallery Subform -->
            <div class="border-t pt-4" style="border-color: var(--admin-border);">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 font-semibold">Gallery Carousel Images</h3>
                <button
                  type="button"
                  @click="addGalleryImage"
                  class="flex items-center gap-1 text-xs font-bold text-white bg-green-600 rounded px-2.5 py-1 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <Plus class="h-3 w-3" />
                  <span>Add Image</span>
                </button>
              </div>

              <div class="flex flex-col gap-2">
                <div v-for="(img, index) in form.gallery" :key="index" class="flex gap-2 items-center">
                  <input v-model="img.url" required class="admin-input flex-1" placeholder="https://images.unsplash.com/photo-..." />
                  <button
                    type="button"
                    @click="removeGalleryImage(index)"
                    class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                  >
                    <Minus class="h-4 w-4" />
                  </button>
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

    <!-- Radix View Details Modal -->
    <DialogRoot :open="showViewModal" @update:open="showViewModal = $event">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-xl outline-none focus:outline-none flex flex-col gap-4 text-left"
          style="background-color: var(--admin-card-bg); border-color: var(--admin-border); color: var(--admin-text-primary);"
        >
          <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--admin-border);">
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">Outreach Initiative Details</h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <div v-if="viewingActivity" class="flex flex-col gap-4">
            <div class="flex items-start gap-4">
              <img :src="viewingActivity.coverImage" class="h-20 w-32 rounded object-cover border" style="border-color: var(--admin-border);" />
              <div>
                <h4 class="text-xl font-bold">{{ viewingActivity.title }}</h4>
                <p class="text-sm font-semibold mt-1" style="color: var(--admin-accent);">
                  {{ formatDate(viewingActivity.date) }}
                </p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="tag in viewingActivity.tags" :key="tag" class="px-2 py-0.5 text-[10px] rounded border" style="border-color: var(--admin-border); background-color: var(--admin-bg);">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Summary</h5>
              <p class="text-sm text-gray-600 dark:text-stone-300 font-medium">{{ viewingActivity.summary }}</p>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Full Description</h5>
              <div class="prose max-w-none text-sm" v-html="viewingActivity.fullDescription"></div>
            </div>

            <div v-if="viewingActivity.gallery && viewingActivity.gallery.length > 0" class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Gallery Images ({{ viewingActivity.gallery.length }})</h5>
              <div class="grid grid-cols-3 gap-2">
                <img v-for="(img, idx) in viewingActivity.gallery" :key="idx" :src="img" class="h-16 w-full object-cover rounded border" style="border-color: var(--admin-border);" />
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
