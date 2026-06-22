<script setup lang="ts">
import { PlusCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl text-center" style="border-color: var(--admin-border); background-color: var(--admin-card-bg);">
    <PlusCircle class="h-12 w-12 mb-4" style="color: var(--admin-text-muted);" />
    <h3 class="text-base font-bold mb-1" style="color: var(--admin-text-primary);">
      Nothing here yet
    </h3>
    <p class="text-sm" style="color: var(--admin-text-secondary);">
      Click the + button above to add your first entry.
    </p>
  </div>
</template>
