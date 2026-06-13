<template>
  <section id="showcase" class="bg-surface/30 py-20 md:py-28 border-y border-border/40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-left max-w-3xl">
        <span class="text-xs font-bold uppercase tracking-widest text-brand">
          MEMBER SHOWCASE
        </span>
        <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Apps built by the community.
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          Tap any project to see screenshots, the story, and where to grab it.
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="project in projects"
          :key="project.name"
          @click="activeProject = project"
          class="group flex flex-col items-stretch text-left rounded-3xl border border-border bg-surface/40 overflow-hidden hover:border-brand/40 hover:-translate-y-1 hover:shadow-glow/5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
        >
          <!-- Cover Image Container -->
          <div class="relative aspect-[4/3] w-full overflow-hidden border-b border-border">
            <img
              :src="project.cover"
              :alt="project.name + ' app cover'"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <!-- Content Info -->
          <div class="flex flex-1 flex-col p-6">
            <span class="text-[10px] font-bold uppercase tracking-wider text-brand">
              BY {{ project.builder }}
            </span>
            <h3 class="mt-2 font-display text-2xl font-bold text-foreground">
              {{ project.name }}
            </h3>
            <p class="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">
              {{ project.tagline }}
            </p>

            <!-- Card Footer -->
            <div class="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
              <!-- First 2 Tags -->
              <div class="flex gap-1.5">
                <span
                  v-for="tag in project.tags.slice(0, 2)"
                  :key="tag"
                  class="rounded-full bg-surface/80 border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- Brand Affordance -->
              <span class="text-xs font-semibold text-brand group-hover:translate-x-0.5 transition-transform duration-200">
                View →
              </span>
            </div>
          </div>
        </button>
      </div>

      <!-- Project Dialog Modal -->
      <ProjectDialog :project="activeProject" @close="activeProject = null" />

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { projects } from '@/data/projects'
import type { Project } from '@/types'
import ProjectDialog from './ProjectDialog.vue'

const activeProject = ref<Project | null>(null)
</script>
