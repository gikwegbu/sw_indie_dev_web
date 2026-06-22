<script setup lang="ts">
import { ref } from 'vue'
import type { PastEvent } from '@/types'
import PastEventDialog from './PastEventDialog.vue'

// Import asset images
import eventBristolImg from '@/assets/past-event-bristol.png'
import eventShowTellImg from '@/assets/past-event-show-tell.png'

import portraitMarcus from '@/assets/member-marcus.jpg'
import portraitPriya from '@/assets/member-priya.jpg'
import portraitJonah from '@/assets/member-jonah.jpg'
import portraitSofia from '@/assets/member-sofia.jpg'

const pastEvents: PastEvent[] = [
  {
    id: '1',
    title: 'SW-Indie Devs: Winter Showcase 2025',
    date: '2025-11-14',
    coverImage: eventBristolImg,
    description: 'Our annual winter showcase in Bristol, featuring indie product presentations, pricing discussions, and community project launches.',
    fullDescription: 'The Winter Showcase 2025 brought together developers from across the South West to demo their latest products. We hosted live show-and-tell sessions, ran interactive feedback workshops, and discussed app-store optimization and pricing tiers. Over 80 developers joined us at the engine loft for a night of coding inspiration.',
    tags: ['Showcase', 'Bristol', 'Winter Meetup'],
    galleryImages: [],
    talks: [
      {
        id: '1-1',
        speakerName: 'Marcus Vance',
        speakerTitle: 'Creator of HabitBuilder & iOS Indie Developer',
        speakerPortrait: portraitMarcus,
        talkTitle: 'Bootstrapping a SwiftUI App to $5k MRR in 12 Months',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: '1-2',
        speakerName: 'Priya Sharma',
        speakerTitle: 'Founder of CalmSpace & UX Designer',
        speakerPortrait: portraitPriya,
        talkTitle: 'Aesthetic-First App Design: Crafting Interfaces Users Love',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: '2',
    title: 'Spring Talk: App Store Launch Strategies',
    date: '2026-03-18',
    coverImage: eventShowTellImg,
    description: 'An evening of expert insights on optimization, handling reviews, pitching to editors, and scaling organically.',
    fullDescription: 'In our Spring meetup, we focused on the critical phase of launching. We covered the ins and outs of preparing your metadata, running public beta programs, obtaining early review traction, and techniques for getting featured by Apple and Google. A highly practical session for anyone shipping this year.',
    tags: ['Marketing', 'Launch', 'ASO'],
    galleryImages: [],
    talks: [
      {
        id: '2-1',
        speakerName: 'Jonah Miller',
        speakerTitle: 'Creator of Chronos Planner',
        speakerPortrait: portraitJonah,
        talkTitle: 'Surviving App Store Launch Week: What Actually Works',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: '2-2',
        speakerName: 'Sofia Chen',
        speakerTitle: 'Founder of Vivid Editor',
        speakerPortrait: portraitSofia,
        talkTitle: 'Cross-Platform Shipping: Vue, Tauri, and Mobile Wrappers',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  }
]

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

      <!-- Past Events Grid -->
      <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
