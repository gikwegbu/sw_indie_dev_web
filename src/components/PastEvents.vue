<script setup lang="ts">
import { ref } from 'vue'
import { usePastEvents } from '@/composables/firebase/usePastEvents'
import type { PastEvent } from '@/types'
import PastEventDialog from './PastEventDialog.vue'



const { docs: pastEvents, loading, error } = usePastEvents()

const activeEvent = ref<PastEvent | null>(null)

function formatEventDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
</script>

<template>
  <section id="past-events" class="bg-surface/30 py-24 border-t border-border/40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-left max-w-3xl">
        <span class="text-xs font-bold uppercase tracking-widest text-brand">
          PAST EVENTS
        </span>
        <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          What we've been up to.
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
            <div class="h-5 w-3/4 bg-border/20 rounded"></div>
            <div class="h-3 w-1/4 bg-border/20 rounded"></div>
            <div class="h-4 w-5/6 bg-border/20 rounded"></div>
            <div class="h-4 w-12 bg-border/20 rounded mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
        Failed to load past events: {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="pastEvents.length === 0" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
        No past events found. Check back later!
      </div>

      <!-- Past Events Grid -->
      <div v-else class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="event in pastEvents"
          :key="event.id"
          @click="activeEvent = event"
          class="group flex flex-col text-left rounded-3xl border border-border bg-surface/40 overflow-hidden hover:-translate-y-1 hover:border-brand transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
        >
          <!-- Cover Image -->
          <div class="relative aspect-[4/3] w-full overflow-hidden border-b border-border/40">
            <img
              :src="event.coverImage"
              :alt="event.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
              loading="lazy"
            />
          </div>

          <!-- Content Card Info -->
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-display text-lg font-bold text-foreground group-hover:text-brand transition-colors duration-200">
              {{ event.title }}
            </h3>
            <p class="text-xs text-muted-foreground font-medium mt-1">
              {{ formatEventDate(event.date) }}
            </p>
            <p class="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-2">
              {{ event.description }}
            </p>
            
            <span class="text-xs font-bold text-brand mt-4 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View talks & details →
            </span>
          </div>
        </button>
      </div>

    </div>

    <!-- Past Event Dialog Modal -->
    <PastEventDialog :event="activeEvent" @close="activeEvent = null" />
  </section>
</template>
