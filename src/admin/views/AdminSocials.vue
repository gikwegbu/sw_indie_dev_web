<script setup lang="ts">
import { ref, watch } from 'vue'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useDocument } from '@/composables/firebase/useDocument'
import { logAction } from '@/composables/firebase/useAuditLog'

const { doc: settings, loading, error } = useDocument<any>('settings', 'global')

const socials = ref({
  instagram: '',
  facebook: '',
  twitter: '',
  linkedin: ''
})
const saving = ref(false)
const savedMessage = ref('')

watch(settings, (newVal) => {
  if (newVal && newVal.socials) {
    socials.value = {
      instagram: newVal.socials.instagram || '',
      facebook: newVal.socials.facebook || '',
      twitter: newVal.socials.twitter || '',
      linkedin: newVal.socials.linkedin || ''
    }
  }
}, { immediate: true })

const handleSave = async () => {
  saving.value = true
  savedMessage.value = ''
  try {
    const docRef = doc(db, 'settings', 'global')
    await setDoc(docRef, {
      socials: {
        instagram: socials.value.instagram,
        facebook: socials.value.facebook,
        twitter: socials.value.twitter,
        linkedin: socials.value.linkedin
      },
      updatedAt: serverTimestamp()
    }, { merge: true })

    await logAction({
      action: 'update',
      collection: 'settings',
      docId: 'global',
      performedBy: auth.currentUser?.uid || 'unknown',
      performedByEmail: auth.currentUser?.email || 'unknown',
      detail: 'Updated social links settings'
    })

    savedMessage.value = 'Social settings saved successfully!'
    setTimeout(() => {
      savedMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error saving socials:', err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-8 flex flex-col gap-6 text-left">
    <!-- Header Page Row -->
    <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--admin-border);">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Social Coordinates</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage links to the circle's social channels.</p>
      </div>
    </div>

    <!-- Feedback Banners -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <div v-if="savedMessage" class="p-4 rounded-xl border text-sm bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400" style="border-color: var(--admin-border);">
      {{ savedMessage }}
    </div>

    <!-- Content Card -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-stone-850 rounded w-1/4"></div>
      <div class="h-10 bg-gray-200 dark:bg-stone-850 rounded w-full"></div>
      <div class="h-10 bg-gray-200 dark:bg-stone-850 rounded w-full"></div>
      <div class="h-10 bg-gray-200 dark:bg-stone-850 rounded w-full"></div>
    </div>
    
    <div v-else class="rounded-2xl border p-6 flex flex-col gap-4 shadow-sm" style="border-color: var(--admin-border); background-color: var(--admin-card-bg); color: var(--admin-text-primary);">
      <form @submit.prevent="handleSave" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="admin-label">Instagram URL</label>
            <input v-model="socials.instagram" type="url" class="admin-input" placeholder="https://instagram.com/username" />
          </div>
          <div class="flex flex-col">
            <label class="admin-label">Facebook URL</label>
            <input v-model="socials.facebook" type="url" class="admin-input" placeholder="https://facebook.com/username" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="admin-label">Twitter URL</label>
            <input v-model="socials.twitter" type="url" class="admin-input" placeholder="https://twitter.com/username" />
          </div>
          <div class="flex flex-col">
            <label class="admin-label">LinkedIn URL</label>
            <input v-model="socials.linkedin" type="url" class="admin-input" placeholder="https://linkedin.com/company/username" />
          </div>
        </div>

        <div class="flex justify-end border-t pt-4" style="border-color: var(--admin-border);">
          <button type="submit" :disabled="saving" class="admin-btn-primary">
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
