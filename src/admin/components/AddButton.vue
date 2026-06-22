<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineProps<{
  label: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    type="button"
    @click="emit('click')"
    class="flex items-center gap-2 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shrink-0"
    style="background-color: var(--admin-accent);"
  >
    <Plus class="h-4 w-4" />
    <span>Add {{ label }}</span>
  </button>
</template>
