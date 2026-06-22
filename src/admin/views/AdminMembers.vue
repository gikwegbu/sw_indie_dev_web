<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useCollection } from '@/composables/firebase/useCollection'
import { softDeleteDocument } from '@/composables/firebase/useSoftDelete'
import { logAction } from '@/composables/firebase/useAuditLog'
import type { Member, MemberApp } from '@/types'
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

const { docs: members, loading, error } = useCollection<Member>('members')

const columns = [
  { key: 'portrait', label: 'Portrait', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'title', label: 'Title' },
  { key: 'appsCount', label: '# Apps', width: '100px' },
  { key: 'createdAt', label: 'Created' }
]

// Modal states
const showFormModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<string | null>(null)
const viewingMember = ref<Member | null>(null)

// Form state
const initialForm = () => ({
  name: '',
  role: 'Member' as 'Member' | 'Organizing Team',
  title: '',
  portrait: '',
  bio: '',
  socials: {
    linkedin: '',
    twitter: '',
    github: '',
    website: ''
  },
  apps: [] as MemberApp[]
})

const form = ref(initialForm())

const openAdd = () => {
  editingId.value = null
  form.value = initialForm()
  showFormModal.value = true
}

const openEdit = (id: string) => {
  const member = members.value.find(m => m.id === id)
  if (member) {
    editingId.value = id
    form.value = {
      name: member.name || '',
      role: member.role || 'Member',
      title: member.title || '',
      portrait: member.portrait || '',
      bio: member.bio || '',
      socials: {
        linkedin: member.socials?.linkedin || '',
        twitter: member.socials?.twitter || '',
        github: member.socials?.github || '',
        website: member.socials?.website || ''
      },
      apps: member.apps ? JSON.parse(JSON.stringify(member.apps)) : []
    }
    showFormModal.value = true
  }
}

const openView = (id: string) => {
  const member = members.value.find(m => m.id === id)
  if (member) {
    viewingMember.value = member
    showViewModal.value = true
  }
}

const handleDelete = async (id: string) => {
  try {
    await softDeleteDocument('members', id)
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const addAppRow = () => {
  form.value.apps.push({
    name: '',
    description: '',
    url: '',
    store: 'apple'
  })
}

const removeAppRow = (index: number) => {
  form.value.apps.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const payload = {
      ...form.value,
      updatedAt: serverTimestamp()
    }
    
    if (editingId.value) {
      // Update
      const docRef = doc(db, 'members', editingId.value)
      await updateDoc(docRef, payload)
      await logAction({
        action: 'update',
        collection: 'members',
        docId: editingId.value,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Updated member details for ${form.value.name}`
      })
    } else {
      // Add
      const colRef = collection(db, 'members')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      await logAction({
        action: 'create',
        collection: 'members',
        docId: docRef.id,
        performedBy: auth.currentUser?.uid || 'unknown',
        performedByEmail: auth.currentUser?.email || 'unknown',
        detail: `Created new member ${form.value.name}`
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
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Members</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage SW-Indie Devs community makers and staff.</p>
      </div>
      <AddButton label="Member" @click="openAdd" />
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- View Content Wrapper -->
    <ShimmerTable v-if="loading" />
    <EmptyState v-else-if="members.length === 0" />
    <DataTable
      v-else
      :columns="columns"
      :rows="members"
      @view="openView"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <!-- Custom cells formatting -->
      <template #cell(portrait)="{ row }">
        <img
          :src="row.portrait || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'"
          alt="thumbnail"
          class="h-8 w-8 rounded-full object-cover border"
          style="border-color: var(--admin-border);"
        />
      </template>
      <template #cell(appsCount)="{ row }">
        <span class="font-semibold">{{ row.apps?.length || 0 }} apps</span>
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
              {{ editingId ? 'Edit Member' : 'Add Member' }}
            </h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <!-- Fields -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Name</label>
                <input v-model="form.name" required class="admin-input" placeholder="Jane Doe" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Role</label>
                <select v-model="form.role" class="admin-input" style="appearance: auto;">
                  <option value="Member">Member</option>
                  <option value="Organizing Team">Organizing Team</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col">
                <label class="admin-label">Title</label>
                <input v-model="form.title" required class="admin-input" placeholder="Founder & Indie Developer" />
              </div>
              <div class="flex flex-col">
                <label class="admin-label">Portrait Image URL</label>
                <input v-model="form.portrait" required class="admin-input" placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <!-- Socials -->
            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Social Handles</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="flex flex-col">
                  <label class="text-[10px] font-bold text-gray-500 mb-1">LinkedIn</label>
                  <input v-model="form.socials.linkedin" class="admin-input py-1.5 text-xs" placeholder="https://..." />
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] font-bold text-gray-500 mb-1">Twitter</label>
                  <input v-model="form.socials.twitter" class="admin-input py-1.5 text-xs" placeholder="https://..." />
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] font-bold text-gray-500 mb-1">GitHub</label>
                  <input v-model="form.socials.github" class="admin-input py-1.5 text-xs" placeholder="https://..." />
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] font-bold text-gray-500 mb-1">Website</label>
                  <input v-model="form.socials.website" class="admin-input py-1.5 text-xs" placeholder="https://..." />
                </div>
              </div>
            </div>

            <!-- Bio Editor -->
            <div class="flex flex-col">
              <label class="admin-label">Biography</label>
              <RichTextEditor v-model="form.bio" placeholder="Write biography..." />
            </div>

            <!-- Apps sub-section -->
            <div class="border-t pt-4" style="border-color: var(--admin-border);">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Apps shipped</h3>
                <button
                  type="button"
                  @click="addAppRow"
                  class="flex items-center gap-1 text-xs font-bold text-white bg-green-600 rounded px-2.5 py-1 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <Plus class="h-3 w-3" />
                  <span>Add App</span>
                </button>
              </div>

              <!-- Repeatable Row -->
              <div class="flex flex-col gap-3">
                <div
                  v-for="(app, index) in form.apps"
                  :key="index"
                  class="p-4 rounded-xl border flex flex-col gap-2 relative bg-gray-50/20"
                  style="border-color: var(--admin-border);"
                >
                  <!-- Delete app btn -->
                  <button
                    type="button"
                    @click="removeAppRow(index)"
                    class="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                    title="Remove app row"
                  >
                    <Minus class="h-4 w-4" />
                  </button>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pr-6">
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">App Name</label>
                      <input v-model="app.name" required class="admin-input py-1.5 text-xs" placeholder="TaskMinder" />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">URL</label>
                      <input v-model="app.url" required class="admin-input py-1.5 text-xs" placeholder="https://..." />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[10px] font-bold text-gray-500 mb-1">App Store</label>
                      <select v-model="app.store" class="admin-input py-1.5 text-xs" style="appearance: auto;">
                        <option value="apple">Apple App Store</option>
                        <option value="play">Google Play Store</option>
                        <option value="web">Web Application</option>
                        <option value="download">Direct Download</option>
                      </select>
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <label class="text-[10px] font-bold text-gray-500 mb-1">Description</label>
                    <input v-model="app.description" class="admin-input py-1.5 text-xs" placeholder="Task management app" />
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
            <h2 class="text-lg font-bold" style="color: var(--admin-text-primary);">Member Details</h2>
            <DialogClose class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-850 cursor-pointer">
              <X class="h-5 w-5 text-gray-500" />
            </DialogClose>
          </div>

          <div v-if="viewingMember" class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <img :src="viewingMember.portrait" class="h-16 w-16 rounded-full object-cover border" style="border-color: var(--admin-border);" />
              <div>
                <h4 class="text-xl font-bold">{{ viewingMember.name }}</h4>
                <p class="text-sm font-semibold" style="color: var(--admin-accent);">{{ viewingMember.role }} • {{ viewingMember.title }}</p>
              </div>
            </div>

            <div class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Bio</h5>
              <div class="prose max-w-none text-sm" v-html="viewingMember.bio"></div>
            </div>

            <div v-if="viewingMember.apps && viewingMember.apps.length > 0" class="border-t pt-3" style="border-color: var(--admin-border);">
              <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Apps ({{ viewingMember.apps.length }})</h5>
              <ul class="space-y-2">
                <li v-for="app in viewingMember.apps" :key="app.name" class="p-2.5 rounded-lg border text-sm" style="border-color: var(--admin-border); background-color: var(--admin-bg);">
                  <strong style="color: var(--admin-text-primary);">{{ app.name }}</strong> ({{ app.store }})
                  <p class="text-xs text-gray-500 mt-1">{{ app.description }}</p>
                  <a :href="app.url" target="_blank" class="text-xs underline block mt-1" style="color: var(--admin-accent);">Open App Link</a>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
