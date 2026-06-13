<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import PillarsSection from '@/components/PillarsSection.vue'
import ShowcaseSection from '@/components/ShowcaseSection.vue'
import MembersSection from '@/components/MembersSection.vue'
import JoinSection from '@/components/JoinSection.vue'
import SiteFooter from '@/components/SiteFooter.vue'
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

    <!-- Navigation Header -->
    <NavBar />

    <!-- Page Content (Sections in exact order) -->
    <main class="flex-grow">
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <ShowcaseSection />
      <MembersSection />
      <JoinSection />
    </main>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>
