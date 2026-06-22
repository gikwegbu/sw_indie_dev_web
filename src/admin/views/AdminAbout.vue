<script setup lang="ts">
import { ref, watch } from 'vue'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { useDocument } from '@/composables/firebase/useDocument'
import { logAction } from '@/composables/firebase/useAuditLog'
import RichTextEditor from '../components/RichTextEditor.vue'

const { doc: settings, loading, error } = useDocument<any>('settings', 'global')

const aboutHtml = ref('')
const saving = ref(false)
const savedMessage = ref('')

watch(settings, (newVal) => {
  if (newVal && newVal.aboutHtml) {
    aboutHtml.value = newVal.aboutHtml
  }
}, { immediate: true })

const handleSave = async () => {
  saving.value = true
  savedMessage.value = ''
  try {
    const docRef = doc(db, 'settings', 'global')
    await setDoc(docRef, {
      aboutHtml: aboutHtml.value,
      updatedAt: serverTimestamp()
    }, { merge: true })

    await logAction({
      action: 'update',
      collection: 'settings',
      docId: 'global',
      performedBy: auth.currentUser?.uid || 'unknown',
      performedByEmail: auth.currentUser?.email || 'unknown',
      detail: 'Updated About body copy settings'
    })

    savedMessage.value = 'About settings saved successfully!'
    setTimeout(() => {
      savedMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error saving about settings:', err)
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
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">About Configuration</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">Manage the about page copy and public presentation text.</p>
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
      <div class="h-64 bg-gray-200 dark:bg-stone-850 rounded w-full"></div>
    </div>
    
    <div v-else class="rounded-2xl border p-6 flex flex-col gap-4 shadow-sm" style="border-color: var(--admin-border); background-color: var(--admin-card-bg); color: var(--admin-text-primary);">
      <form @submit.prevent="handleSave" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="admin-label font-bold">About Body Copy (HTML)</label>
          <RichTextEditor v-model="aboutHtml" placeholder="Write description about the community, organizers, vision..." />
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
