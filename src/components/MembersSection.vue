<template>
  <section id="members" class="py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    <!-- Header -->
    <div class="text-left max-w-3xl">
      <span class="text-xs font-bold uppercase tracking-widest text-brand">
        THE COMMUNITY
      </span>
      <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        Meet the makers.
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Tap any member to read their story and see the apps they've shipped.
      </p>
    </div>

    <!-- Loading Shimmer State -->
    <div v-if="loading" class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse relative flex flex-col items-stretch rounded-3xl border border-border bg-surface/20 p-6"
      >
        <div class="absolute top-10 right-10 h-4 w-20 bg-border/20 rounded-full"></div>
        <div class="relative aspect-square w-full bg-border/20 rounded-2xl border border-border"></div>
        <div class="h-6 w-1/2 bg-border/20 rounded mt-5"></div>
        <div class="h-4 w-1/3 bg-border/20 rounded mt-2"></div>
        <div class="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 bg-border/20 rounded"></div>
            <div class="h-4 w-4 bg-border/20 rounded"></div>
            <div class="h-4 w-4 bg-border/20 rounded"></div>
          </div>
          <div class="h-4 w-12 bg-border/20 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
      Failed to load members: {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="members.length === 0" class="mt-16 text-center text-sm text-muted-foreground/80 border border-border/50 rounded-2xl p-6 bg-surface/20">
      No members found. Check back later!
    </div>

    <!-- Members Grid -->
    <div v-else class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="member in members"
        :key="member.name"
        @click="activeMember = member"
        class="group relative flex flex-col items-stretch text-left rounded-3xl border border-border bg-surface/40 p-6 hover:border-brand/40 hover:-translate-y-1 hover:shadow-glow/5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
      >
        <!-- Role Badge in Top Corner -->
        <span
          class="absolute top-10 right-10 z-10 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm"
          :class="member.role === 'Organizing Team' ? 'bg-brand text-brand-foreground' : 'bg-foreground/10 text-foreground'"
        >
          {{ member.role }}
        </span>

        <!-- Portrait Container -->
        <div class="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
          <img
            :src="member.portrait"
            :alt="member.name + ' headshot'"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        </div>

        <!-- Name and Title -->
        <h3 class="mt-5 font-display text-2xl font-bold text-foreground">
          {{ member.name }}
        </h3>
        <p class="mt-1 text-sm text-muted-foreground font-medium">
          {{ member.title }}
        </p>

        <!-- Social Icons + Action Row -->
        <div class="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
          <!-- Social Icons (Only present ones) -->
          <div class="flex items-center gap-3 text-muted-foreground">
            <span v-if="member.socials.linkedin" class="p-0.5 hover:text-brand transition-colors" title="LinkedIn">
              <Linkedin class="h-4 w-4" />
            </span>
            <span v-if="member.socials.twitter" class="p-0.5 hover:text-brand transition-colors" title="Twitter">
              <Twitter class="h-4 w-4" />
            </span>
            <span v-if="member.socials.github" class="p-0.5 hover:text-brand transition-colors" title="GitHub">
              <Github class="h-4 w-4" />
            </span>
            <span v-if="member.socials.website" class="p-0.5 hover:text-brand transition-colors" title="Website">
              <Globe class="h-4 w-4" />
            </span>
          </div>

          <!-- Action Affordance -->
          <span class="text-xs font-semibold text-brand group-hover:translate-x-0.5 transition-transform duration-200">
            Read more →
          </span>
        </div>
      </button>
    </div>

    <!-- Member Dialog Modal -->
    <MemberDialog :member="activeMember" @close="activeMember = null" />

  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMembers } from '@/composables/firebase/useMembers'
import type { Member } from '@/types'
import { Linkedin, Twitter, Github, Globe } from 'lucide-vue-next'
import MemberDialog from './MemberDialog.vue'

const activeMember = ref<Member | null>(null)
const { docs: members, loading, error } = useMembers()
</script>
