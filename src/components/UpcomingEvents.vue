<script setup lang="ts">
import { Calendar, MapPin } from 'lucide-vue-next'
import { useUpcomingEvents } from '@/composables/firebase/useUpcomingEvents'


const { docs: events, loading, error } = useUpcomingEvents()

function formatEventDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
</script>

<template>
  <section id="events" class="py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-border/40">
    <!-- Header -->
    <div class="text-left max-w-3xl">
      <span class="text-xs font-bold uppercase tracking-widest text-brand">
        UPCOMING EVENTS
      </span>
      <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        Come meet us in person.
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Join the next meetup — share what you're building and meet the people behind the apps.
      </p>
    </div>

    <!-- Loading Shimmer State -->
    <div v-if="loading" class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse flex flex-col rounded-3xl border border-border bg-surface/20 overflow-hidden"
      >
        <div class="relative aspect-[16/9] w-full bg-border/20"></div>
        <div class="p-6 flex flex-col flex-grow space-y-4">
          <div class="flex gap-2">
            <div class="h-4 w-12 bg-border/20 rounded-full"></div>
            <div class="h-4 w-12 bg-border/20 rounded-full"></div>
          </div>
          <div class="h-6 w-3/4 bg-border/20 rounded"></div>
          <div class="h-4 w-1/2 bg-border/20 rounded"></div>
          <div class="h-4 w-5/6 bg-border/20 rounded"></div>
          <div class="h-4 w-2/3 bg-border/20 rounded"></div>
          <div class="h-10 w-full bg-border/20 rounded-xl mt-auto"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
      Failed to load upcoming events: {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="events.length === 0" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
      No upcoming events scheduled. Check back soon!
    </div>

    <!-- Events Grid -->
    <div v-else class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="group flex flex-col rounded-3xl border border-border bg-surface/60 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
      >
        <!-- Top: Cover Image -->
        <div class="relative aspect-[16/9] w-full overflow-hidden">
          <img
            :src="event.coverImage"
            :alt="event.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        </div>

        <!-- Body -->
        <div class="p-6 flex flex-col flex-grow text-left">
          <!-- Tag pills (first 2) -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in event.tags.slice(0, 2)"
              :key="tag"
              class="px-2.5 py-0.5 text-xs rounded-full border border-border text-muted-foreground font-medium"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Event Title -->
          <h3 class="font-display text-xl font-bold text-foreground line-clamp-1">
            {{ event.title }}
          </h3>

          <!-- Date & Time Row -->
          <div class="flex items-center gap-2 text-muted-foreground text-xs font-medium mt-2">
            <Calendar class="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{{ formatEventDate(event.date) }} • {{ event.time }}</span>
          </div>

          <!-- Description -->
          <p class="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed">
            {{ event.description }}
          </p>

          <!-- Location Row -->
          <div class="flex items-start gap-2 text-sm mt-4">
            <MapPin class="h-4 w-4 shrink-0 text-brand mt-0.5" />
            <a
              :href="event.locationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-foreground hover:underline line-clamp-1 font-medium transition-colors"
            >
              {{ event.location }}
            </a>
          </div>

          <!-- CTA Button -->
          <a
            :href="event.meetupUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl bg-brand text-brand-foreground w-full mt-auto pt-2.5 pb-2.5 text-sm font-semibold text-center hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-1"
          >
            Attend on Meetup →
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
