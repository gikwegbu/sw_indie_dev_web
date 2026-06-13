<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from 'radix-vue'
import { X } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <DialogRoot :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-bg/70 backdrop-blur-md transition-all duration-300 ease-out"
      />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-surface p-6 md:p-8 shadow-glow outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-all duration-300 ease-out"
      >
        <slot />
        
        <DialogClose
          class="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          aria-label="Close dialog"
        >
          <X class="h-5 w-5" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
