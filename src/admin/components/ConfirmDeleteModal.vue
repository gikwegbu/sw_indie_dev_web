<script setup lang="ts">
import { computed } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from 'radix-vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<template>
  <DialogRoot :open="isOpen" @update:open="isOpen = $event">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-200"
      />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg outline-none focus:outline-none flex flex-col text-left"
        style="background-color: var(--admin-card-bg); border-color: var(--admin-border); color: var(--admin-text-primary);"
      >
        <h3 class="text-lg font-bold" style="color: var(--admin-text-primary);">
          Move to bin?
        </h3>
        <p class="text-sm mt-2" style="color: var(--admin-text-secondary);">
          This will be removed from the site and permanently deleted after 30 days.
        </p>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 border rounded-lg text-sm font-semibold hover:opacity-85 transition-all cursor-pointer"
            style="border-color: var(--admin-border); color: var(--admin-text-secondary); background-color: var(--admin-bg);"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleConfirm"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer"
          >
            Move to bin
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
