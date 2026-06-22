<script setup lang="ts">
import { ref } from 'vue'
import type { OutreachActivity } from '@/types'
import OutreachDialog from './OutreachDialog.vue'

// Import cover images
import outreachCleanupImg from '@/assets/outreach-cleanup.png'
import outreachWorkshopImg from '@/assets/outreach-workshop.png'

const activities: OutreachActivity[] = [
  {
    id: '1',
    title: 'Bristol Parks Cleanup & Green Initiative',
    summary: 'A community cleanup event organized by our developer circle in Bristol to help tidy up local green spaces and network offline.',
    fullDescription: 'Our developers traded keyboard shortcuts for litter pickers to clean up Castle Park in Bristol. Over 25 members joined forces, collecting 18 bags of recycling and waste, helping to keep our local community clean and green. After the cleanup, we headed to a nearby pub to discuss app ideas and share developer war stories.',
    date: '2026-05-10',
    coverImage: outreachCleanupImg,
    gallery: [
      outreachCleanupImg,
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60'
    ],
    tags: ['Community', 'Outreach', 'Bristol']
  },
  {
    id: '2',
    title: 'Developer Accessibility Workshop',
    summary: 'An interactive coding workshop dedicated to raising awareness for a11y, semantic HTML, screen readers, and WCAG rules.',
    fullDescription: 'We hosted a full-day developer sensitisation and accessibility clinic in London. The session featured live screen-reader audits, keyboard-only navigation challenges, and reviews of ARIA practices. We audited 12 member projects, fixing keyboard navigation, color contrast issues, and screen-reader accessibility labels on the spot.',
    date: '2026-04-12',
    coverImage: outreachWorkshopImg,
    gallery: [
      outreachWorkshopImg,
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'
    ],
    tags: ['A11y', 'Workshop', 'Education']
  }
]

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

    <!-- Outreach Activities Grid -->
    <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
