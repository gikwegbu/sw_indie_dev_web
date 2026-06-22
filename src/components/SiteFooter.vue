<template>
  <footer class="border-t border-border py-10 text-sm text-muted-foreground bg-bg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Left: Copyright -->
      <div class="text-center md:text-left">
        © {{ currentYear }} SW-Indie Devs. Made by makers, for makers.
      </div>

      <!-- Center: Social Icons -->
      <div class="flex items-center gap-4 justify-center md:justify-start">
        <a
          :href="resolvedSocials.instagram"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-brand transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1"
          aria-label="Instagram"
        >
          <Instagram class="h-5 w-5" />
        </a>
        <a
          :href="resolvedSocials.facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-brand transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1"
          aria-label="Facebook"
        >
          <Facebook class="h-5 w-5" />
        </a>
        <a
          :href="resolvedSocials.twitter"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-brand transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1"
          aria-label="Twitter"
        >
          <Twitter class="h-5 w-5" />
        </a>
        <a
          :href="resolvedSocials.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-brand transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-1"
          aria-label="LinkedIn"
        >
          <Linkedin class="h-5 w-5" />
        </a>
      </div>

      <!-- Right: Links -->
      <div class="flex items-center gap-6 justify-center md:justify-end">
        <a
          href="#about"
          class="hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1.5 py-0.5"
        >
          About
        </a>
        <a
          href="#showcase"
          class="hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1.5 py-0.5"
        >
          Showcase
        </a>
        <a
          href="#join"
          class="hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1.5 py-0.5"
        >
          Join
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-vue-next'

interface Socials {
  instagram?: string
  facebook?: string
  twitter?: string
  linkedin?: string
}

const props = withDefaults(
  defineProps<{
    socials?: Socials
  }>(),
  {
    socials: () => ({
      instagram: '#',
      facebook: '#',
      twitter: '#',
      linkedin: '#'
    })
  }
)

const resolvedSocials = computed(() => ({
  instagram: props.socials?.instagram || '#',
  facebook: props.socials?.facebook || '#',
  twitter: props.socials?.twitter || '#',
  linkedin: props.socials?.linkedin || '#'
}))

const currentYear = computed(() => new Date().getFullYear())
</script>

