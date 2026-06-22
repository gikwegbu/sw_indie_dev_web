<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuditEntries } from '@/composables/firebase/useAuditLog'
import ShimmerTable from '../components/ShimmerTable.vue'
import { Download } from 'lucide-vue-next'

const { docs: entries, loading, error } = useAuditEntries(200)

// Filters state
const selectedCollection = ref('All')
const selectedAction = ref('All')
const filterFrom = ref('')
const filterTo = ref('')

const collections = [
  'All',
  'members',
  'projects',
  'upcomingEvents',
  'pastEvents',
  'outreach',
  'settings'
]

const actions = [
  'All',
  'create',
  'update',
  'delete',
  'restore',
  'login',
  'logout'
]

// Client-side filtering logic
const filteredEntries = computed(() => {
  return entries.value.filter(entry => {
    // 1. Collection filter
    if (selectedCollection.value !== 'All' && entry.collection !== selectedCollection.value) {
      return false
    }

    // 2. Action filter
    if (selectedAction.value !== 'All' && entry.action !== selectedAction.value) {
      return false
    }

    // 3. Date-range filter
    if (filterFrom.value || filterTo.value) {
      if (!entry.timestamp) return false
      
      const date = entry.timestamp && typeof (entry.timestamp as any).toDate === 'function'
        ? (entry.timestamp as any).toDate()
        : entry.timestamp && typeof (entry.timestamp as any).seconds === 'number'
          ? new Date((entry.timestamp as any).seconds * 1000)
          : new Date(entry.timestamp as any)
      
      const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD

      if (filterFrom.value && dateStr < filterFrom.value) {
        return false
      }
      if (filterTo.value && dateStr > filterTo.value) {
        return false
      }
    }

    return true
  })
})

// Date formatter: "14 Jun 2025, 6:42 PM"
const formatTimestamp = (val: any) => {
  if (!val) return '—'
  
  let date: Date
  if (typeof val.toDate === 'function') {
    date = val.toDate()
  } else if (typeof val.seconds === 'number') {
    date = new Date(val.seconds * 1000)
  } else {
    date = new Date(val)
  }
  
  const day = date.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`
}

const getActionClass = (action: string) => {
  switch (action) {
    case 'create':
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
    case 'update':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
    case 'delete':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
    case 'restore':
      return 'bg-amber-500/10 text-amber-650 dark:text-amber-400 border border-amber-500/20'
    case 'login':
    case 'logout':
    default:
      return 'bg-gray-500/10 text-gray-650 dark:text-stone-400 border border-gray-500/20'
  }
}

// Export filtered data to CSV and download
const exportToCSV = () => {
  const headers = ['Timestamp', 'Performed By', 'Action', 'Collection', 'Doc ID', 'Detail']
  
  const rows = filteredEntries.value.map(entry => {
    const timeStr = formatTimestamp(entry.timestamp)
    const email = entry.performedByEmail || ''
    const act = entry.action || ''
    const col = entry.collection || ''
    const docId = entry.docId || ''
    const detail = entry.detail || ''
    
    const escapedDetail = detail.replace(/"/g, '""')
    
    return [
      `"${timeStr}"`,
      `"${email}"`,
      `"${act}"`,
      `"${col}"`,
      `"${docId}"`,
      `"${escapedDetail}"`
    ]
  })
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `audit_log_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="p-8 flex flex-col gap-6 text-left">
    <!-- Header Page Row -->
    <div class="flex items-center justify-between border-b pb-4" style="border-color: var(--admin-border);">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--admin-text-primary);">Audit log</h1>
        <p class="text-sm mt-1" style="color: var(--admin-text-secondary);">A record of all administrative actions on this platform.</p>
      </div>
      <!-- Export CSV Button -->
      <button
        v-if="!loading && entries.length > 0"
        @click="exportToCSV"
        class="flex items-center gap-2 bg-[#6248d4] text-white rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-[#5037be] active:scale-[0.98] transition-all"
      >
        <Download class="h-4 w-4" />
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-xl border text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" style="border-color: var(--admin-border);">
      Error connecting to database: {{ error }}
    </div>

    <!-- Filter Bar -->
    <div v-if="!loading" class="flex flex-wrap gap-4 items-end p-4 rounded-xl border bg-gray-50/20" style="border-color: var(--admin-border);">
      <!-- Collection Filter -->
      <div class="flex flex-col flex-1 min-w-[150px]">
        <label class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Collection</label>
        <select v-model="selectedCollection" class="admin-input py-2 text-xs" style="appearance: auto;">
          <option v-for="col in collections" :key="col" :value="col">{{ col }}</option>
        </select>
      </div>

      <!-- Action Filter -->
      <div class="flex flex-col flex-1 min-w-[150px]">
        <label class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Action</label>
        <select v-model="selectedAction" class="admin-input py-2 text-xs" style="appearance: auto;">
          <option v-for="act in actions" :key="act" :value="act">{{ act }}</option>
        </select>
      </div>

      <!-- Date From -->
      <div class="flex flex-col flex-1 min-w-[150px]">
        <label class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">From</label>
        <input type="date" v-model="filterFrom" class="admin-input py-1.5 text-xs" />
      </div>

      <!-- Date To -->
      <div class="flex flex-col flex-1 min-w-[150px]">
        <label class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">To</label>
        <input type="date" v-model="filterTo" class="admin-input py-1.5 text-xs" />
      </div>
    </div>

    <!-- View Content Wrapper -->
    <ShimmerTable v-if="loading" />
    
    <div v-else-if="filteredEntries.length === 0" class="p-12 text-center text-sm font-semibold border border-dashed rounded-2xl flex items-center justify-center" style="border-color: var(--admin-border); color: var(--admin-text-secondary);">
      No activity recorded yet.
    </div>
    
    <div v-else class="w-full overflow-x-auto border rounded-2xl" style="border-color: var(--admin-border); background-color: var(--admin-card-bg);">
      <table class="w-full border-collapse text-sm text-left">
        <thead>
          <tr class="border-b" style="border-color: var(--admin-border); background-color: var(--admin-sidebar-bg);">
            <th class="p-4 font-bold" style="width: 180px; color: var(--admin-text-secondary);">Timestamp</th>
            <th class="p-4 font-bold" style="width: 220px; color: var(--admin-text-secondary);">Performed by</th>
            <th class="p-4 font-bold" style="width: 100px; color: var(--admin-text-secondary);">Action</th>
            <th class="p-4 font-bold" style="width: 130px; color: var(--admin-text-secondary);">Collection</th>
            <th class="p-4 font-bold" style="width: 150px; color: var(--admin-text-secondary);">Doc ID</th>
            <th class="p-4 font-bold" style="color: var(--admin-text-secondary);">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, idx) in filteredEntries"
            :key="entry.id"
            class="border-b transition-colors last:border-b-0"
            :style="{
              borderColor: 'var(--admin-border)',
              backgroundColor: idx % 2 === 1 ? 'var(--admin-table-stripe)' : 'var(--admin-bg)'
            }"
          >
            <!-- Timestamp formatted -->
            <td class="p-4 text-left font-medium" style="color: var(--admin-text-primary);">
              {{ formatTimestamp(entry.timestamp) }}
            </td>
            
            <!-- Performed by (email) -->
            <td class="p-4 text-left" style="color: var(--admin-text-primary);">
              {{ entry.performedByEmail || '—' }}
            </td>
            
            <!-- Action (coloured badge) -->
            <td class="p-4 text-left">
              <span :class="getActionClass(entry.action)" class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block text-center uppercase tracking-wide">
                {{ entry.action }}
              </span>
            </td>
            
            <!-- Collection -->
            <td class="p-4 text-left font-mono text-xs" style="color: var(--admin-text-primary);">
              {{ entry.collection || '—' }}
            </td>

            <!-- Doc ID -->
            <td class="p-4 text-left font-mono text-xs truncate max-w-[150px]" style="color: var(--admin-text-primary);" :title="entry.docId">
              {{ entry.docId || '—' }}
            </td>
            
            <!-- Detail (truncated 60 chars, full on hover tooltip) -->
            <td class="p-4 text-left" style="color: var(--admin-text-secondary);">
              <span :title="entry.detail">
                {{ entry.detail && entry.detail.length > 60 ? entry.detail.slice(0, 60) + '...' : (entry.detail || '—') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
