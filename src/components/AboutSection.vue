<template>
  <section id="about" class="bg-surface/30 py-20 md:py-28 border-y border-border/40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Top Section Info -->
      <div class="max-w-3xl">
        <span class="text-xs font-bold uppercase tracking-widest text-brand">
          ABOUT THE COMMUNITY
        </span>
        <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Indie devs helping indie devs.
        </h2>
        <p class="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          Most of us started as Flutter, Swift, or React Native engineers. Now we ship our own products on the side — or full-time — and we share the journey so nobody has to figure it out alone.
        </p>
      </div>

      <!-- 3-Column Pillars Grid -->
      <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="pillar in pillars"
          :key="pillar.title"
          class="flex flex-col rounded-3xl border border-border bg-surface/40 p-8 hover:border-brand/30 hover:shadow-glow/5 transition-all duration-300"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <component :is="pillar.icon" class="h-6 w-6" />
          </div>
          <h3 class="mt-6 font-display text-xl font-bold text-foreground">
            {{ pillar.title }}
          </h3>
          <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
            {{ pillar.description }}
          </p>
        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup lang="ts">
import { Cpu, DollarSign, Users } from 'lucide-vue-next'

const pillars = [
  {
    title: 'Show your work',
    description: 'Drop your latest build, your design experiments, your half-finished side project. Honest feedback, no pitch decks required.',
    icon: Cpu,
  },
  {
    title: 'Swap monetisation tactics',
    description: "What's working, what flopped. Pricing experiments, launch playbooks, ad campaigns, App Store reviews — shared openly.",
    icon: DollarSign,
  },
  {
    title: 'Grow together',
    description: 'Cross-promotions, beta swaps, follower trades, honest reviews. We help each other reach more users, faster.',
    icon: Users,
  },
]
</script>
