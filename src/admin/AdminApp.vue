<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const { role } = useAdminUser()
const currentUser = ref<User | null>(auth.currentUser)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

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
  <div class="admin-theme admin-layout min-h-screen flex text-[#111827] bg-white font-sans">
    <!-- Sidebar -->
    <aside class="admin-sidebar w-[240px] flex flex-col fixed inset-y-0 left-0 bg-[#f8f8f7] border-r border-gray-200">
      
      <!-- Top Branding -->
      <div class="p-6 flex items-center justify-between border-b border-gray-200/60 bg-white">
        <span class="font-display text-sm font-bold tracking-tighter text-[#6248d4]">
          SW·INDIE DEVS
        </span>
        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-gray-100 text-gray-500 uppercase border border-gray-200/50">
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

      <!-- Bottom Profile / Sign Out -->
      <div class="p-4 border-t border-gray-200 bg-white flex flex-col gap-3">
        <div class="flex flex-col text-left">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</span>
          <span class="text-xs font-semibold text-gray-700 truncate" :title="currentUser?.email || ''">
            {{ currentUser?.email || 'Admin User' }}
          </span>
        </div>
        <button
          @click="handleSignOut"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut class="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </div>

    </aside>

    <!-- Main Content Area -->
    <main class="admin-main flex-grow ml-[240px] min-h-screen bg-white">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import './admin.css';
</style>
