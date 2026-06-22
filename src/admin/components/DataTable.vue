<script setup lang="ts">
import { ref } from 'vue'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'

defineProps<{
  columns: { key: string; label: string; width?: string }[]
  rows: Record<string, any>[]
}>()

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const showDeleteModal = ref(false)
const targetDeleteId = ref('')

const openDeleteConfirm = (id: string) => {
  targetDeleteId.value = id
  showDeleteModal.value = true
}

const handleDeleteConfirm = () => {
  if (targetDeleteId.value) {
    emit('delete', targetDeleteId.value)
  }
}
</script>

<template>
  <div class="w-full overflow-x-auto border rounded-2xl" style="border-color: var(--admin-border); background-color: var(--admin-card-bg);">
    <table class="w-full border-collapse text-sm text-left">
      <thead>
        <tr class="border-b" style="border-color: var(--admin-border); background-color: var(--admin-sidebar-bg);">
          <th
            v-for="col in columns"
            :key="col.key"
            class="p-4 font-bold"
            :style="{ width: col.width || 'auto' }"
            style="color: var(--admin-text-secondary);"
          >
            {{ col.label }}
          </th>
          <th class="p-4 font-bold text-right" style="width: 120px; color: var(--admin-text-secondary);">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="row.id"
          class="border-b transition-colors last:border-b-0"
          :style="{
            borderColor: 'var(--admin-border)',
            backgroundColor: idx % 2 === 1 ? 'var(--admin-table-stripe)' : 'var(--admin-bg)'
          }"
        >
          <!-- Dynamic Cell Rendering slot -->
          <td v-for="col in columns" :key="col.key" class="p-4 text-left" style="color: var(--admin-text-primary);">
            <slot :name="`cell(${col.key})`" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
          <!-- Actions Cell -->
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                @click="emit('view', row.id)"
                class="p-1.5 rounded hover:opacity-85 text-gray-500 cursor-pointer"
                style="background-color: var(--admin-sidebar-bg); border: 1px solid var(--admin-border); color: var(--admin-text-secondary);"
                title="View details"
              >
                <Eye class="h-4 w-4" />
              </button>
              <button
                type="button"
                @click="emit('edit', row.id)"
                class="p-1.5 rounded hover:opacity-85 text-gray-500 cursor-pointer"
                style="background-color: var(--admin-sidebar-bg); border: 1px solid var(--admin-border); color: var(--admin-text-secondary);"
                title="Edit entry"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                type="button"
                @click="openDeleteConfirm(row.id)"
                class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 cursor-pointer"
                style="border: 1px solid var(--admin-border);"
                title="Move to bin"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmDeleteModal
      v-model:open="showDeleteModal"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
