<script setup lang="ts">
import { computed } from 'vue'
import type { Member, MemberAppStore } from '@/types'
import Dialog from './ui/Dialog.vue'
import { Linkedin, Twitter, Github, Globe, Apple, Play, Download } from 'lucide-vue-next'

const props = defineProps<{
  member: Member | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.member !== null,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})

const getStoreIcon = (store: MemberAppStore) => {
  switch (store) {
    case 'apple': return Apple
    case 'play': return Play
    case 'web': return Globe
    case 'download': return Download
    default: return Globe
  }
}
</script>

<template>
  <Dialog v-model="isOpen">
    <div v-if="member" class="flex flex-col gap-6">
      
      <!-- Header Info -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-left border-b border-border/40 pb-6">
        <!-- Portrait -->
        <div class="h-28 w-28 overflow-hidden rounded-2xl border border-border">
          <img
            :src="member.portrait"
            :alt="member.name + ' headshot'"
            class="h-full w-full object-cover"
          />
        </div>
        
        <!-- Identity -->
        <div class="flex-1 flex flex-col items-start gap-2">
          <!-- Role Badge -->
          <span
            class="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            :class="member.role === 'Organizing Team' ? 'bg-brand text-brand-foreground' : 'bg-foreground/10 text-foreground'"
          >
            {{ member.role }}
          </span>
          <h3 class="font-display text-3xl font-extrabold text-foreground">
            {{ member.name }}
          </h3>
          <p class="text-sm text-muted-foreground font-medium">
            {{ member.title }}
          </p>
        </div>
      </div>

      <!-- Socials Row -->
      <div class="flex flex-wrap gap-4 text-left border-b border-border/40 pb-6">
        <a
          v-if="member.socials.linkedin"
          :href="member.socials.linkedin"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
        >
          <Linkedin class="h-3.5 w-3.5" />
          LINKEDIN
        </a>
        <a
          v-if="member.socials.twitter"
          :href="member.socials.twitter"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
        >
          <Twitter class="h-3.5 w-3.5" />
          TWITTER
        </a>
        <a
          v-if="member.socials.github"
          :href="member.socials.github"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
        >
          <Github class="h-3.5 w-3.5" />
          GITHUB
        </a>
        <a
          v-if="member.socials.website"
          :href="member.socials.website"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-2 py-1"
        >
          <Globe class="h-3.5 w-3.5" />
          WEBSITE
        </a>
      </div>

      <!-- Bio -->
      <div class="text-left">
        <h4 class="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          BIO
        </h4>
        <p class="mt-2 text-sm text-foreground leading-relaxed">
          {{ member.bio }}
        </p>
      </div>

      <!-- Apps Launched -->
      <div class="text-left border-t border-border/40 pt-6">
        <h4 class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          APPS LAUNCHED
        </h4>
        <div class="flex flex-col gap-3">
          <div
            v-for="app in member.apps"
            :key="app.name"
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-bg/40 p-4 hover:border-brand/30 transition-colors duration-200"
          >
            <div class="flex-1">
              <h5 class="text-sm font-bold text-foreground">
                {{ app.name }}
              </h5>
              <p class="mt-1 text-xs text-muted-foreground leading-relaxed">
                {{ app.description }}
              </p>
            </div>
            
            <a
              :href="app.url"
              class="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-foreground hover:bg-brand hover:text-brand-foreground hover:border-brand transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
            >
              <component :is="getStoreIcon(app.store)" class="h-3.5 w-3.5" />
              Open
            </a>
          </div>
        </div>
      </div>
      
    </div>
  </Dialog>
</template>
