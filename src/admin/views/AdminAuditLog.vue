<script setup lang="ts">
import { useAuditEntries } from '@/composables/firebase/useAuditLog'
import ShimmerTable from '../components/ShimmerTable.vue'
import EmptyState from '../components/EmptyState.vue'

const { docs: entries, loading, error } = useAuditEntries(50)

const formatDate = (val: any) => {
  if (!val) return '—'
  if (val.seconds) {
    return new Date(val.seconds * 1000).toLocaleString()
  }
  return new Date(val).toLocaleString()
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'create':
      return 'text-green-600 dark:text-green-400 font-semibold'
    case 'update':
      return 'text-blue-600 dark:text-blue-400 font-semibold'
    case 'delete':
      return 'text-red-600 dark:text-red-400 font-semibold'
    default:
      return 'text-gray-600 dark:text-stone-400 font-semibold'
  }
}
</script>

<template>
  <div class="p-8 flex flex-col gap-6 text-left">
    <!-- Header Page Row -->
    <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--admin-border);">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Audit Logs</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">History of CMS mutation actions performed by administrators.</p>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- View Content Wrapper -->
    <ShimmerTable v-if="loading" />
    <EmptyState v-else-if="entries.length === 0" />
    
    <div v-else class="w-full overflow-x-auto border rounded-2xl" style="border-color: var(--admin-border); background-color: var(--admin-card-bg);">
      <table class="w-full border-collapse text-sm text-left">
        <thead>
          <tr class="border-b" style="border-color: var(--admin-border); background-color: var(--admin-sidebar-bg);">
            <th class="p-4 font-bold" style="width: 180px; color: var(--admin-text-secondary);">Timestamp</th>
            <th class="p-4 font-bold" style="width: 200px; color: var(--admin-text-secondary);">Operator</th>
            <th class="p-4 font-bold" style="width: 100px; color: var(--admin-text-secondary);">Action</th>
            <th class="p-4 font-bold" style="width: 120px; color: var(--admin-text-secondary);">Collection</th>
            <th class="p-4 font-bold" style="color: var(--admin-text-secondary);">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, idx) in entries"
            :key="entry.id"
            class="border-b transition-colors last:border-b-0"
            :style="{
              borderColor: 'var(--admin-border)',
              backgroundColor: idx % 2 === 1 ? 'var(--admin-table-stripe)' : 'var(--admin-bg)'
            }"
          >
            <td class="p-4 text-left font-medium" style="color: var(--admin-text-primary);">
              {{ formatDate(entry.timestamp) }}
            </td>
            <td class="p-4 text-left" style="color: var(--admin-text-primary);">
              {{ entry.performedByEmail }}
            </td>
            <td class="p-4 text-left">
              <span :class="getActionColor(entry.action)">
                {{ entry.action.toUpperCase() }}
              </span>
            </td>
            <td class="p-4 text-left" style="color: var(--admin-text-primary);">
              {{ entry.collection }}
            </td>
            <td class="p-4 text-left" style="color: var(--admin-text-secondary);">
              {{ entry.detail || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
