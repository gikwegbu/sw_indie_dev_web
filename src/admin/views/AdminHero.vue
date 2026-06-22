<script setup lang="ts">
import { ref, watch } from 'vue'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useDocument } from '@/composables/firebase/useDocument'
import { logAction } from '@/composables/firebase/useAuditLog'

const { doc: settings, loading, error } = useDocument<any>('settings', 'global')

const heroImages = ref(['', '', ''])
const saving = ref(false)
const savedMessage = ref('')

watch(settings, (newVal) => {
  if (newVal && newVal.heroImages && Array.isArray(newVal.heroImages)) {
    heroImages.value = [
      newVal.heroImages[0] || '',
      newVal.heroImages[1] || '',
      newVal.heroImages[2] || ''
    ]
  }
}, { immediate: true })

const handleSave = async () => {
  saving.value = true
  savedMessage.value = ''
  try {
    const docRef = doc(db, 'settings', 'global')
    await setDoc(docRef, {
      heroImages: [
        heroImages.value[0],
        heroImages.value[1],
        heroImages.value[2]
      ],
      updatedAt: serverTimestamp()
    }, { merge: true })

    await logAction({
      action: 'update',
      collection: 'settings',
      docId: 'global',
      performedBy: auth.currentUser?.uid || 'unknown',
      performedByEmail: auth.currentUser?.email || 'unknown',
      detail: 'Updated Hero images settings'
    })

    savedMessage.value = 'Hero images settings saved successfully!'
    setTimeout(() => {
      savedMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error saving hero images:', err)
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
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Hero Images Configuration</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage the showcase slide images displayed on the home hero section.</p>
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
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <label class="admin-label font-semibold">Hero showcase image 1</label>
            <input v-model="heroImages[0]" required type="url" class="admin-input" placeholder="https://images.unsplash.com/photo-..." />
          </div>
          
          <div class="flex flex-col">
            <label class="admin-label font-semibold">Hero showcase image 2</label>
            <input v-model="heroImages[1]" required type="url" class="admin-input" placeholder="https://images.unsplash.com/photo-..." />
          </div>

          <div class="flex flex-col">
            <label class="admin-label font-semibold">Hero showcase image 3</label>
            <input v-model="heroImages[2]" required type="url" class="admin-input" placeholder="https://images.unsplash.com/photo-..." />
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
