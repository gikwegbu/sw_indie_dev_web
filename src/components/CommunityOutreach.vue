<script setup lang="ts">
import { ref } from 'vue'
import { useOutreach } from '@/composables/firebase/useOutreach'
import type { OutreachActivity } from '@/types'
import OutreachDialog from './OutreachDialog.vue'

const { docs: activities, loading, error } = useOutreach()

const activeActivity = ref<OutreachActivity | null>(null)
</script>

<template>
  <section id="outreach" class="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-border/40">
    <!-- Header -->
    <div class="text-left max-w-3xl">
      <span class="text-xs font-bold uppercase tracking-widest text-brand">
        COMMUNITY OUTREACH
      </span>
      <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        Beyond code, into the community.
      </h2>
    </div>

    <!-- Loading Shimmer State -->
    <div v-if="loading" class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse flex flex-col rounded-3xl border border-border bg-surface/20 overflow-hidden"
      >
        <div class="relative aspect-[4/3] w-full bg-border/20 border-b border-border/40"></div>
        <div class="p-6 flex flex-col flex-grow space-y-4">
          <div class="flex gap-2">
            <div class="h-4 w-12 bg-border/20 rounded-full"></div>
            <div class="h-4 w-12 bg-border/20 rounded-full"></div>
          </div>
          <div class="h-5 w-3/4 bg-border/20 rounded"></div>
          <div class="h-4 w-5/6 bg-border/20 rounded"></div>
          <div class="h-4 w-12 bg-border/20 rounded mt-auto"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
      Failed to load outreach activities: {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="activities.length === 0" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
      No community outreach activities found. Check back later!
    </div>

    <!-- Outreach Activities Grid -->
    <div v-else class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="activity in activities"
        :key="activity.id"
        @click="activeActivity = activity"
        class="group flex flex-col text-left rounded-3xl border border-border bg-surface/40 overflow-hidden hover:-translate-y-1 hover:border-brand transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
      >
        <!-- Cover Image -->
        <div class="relative aspect-[4/3] w-full overflow-hidden border-b border-border/40">
          <img
            :src="activity.coverImage"
            :alt="activity.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        </div>

        <!-- Content Details -->
        <div class="p-6 flex flex-col flex-grow">
          <!-- Tag pills (first 2) -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in activity.tags.slice(0, 2)"
              :key="tag"
              class="px-2.5 py-0.5 text-xs rounded-full border border-border text-muted-foreground font-medium"
            >
              {{ tag }}
            </span>
          </div>

          <h3 class="font-display text-lg font-bold text-foreground group-hover:text-brand transition-colors duration-200 line-clamp-1">
            {{ activity.title }}
          </h3>
          
          <p class="text-sm text-muted-foreground mt-2.5 leading-relaxed line-clamp-2">
            {{ activity.summary }}
          </p>

          <span class="text-xs font-bold text-brand mt-4 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform mt-auto">
            View photos & details →
          </span>
        </div>
      </button>
    </div>

    <!-- Outreach Dialog Modal -->
    <OutreachDialog :activity="activeActivity" @close="activeActivity = null" />
  </section>
</template>
