<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, updateDoc, doc, deleteDoc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useCollection } from '@/composables/firebase/useCollection'
import { logAction } from '@/composables/firebase/useAuditLog'
import type { PastEvent } from '@/types'
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

const { docs: pastEvents, loading, error } = useCollection<PastEvent>('pastEvents')

const columns = [
  { key: 'coverImage', label: 'Cover', width: '80px' },
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'talksCount', label: '# Talks', width: '100px' },
  { key: 'createdAt', label: 'Created' }
]

// Modal states
const showFormModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<string | null>(null)
const viewingEvent = ref<PastEvent | null>(null)
const viewingTalks = ref<any[]>([])

// Form state
const initialForm = () => ({
  title: '',
  date: '', // format: YYYY-MM-DD
  coverImage: '',
  description: '',
  fullDescription: '',
  tagsString: '',
  galleryImages: [] as { url: string }[],
  talks: [] as {
    id?: string;
    speakerName: string;
    speakerTitle: string;
    speakerPortrait: string;
    talkTitle: string;
    youtubeUrl: string;
  }[]
})

const form = ref(initialForm())

const openAdd = () => {
  editingId.value = null
  form.value = initialForm()
  showFormModal.value = true
}

const openEdit = async (id: string) => {
  const event = pastEvents.value.find(e => e.id === id)
  if (event) {
    editingId.value = id
    
    // Fetch talks subcollection
    let loadedTalks: any[] = []
    try {
      const subColRef = collection(db, 'pastEvents', id, 'talks')
      const subColSnap = await getDocs(subColRef)
      loadedTalks = subColSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (e) {
      console.error('Error fetching talks subcollection:', e)
    }

    form.value = {
      title: event.title || '',
      date: event.date || '',
      coverImage: event.coverImage || '',
      description: event.description || '',
      fullDescription: event.fullDescription || '',
      tagsString: event.tags ? event.tags.join(', ') : '',
      galleryImages: event.galleryImages ? event.galleryImages.map(url => ({ url })) : [],
      talks: loadedTalks
    }
    showFormModal.value = true
  }
}

const openView = async (id: string) => {
  const event = pastEvents.value.find(e => e.id === id)
  if (event) {
    viewingEvent.value = event
    viewingTalks.value = []
    showViewModal.value = true

    try {
      const subColRef = collection(db, 'pastEvents', id, 'talks')
      const subColSnap = await getDocs(subColRef)
      viewingTalks.value = subColSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (e) {
      console.error('Error fetching talks for view:', e)
    }
  }
}

const handleDelete = async (id: string) => {
  try {
    const docRef = doc(db, 'pastEvents', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const docData = docSnap.data()
      
      // Fetch talks
      const talksColRef = collection(db, 'pastEvents', id, 'talks')
      const talksSnap = await getDocs(talksColRef)
      const talksList = talksSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      
      const deletedBy = auth.currentUser?.email || 'Anonymous Admin'
      const deletedAt = new Date()
      const purgeAfter = new Date()
      purgeAfter.setDate(deletedAt.getDate() + 30)

      // Copy to bin (with talks embedded inside data payload)
      const binDocRef = doc(db, 'bin', `pastEvents_${id}`)
      await setDoc(binDocRef, {
        originalCollection: 'pastEvents',
        data: {
          ...docData,
          talks: talksList
        },
        deletedBy,
        deletedAt: deletedAt.toISOString(),
        purgeAfter: purgeAfter.toISOString()
        // TODO: A Cloud Function should be implemented to auto-purge this document after 30 days.
      })

      // Delete subcollection talks first
      for (const talkDoc of talksSnap.docs) {
        await deleteDoc(talkDoc.ref)
      }
      
      // Delete parent doc
      await deleteDoc(docRef)

      // Log action
      await logAction({
        action: 'delete',
        collection: 'pastEvents',
        docId: id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Soft-deleted past event: ${docData.title}`
      })
    }
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const addGalleryImage = () => {
  form.value.galleryImages.push({ url: '' })
}

const removeGalleryImage = (index: number) => {
  form.value.galleryImages.splice(index, 1)
}

const addTalk = () => {
  form.value.talks.push({
    speakerName: '',
    speakerTitle: '',
    speakerPortrait: '',
    talkTitle: '',
    youtubeUrl: ''
  })
}

const removeTalk = (index: number) => {
  form.value.talks.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const tags = form.value.tagsString
      ? form.value.tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: form.value.title,
      date: form.value.date,
      coverImage: form.value.coverImage,
      description: form.value.description,
      fullDescription: form.value.fullDescription,
      tags,
      galleryImages: form.value.galleryImages.map(item => item.url).filter(Boolean),
      talksCount: form.value.talks.length,
      updatedAt: serverTimestamp()
    }

    let eventId = editingId.value

    if (eventId) {
      const docRef = doc(db, 'pastEvents', eventId)
      await updateDoc(docRef, payload)

      // Re-sync talks subcollection
      const talksColRef = collection(db, 'pastEvents', eventId, 'talks')
      const existingTalks = await getDocs(talksColRef)
      for (const talkDoc of existingTalks.docs) {
        await deleteDoc(talkDoc.ref)
      }
      for (const talk of form.value.talks) {
        const talkDocRef = doc(talksColRef)
        await setDoc(talkDocRef, {
          speakerName: talk.speakerName || '',
          speakerTitle: talk.speakerTitle || '',
          speakerPortrait: talk.speakerPortrait || '',
          talkTitle: talk.talkTitle || '',
          youtubeUrl: talk.youtubeUrl || ''
        })
      }

      await logAction({
        action: 'update',
        collection: 'pastEvents',
        docId: eventId,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Updated past event: ${form.value.title}`
      })
    } else {
      const colRef = collection(db, 'pastEvents')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      eventId = docRef.id

      // Write talks
      const talksColRef = collection(db, 'pastEvents', eventId, 'talks')
      for (const talk of form.value.talks) {
        const talkDocRef = doc(talksColRef)
        await setDoc(talkDocRef, {
          speakerName: talk.speakerName || '',
          speakerTitle: talk.speakerTitle || '',
          speakerPortrait: talk.speakerPortrait || '',
          talkTitle: talk.talkTitle || '',
          youtubeUrl: talk.youtubeUrl || ''
        })
      }

      await logAction({
        action: 'create',
        collection: 'pastEvents',
        docId: eventId,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Created past event: ${form.value.title}`
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
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Past Events</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage historical meetups, talk archives, and media gallery.</p>
      </div>
      <AddButton label="Past Event" @click="openAdd" />
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- View Content Wrapper -->
    <ShimmerTable v-if="loading" />
    <EmptyState v-else-if="pastEvents.length === 0" />
    <DataTable
      v-else
      :columns="columns"
      :rows="pastEvents"
      @view="openView"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <!-- Custom cells formatting -->
      <template #cell(coverImage)="{ row }">
        <img
          :src="row.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&auto=format&fit=crop'"
          alt="thumbnail"
          class="h-8 w-14 rounded object-cover border"
          style="border-color: var(--admin-border);"
        />
      </template>
      <template #cell(talksCount)="{ row }">
        <span class="font-semibold">{{ row.talksCount || 0 }} talks</span>
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
              {{ editingId ? 'Edit Past Event' : 'Add Past Event' }}
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
                <input v-model="form.title" required class="admin-input" placeholder="Winter Showcase 2025" />
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
                <input v-model="form.tagsString" class="admin-input" placeholder="Showcase, Bristol, Winter" />
              </div>
            </div>

            <div class="flex flex-col">
              <label class="admin-label">Short Description</label>
              <textarea v-model="form.description" required class="admin-input h-20 py-2 resize-none" placeholder="Our annual winter showcase in Bristol."></textarea>
            </div>

            <!-- Full Description Editor -->
            <div class="flex flex-col">
              <label class="admin-label">Full Description (HTML copy)</label>
              <RichTextEditor v-model="form.fullDescription" placeholder="Write event summary details..." />
            </div>

            <!-- Repeatable Gallery Subform -->
            <div class="border-t pt-4" style="border-color: var(--admin-border);">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Gallery Images</h3>
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
                <div v-for="(img, index) in form.galleryImages" :key="index" class="flex gap-2 items-center">
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

            <!-- Talks repeatability section -->
            <div class="border-t pt-4" style="border-color: var(--admin-border);">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 font-semibold">Talks list</h3>
                <button
                  type="button"
                  @click="addTalk"
                  class="flex items-center gap-1 text-xs font-bold text-white bg-green-600 rounded px-2.5 py-1 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <Plus class="h-3 w-3" />
                  <span>Add Talk</span>
                </button>
              </div>

              <!-- List of sub-rows -->
              <div class="flex flex-col gap-3">
                <div
                  v-for="(talk, index) in form.talks"
                  :key="index"
                  class="p-4 rounded-xl border flex flex-col gap-3 relative bg-gray-50/20"
                  style="border-color: var(--admin-border);"
                >
                  <!-- Delete button -->
                  <button
                    type="button"
                    @click="removeTalk(index)"
                    class="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                  >
                    <Minus class="h-4 w-4" />
                  </button>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">Speaker Name</label>
                      <input v-model="talk.speakerName" required class="admin-input py-1.5 text-xs" placeholder="Marcus Vance" />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">Speaker Title</label>
                      <input v-model="talk.speakerTitle" required class="admin-input py-1.5 text-xs" placeholder="iOS Developer" />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">Speaker Portrait Image URL</label>
                      <input v-model="talk.speakerPortrait" required class="admin-input py-1.5 text-xs" placeholder="https://images.unsplash.com/..." />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">YouTube Video URL</label>
                      <input v-model="talk.youtubeUrl" required class="admin-input py-1.5 text-xs" placeholder="https://www.youtube.com/watch?v=..." />
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <label class="text-[10px] font-bold text-gray-500 mb-1">Talk Title</label>
                    <input v-model="talk.talkTitle" required class="admin-input py-1.5 text-xs" placeholder="Bootstrapping a SwiftUI App" />
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

    <!-- Radix View Details Modal -->
    <DialogRoot :open="showViewModal" @update:open="showViewModal = $event">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-xl outline-none focus:outline-none flex flex-col gap-4 text-left"
          style="background-color: var(--admin-card-bg); border-color: var(--admin-border); color: var(--admin-text-primary);"
        >
          <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--admin-border);">
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">Past Event Details</h2>
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
                  {{ formatDate(viewingEvent.date) }}
                </p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="tag in viewingEvent.tags" :key="tag" class="px-2 py-0.5 text-[10px] rounded border" style="border-color: var(--admin-border); background-color: var(--admin-bg);">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Short Description</h5>
              <p class="text-sm text-gray-600 dark:text-stone-300">{{ viewingEvent.description }}</p>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Full Description</h5>
              <div class="prose max-w-none text-sm" v-html="viewingEvent.fullDescription"></div>
            </div>

            <div v-if="viewingEvent.galleryImages && viewingEvent.galleryImages.length > 0" class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Gallery Images ({{ viewingEvent.galleryImages.length }})</h5>
              <div class="grid grid-cols-3 gap-2">
                <img v-for="(img, idx) in viewingEvent.galleryImages" :key="idx" :src="img" class="h-16 w-full object-cover rounded border" style="border-color: var(--admin-border);" />
              </div>
            </div>

            <div v-if="viewingTalks && viewingTalks.length > 0" class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Talks ({{ viewingTalks.length }})</h5>
              <ul class="space-y-3">
                <li v-for="talk in viewingTalks" :key="talk.id" class="p-3 rounded-lg border text-sm" style="border-color: var(--admin-border); background-color: var(--admin-bg);">
                  <div class="flex items-center gap-3">
                    <img :src="talk.speakerPortrait" class="h-10 w-10 rounded-full object-cover border" style="border-color: var(--admin-border);" />
                    <div>
                      <strong style="color: var(--admin-text-primary);">{{ talk.speakerName }}</strong>
                      <p class="text-xs text-gray-500">{{ talk.speakerTitle }}</p>
                    </div>
                  </div>
                  <p class="font-semibold mt-2" style="color: var(--admin-text-primary);">{{ talk.talkTitle }}</p>
                  <a :href="talk.youtubeUrl" target="_blank" class="text-xs underline block mt-1" style="color: var(--admin-accent);">Watch on YouTube</a>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
