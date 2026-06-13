<template>
  <section id="community" class="py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    <!-- Header -->
    <div class="max-w-3xl">
      <span class="text-xs font-bold uppercase tracking-widest text-brand">
        HOW IT WORKS
      </span>
      <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        What happens inside.
      </h2>
    </div>

    <!-- Numbered Program Cards Grid -->
    <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="step in steps"
        :key="step.number"
        class="group flex flex-col rounded-3xl border border-border bg-surface/60 p-8 hover:border-brand/40 transition-all duration-300"
      >
        <div class="font-display text-3xl font-bold text-brand/30 group-hover:text-brand transition-colors duration-300">
          {{ step.number }}
        </div>
        <h3 class="mt-6 font-display text-xl font-bold text-foreground">
          {{ step.title }}
        </h3>
        <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
          {{ step.description }}
        </p>
      </div>
    </div>
    
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Weekly ship logs',
    description: 'Every Friday, members post what they shipped, what they learned, what broke.',
  },
  {
    number: '02',
    title: 'Monetisation tear-downs',
    description: 'Members publish revenue breakdowns of their apps — pricing, churn, what moved the needle.',
  },
  {
    number: '03',
    title: 'Boost circles',
    description: 'Small groups that cross-promote launches, swap beta testers, and trade honest reviews.',
  },
]
</script>
