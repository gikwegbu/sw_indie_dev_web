<template>
  <footer class="border-t border-border py-10 text-sm text-muted-foreground bg-bg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Left: Copyright -->
      <div>
        © {{ currentYear }} SW-Indie Devs. Made by makers, for makers.
      </div>

      <!-- Right: Links -->
      <div class="flex items-center gap-6">
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

const currentYear = computed(() => new Date().getFullYear())
</script>
