<template>
  <div class="w-full overflow-hidden border border-dashed rounded-2xl p-6" style="border-color: var(--admin-border); background-color: var(--admin-card-bg);">
    <div class="animate-pulse space-y-5">
      <!-- Header Row -->
      <div class="flex gap-4 border-b pb-4" style="border-color: var(--admin-border);">
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.6;"></div>
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.6;"></div>
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.6;"></div>
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.6;"></div>
      </div>
      <!-- Data Rows -->
      <div v-for="i in 5" :key="i" class="flex gap-4 py-1">
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.4;"></div>
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.4;"></div>
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.4;"></div>
        <div class="h-4 w-1/4 rounded" style="background-color: var(--admin-border); opacity: 0.4;"></div>
      </div>
    </div>
  </div>
</template>
