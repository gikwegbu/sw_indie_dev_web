<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/firebase'
import { useAdminUser } from './useAdminUser'
import {
  Users,
  AppWindow,
  Star,
  CalendarPlus,
  CalendarCheck,
  Heart,
  FileText,
  Share2,
  Image as ImageIcon,
  Activity,
  LogOut,
  Sun,
  Moon
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { role } = useAdminUser()
const currentUser = ref<User | null>(auth.currentUser)
const showErrorBanner = ref(false)

watch(() => route.query.error, (newVal) => {
  if (newVal === 'unauthorised') {
    showErrorBanner.value = true
  }
}, { immediate: true })

onMounted(() => {
  const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
  if (link) {
    link.href = '/favicon-admin.svg'
  }
})

onUnmounted(() => {
  const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
  if (link) {
    link.href = '/favicon.svg'
  }
})

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

const theme = ref<'light' | 'dark'>(
  (localStorage.getItem('admin-theme') as 'light' | 'dark') || 'dark'
)

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('admin-theme', theme.value)
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    router.push('/xxy_admin/login')
  } catch (err) {
    console.error('Sign out error:', err)
  }
}
</script>

<template>
  <div :class="[theme === 'light' ? 'admin-theme-light' : 'admin-theme-dark']" class="admin-layout min-h-screen flex font-sans">
    <!-- Sidebar -->
    <aside class="admin-sidebar w-[240px] flex flex-col fixed inset-y-0 left-0">
      
      <!-- Top Branding -->
      <div class="p-6 flex items-center justify-between border-b" style="background-color: var(--admin-card-bg); border-color: var(--admin-border);">
        <span class="font-display text-sm font-bold tracking-tighter text-[#6248d4]" style="color: var(--admin-accent);">
          SW·INDIE DEVS
        </span>
        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border" style="background-color: var(--admin-bg); color: var(--admin-text-secondary); border-color: var(--admin-border);">
          Admin
        </span>
      </div>

      <!-- Navigation Content -->
      <nav class="flex-1 overflow-y-auto py-4 text-left">
        <!-- Content Management -->
        <div class="admin-nav-header">Content</div>
        <RouterLink to="/xxy_admin/members" class="admin-nav-link">
          <Users class="h-4 w-4 shrink-0" />
          <span>Members</span>
        </RouterLink>
        <RouterLink to="/xxy_admin/projects" class="admin-nav-link">
          <AppWindow class="h-4 w-4 shrink-0" />
          <span>Projects</span>
        </RouterLink>
        <RouterLink to="/xxy_admin/featured" class="admin-nav-link">
          <Star class="h-4 w-4 shrink-0" />
          <span>Featured Project</span>
        </RouterLink>

        <!-- Events -->
        <div class="admin-nav-header">Events</div>
        <RouterLink to="/xxy_admin/events/upcoming" class="admin-nav-link">
          <CalendarPlus class="h-4 w-4 shrink-0" />
          <span>Upcoming Events</span>
        </RouterLink>
        <RouterLink to="/xxy_admin/events/past" class="admin-nav-link">
          <CalendarCheck class="h-4 w-4 shrink-0" />
          <span>Past Events</span>
        </RouterLink>

        <!-- Community -->
        <div class="admin-nav-header">Community</div>
        <RouterLink to="/xxy_admin/outreach" class="admin-nav-link">
          <Heart class="h-4 w-4 shrink-0" />
          <span>Outreach</span>
        </RouterLink>

        <!-- Settings -->
        <div class="admin-nav-header">Settings</div>
        <RouterLink to="/xxy_admin/settings/about" class="admin-nav-link">
          <FileText class="h-4 w-4 shrink-0" />
          <span>About Section</span>
        </RouterLink>
        <RouterLink to="/xxy_admin/settings/socials" class="admin-nav-link">
          <Share2 class="h-4 w-4 shrink-0" />
          <span>Social Links</span>
        </RouterLink>
        <RouterLink to="/xxy_admin/settings/hero" class="admin-nav-link">
          <ImageIcon class="h-4 w-4 shrink-0" />
          <span>Hero Images</span>
        </RouterLink>

        <!-- Audit Log (SuperAdmin Only) -->
        <template v-if="role === 'superAdmin'">
          <div class="admin-nav-header">Audit Log</div>
          <RouterLink to="/xxy_admin/audit" class="admin-nav-link">
            <Activity class="h-4 w-4 shrink-0" />
            <span>Audit Log</span>
          </RouterLink>
        </template>
      </nav>

      <!-- Bottom Profile / Sign Out / Theme Toggle -->
      <div class="p-4 border-t flex flex-col gap-3" style="background-color: var(--admin-card-bg); border-color: var(--admin-border);">
        <div class="flex items-center justify-between">
          <div class="flex flex-col text-left truncate max-w-[140px]">
            <span class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--admin-text-muted);">Signed in as</span>
            <span class="text-xs font-semibold truncate" style="color: var(--admin-text-primary);" :title="currentUser?.email || ''">
              {{ currentUser?.email || 'Admin User' }}
            </span>
          </div>
          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg border hover:opacity-85 transition-all cursor-pointer"
            style="background-color: var(--admin-bg); border-color: var(--admin-border); color: var(--admin-text-secondary);"
            :title="theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
          >
            <Sun v-if="theme === 'dark'" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </button>
        </div>
        <button
          @click="handleSignOut"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border hover:opacity-85 text-xs font-semibold transition-all cursor-pointer"
          style="background-color: var(--admin-bg); border-color: var(--admin-border); color: var(--admin-text-secondary);"
        >
          <LogOut class="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </div>

    </aside>

    <!-- Main Content Area -->
    <main class="admin-main flex-grow ml-[240px] min-h-screen flex flex-col">
      <div v-if="showErrorBanner" class="mx-8 mt-8 p-4 rounded-xl border flex items-center justify-between text-sm bg-red-50 text-red-700 border-red-200">
        <span>You do not have permission to access that page.</span>
        <button @click="showErrorBanner = false" class="text-red-700 hover:opacity-75 font-bold text-lg cursor-pointer px-2">×</button>
      </div>
      <RouterView />
    </main>
  </div>
</template>

<style>
@import './admin.css';
</style>
