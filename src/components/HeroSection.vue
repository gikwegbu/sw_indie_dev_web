<template>
  <section id="top" class="relative mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 md:pt-36 md:pb-28 lg:px-8 lg:pt-40">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      
      <!-- Left Column: Content -->
      <div class="flex flex-col items-start text-left">
        <!-- Pulse Badge -->
        <div class="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
          </span>
          A GROWING INDIE COMMUNITY
        </div>

        <!-- Headline -->
        <h1 class="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          We're a community. <br />
          <span class="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">Join us</span> and let's share ideas.
        </h1>

        <!-- Subhead Paragraph -->
        <p class="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
          SW-Indie Devs is a circle of independent app builders showcasing what they ship, swapping monetisation playbooks, and helping each other grow their subscribers. No agencies, no clients — just makers.
        </p>

        <!-- CTAs -->
        <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <a
            href="#showcase"
            class="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 font-semibold text-brand-foreground shadow-glow hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand text-center"
          >
            See What We're Building
          </a>
          <a
            href="#join"
            class="inline-flex h-12 items-center justify-center font-medium text-foreground hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-3 py-1 text-center"
          >
            Or join the community →
          </a>
        </div>

        <!-- Stats Divider Row -->
        <div class="mt-12 w-full border-t border-border pt-8">
          <div class="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm md:text-base text-muted-foreground">
            <div>
              <strong class="font-semibold text-foreground">120+</strong> Indie devs
            </div>
            <div class="hidden sm:block h-4 w-px bg-border"></div>
            <div>
              <strong class="font-semibold text-foreground">48</strong> Apps showcased
            </div>
            <div class="hidden sm:block h-4 w-px bg-border"></div>
            <div>
              <strong class="font-semibold text-foreground">1.2M+</strong> Combined downloads
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Visual Mockup -->
      <div class="relative flex justify-center lg:justify-end">
        <!-- Glow Halo -->
        <div class="absolute -inset-4 z-0 rounded-full bg-brand/15 blur-3xl" aria-hidden="true"></div>
        
        <div class="relative z-10 w-full max-w-[480px] overflow-hidden rounded-3xl border border-border bg-surface/30 backdrop-blur-sm">
          <img
            :src="heroShowcase"
            alt="SW-Indie Devs app showcase layout"
            class="aspect-square h-full w-full object-cover"
          />
        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup lang="ts">
import heroShowcase from '@/assets/hero-showcase.jpg'
</script>
