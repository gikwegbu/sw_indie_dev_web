<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import PillarsSection from '@/components/PillarsSection.vue'
import ShowcaseSection from '@/components/ShowcaseSection.vue'
import MembersSection from '@/components/MembersSection.vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import PastEvents from '@/components/PastEvents.vue'
import CommunityOutreach from '@/components/CommunityOutreach.vue'
import JoinSection from '@/components/JoinSection.vue'
import SiteFooter from '@/components/SiteFooter.vue'

import SplashScreen from '@/components/SplashScreen.vue'
import { splashDone, markSplashDone } from '@/composables/useSplash'

const route = useRoute()

const socials = {
  instagram: '#',
  facebook: '#',
  twitter: '#',
  linkedin: '#'
}
</script>

<template>
  <div class="min-h-screen bg-bg text-foreground flex flex-col font-sans selection:bg-brand/35 selection:text-brand-foreground">
    <!-- Toast Notifier -->
    <Toaster
      position="top-right"
      theme="dark"
      :toastOptions="{
        style: {
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-foreground)',
          fontFamily: 'var(--font-sans)',
          borderRadius: 'var(--radius-xl)'
        }
      }"
    />

    <!-- Splash Screen (only shown on marketing paths) -->
    <SplashScreen v-if="!splashDone && !route.path.startsWith('/xxy_admin')" @done="markSplashDone" />

    <!-- Main Content Transition -->
    <Transition name="fade-in">
      <div v-if="splashDone || route.path.startsWith('/xxy_admin')" class="flex flex-col flex-grow">
        <template v-if="!route.path.startsWith('/xxy_admin')">
          <!-- Navigation Header -->
          <NavBar />

          <!-- Page Content (Sections in exact order) -->
          <main class="flex-grow">
            <HeroSection />
            <AboutSection />
            <PillarsSection />
            <ShowcaseSection />
            <MembersSection />
            <UpcomingEvents />
            <PastEvents />
            <CommunityOutreach />
            <JoinSection />
          </main>

          <!-- Footer -->
          <SiteFooter :socials="socials" />
        </template>
        <template v-else>
          <!-- Router view for admin panel -->
          <RouterView />
        </template>
      </div>
    </Transition>
  </div>
</template>


