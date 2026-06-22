<template>
  <nav class="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-bg/80 backdrop-blur-md transition-all duration-200">
    <div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Left: Wordmark -->
      <a
        href="#top"
        class="font-display text-xl font-bold tracking-tighter text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
      >
        SW<span class="text-brand">·</span>INDIE DEVS
      </a>

      <!-- Center (md+ only): Navigation Links -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-sm font-medium text-muted-foreground hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- Right: Join Us Pill Button -->
      <div>
        <a
          href="#join"
          class="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-xs font-semibold tracking-wide text-bg hover:bg-brand hover:text-brand-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          JOIN US
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Members', href: '#members' },
  { label: 'Events', href: '#events' },
  { label: 'Outreach', href: '#outreach' },
  { label: 'Community', href: '#community' },
  { label: 'Join', href: '#join' },
]
</script>
