<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useCollection } from '@/composables/firebase/useCollection'
import { softDeleteDocument } from '@/composables/firebase/useSoftDelete'
import { logAction } from '@/composables/firebase/useAuditLog'
import type { UpcomingEvent } from '@/types'
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
import { X } from 'lucide-vue-next'

const { docs: events, loading, error } = useCollection<UpcomingEvent>('upcomingEvents')

const columns = [
  { key: 'coverImage', label: 'Cover', width: '80px' },
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'location', label: 'Location' },
  { key: 'createdAt', label: 'Created' }
]

// Modal states
const showFormModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<string | null>(null)
const viewingEvent = ref<UpcomingEvent | null>(null)

// Form state
const initialForm = () => ({
  title: '',
  description: '',
  date: '', // datetime-local: YYYY-MM-DDTHH:MM
  time: '',
  location: '',
  locationUrl: '',
  meetupUrl: '',
  coverImage: '',
  tagsString: ''
})

const form = ref(initialForm())

const openAdd = () => {
  editingId.value = null
  form.value = initialForm()
  showFormModal.value = true
}

const openEdit = (id: string) => {
  const event = events.value.find(e => e.id === id)
  if (event) {
    editingId.value = id
    let localDate = ''
    if (event.date) {
      try {
        localDate = new Date(event.date).toISOString().slice(0, 16)
      } catch (e) {
        localDate = event.date
      }
    }
    form.value = {
      title: event.title || '',
      description: event.description || '',
      date: localDate,
      time: event.time || '',
      location: event.location || '',
      locationUrl: event.locationUrl || '',
      meetupUrl: event.meetupUrl || '',
      coverImage: event.coverImage || '',
      tagsString: event.tags ? event.tags.join(', ') : ''
    }
    showFormModal.value = true
  }
}

const openView = (id: string) => {
  const event = events.value.find(e => e.id === id)
  if (event) {
    viewingEvent.value = event
    showViewModal.value = true
  }
}

const handleDelete = async (id: string) => {
  try {
    await softDeleteDocument('upcomingEvents', id)
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const handleSubmit = async () => {
  try {
    const tags = form.value.tagsString
      ? form.value.tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : []

    let isoDate = ''
    if (form.value.date) {
      isoDate = new Date(form.value.date).toISOString()
    }

    const payload = {
      title: form.value.title,
      description: form.value.description,
      date: isoDate,
      time: form.value.time,
      location: form.value.location,
      locationUrl: form.value.locationUrl,
      meetupUrl: form.value.meetupUrl,
      coverImage: form.value.coverImage,
      tags,
      updatedAt: serverTimestamp()
    }

    if (editingId.value) {
      const docRef = doc(db, 'upcomingEvents', editingId.value)
      await updateDoc(docRef, payload)
      await logAction({
        action: 'update',
        collection: 'upcomingEvents',
        docId: editingId.value,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Updated upcoming event: ${form.value.title}`
      })
    } else {
      const colRef = collection(db, 'upcomingEvents')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      await logAction({
        action: 'create',
        collection: 'upcomingEvents',
        docId: docRef.id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Created upcoming event: ${form.value.title}`
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
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Upcoming Events</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage future meetups, presentations, and workshops.</p>
      </div>
      <AddButton label="Upcoming Event" @click="openAdd" />
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- View Content Wrapper -->
    <ShimmerTable v-if="loading" />
    <EmptyState v-else-if="events.length === 0" />
    <DataTable
      v-else
      :columns="columns"
      :rows="events"
      @view="openView"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <!-- Custom cells formatting -->
      <template #cell(coverImage)="{ row }">
        <img
          :src="row.coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=80&auto=format&fit=crop'"
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
              {{ editingId ? 'Edit Event' : 'Add Upcoming Event' }}
            </h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <!-- Fields -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Event Title</label>
                <input v-model="form.title" required class="admin-input" placeholder="Bristol Indie Devs: Summer Showcase" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Cover Image URL</label>
                <input v-model="form.coverImage" required class="admin-input" placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Date & Time</label>
                <input v-model="form.date" type="datetime-local" required class="admin-input" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Time Label (e.g. 6:30 PM BST)</label>
                <input v-model="form.time" required class="admin-input" placeholder="6:30 PM BST" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Location Address</label>
                <input v-model="form.location" required class="admin-input" placeholder="Engine Shed, Bristol BS1 6QH" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Location Google Maps URL</label>
                <input v-model="form.locationUrl" required class="admin-input" placeholder="https://maps.google.com/..." />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Meetup URL</label>
                <input v-model="form.meetupUrl" required class="admin-input" placeholder="https://meetup.com/..." />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Tags (comma-separated)</label>
                <input v-model="form.tagsString" class="admin-input" placeholder="Meetup, Show & Tell, Workshop" />
              </div>
            </div>

            <!-- Description Editor -->
            <div class="flex flex-col">
              <label class="admin-label">Description</label>
              <RichTextEditor v-model="form.description" placeholder="Write event details..." />
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
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">Upcoming Event Details</h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <div v-if="viewingEvent" class="flex flex-col gap-4">
            <div class="flex items-start gap-4">
              <img :src="viewingEvent.coverImage" class="h-20 w-32 rounded object-cover border" style="border-color: var(--admin-border);" />
              <div>
                <h4 class="text-xl font-bold">{{ viewingEvent.title }}</h4>
                <p class="text-sm font-semibold mt-1" style="color: var(--admin-accent);">
                  {{ formatDate(viewingEvent.date) }} @ {{ viewingEvent.time }}
                </p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="tag in viewingEvent.tags" :key="tag" class="px-2 py-0.5 text-[10px] rounded border" style="border-color: var(--admin-border); background-color: var(--admin-bg);">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Location</h5>
              <p class="text-sm">{{ viewingEvent.location }}</p>
              <a :href="viewingEvent.locationUrl" target="_blank" class="text-xs underline text-blue-500 block mt-0.5">Google Maps Link</a>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Meetup Link</h5>
              <a :href="viewingEvent.meetupUrl" target="_blank" class="text-sm underline" style="color: var(--admin-accent);">{{ viewingEvent.meetupUrl }}</a>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</h5>
              <div class="prose max-w-none text-sm" v-html="viewingEvent.description"></div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
