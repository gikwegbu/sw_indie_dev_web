<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import Dialog from './ui/Dialog.vue'
import Carousel from './ui/Carousel.vue'
import { Apple, Play, Globe, Download } from 'lucide-vue-next'

const props = defineProps<{
  project: Project | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.project !== null,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})

const getIconComponent = (icon: "apple" | "play" | "web" | "download") => {
  switch (icon) {
    case 'apple': return Apple
    case 'play': return Play
    case 'web': return Globe
    case 'download': return Download
    default: return Globe
  }
}
</script>

<template>
  <Dialog v-model="isOpen">
    <div v-if="project" class="flex flex-col gap-6">
      
      <!-- Header -->
      <div class="flex flex-col items-start text-left">
        <span class="text-xs font-bold uppercase tracking-wider text-brand">
          BY {{ project.builder }}
        </span>
        <h3 class="mt-2 font-display text-3xl font-extrabold text-foreground">
          {{ project.name }}
        </h3>
        <p class="mt-1 text-base text-muted-foreground">
          {{ project.tagline }}
        </p>
      </div>

      <!-- Screenshot Carousel -->
      <div class="w-full">
        <Carousel :slides="project.screenshots" />
      </div>

      <!-- Description and Details -->
      <div class="flex flex-col gap-4 text-left">
        <h4 class="text-sm font-semibold uppercase tracking-wider text-foreground">
          About the project
        </h4>
        <p class="text-sm text-muted-foreground leading-relaxed">
          {{ project.description }}
        </p>
      </div>

      <!-- Monetisation Section -->
      <div class="rounded-2xl border border-border bg-bg/40 p-5 text-left">
        <h4 class="text-xs font-bold uppercase tracking-widest text-accent">
          MONETISATION LOG
        </h4>
        <p class="mt-2 text-sm text-foreground leading-relaxed font-medium">
          {{ project.monetisation }}
        </p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="rounded-full bg-surface/50 border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Links Footer -->
      <div class="mt-4 flex flex-wrap gap-4 border-t border-border pt-6">
        <a
          v-for="link in project.links"
          :key="link.label"
          :href="link.url"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface hover:bg-brand hover:text-brand-foreground hover:border-brand px-5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer text-foreground"
        >
          <component :is="getIconComponent(link.icon)" class="h-4 w-4" />
          {{ link.label }}
        </a>
      </div>
      
    </div>
  </Dialog>
</template>
