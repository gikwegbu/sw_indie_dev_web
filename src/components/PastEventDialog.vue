<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import type { PastEvent } from '@/types'

const props = defineProps<{
  event: PastEvent | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.event !== null,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})

const activeTalkId = ref<string | null>(null)

// Reset video when dialog closes or changes
watch(() => props.event, () => {
  activeTalkId.value = null
})

function getYoutubeId(url: string): string {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ'
  } catch (e) {
    return 'dQw4w9WgXcQ'
  }
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
</script>

<template>
  <DialogRoot :open="isOpen" @update:open="isOpen = $event">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-bg/70 backdrop-blur-md transition-all duration-300 ease-out"
      />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-surface shadow-glow outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-all duration-300 ease-out"
      >
        <div v-if="event" class="flex flex-col">
          <!-- Header Banner -->
          <div class="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
            <img
              :src="event.coverImage"
              :alt="event.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
            
            <!-- Close Button inside the banner -->
            <DialogClose
              class="absolute right-4 top-4 z-20 rounded-full p-2 bg-bg/60 hover:bg-bg/95 text-foreground hover:text-brand transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
              aria-label="Close dialog"
            >
              <X class="h-5 w-5" />
            </DialogClose>

            <!-- Bottom Left Title and Date -->
            <div class="absolute bottom-6 left-6 right-6 text-left">
              <span class="inline-block rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground mb-3">
                {{ formatDate(event.date) }}
              </span>
              <h3 class="font-display text-2xl md:text-3xl font-extrabold text-foreground">
                {{ event.title }}
              </h3>
            </div>
          </div>

          <!-- Body Content -->
          <div class="p-6 md:p-8 flex flex-col gap-6 text-left">
            <!-- Full Description -->
            <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
              {{ event.fullDescription }}
            </p>

            <!-- Tag Pills -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in event.tags"
                :key="tag"
                class="px-2.5 py-0.5 text-xs rounded-full border border-border text-muted-foreground font-medium"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Talks Section -->
            <div v-if="event.talks && event.talks.length > 0" class="border-t border-border/40 pt-6">
              <h4 class="font-display text-lg font-bold text-foreground mb-4">
                Talks from this event
              </h4>
              
              <div class="grid gap-4 sm:grid-cols-2">
                <div
                  v-for="talk in event.talks"
                  :key="talk.id"
                  class="group relative flex flex-col rounded-2xl border border-border bg-surface/60 overflow-hidden cursor-pointer"
                  @click="activeTalkId = talk.id"
                >
                  <!-- Media Container (Portrait or YouTube video) -->
                  <div class="relative w-full overflow-hidden bg-black">
                    <!-- Expanded YouTube video -->
                    <div v-if="activeTalkId === talk.id" class="relative aspect-[16/9] w-full">
                      <iframe
                        width="100%"
                        style="aspect-ratio: 16/9;"
                        :src="`https://www.youtube.com/embed/${getYoutubeId(talk.youtubeUrl)}?autoplay=1`"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        frameborder="0"
                        class="absolute inset-0 w-full h-full"
                      ></iframe>
                      <!-- Close video button -->
                      <button
                        type="button"
                        aria-label="Close video"
                        class="absolute top-2 right-2 z-10 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-colors border border-white/20 cursor-pointer"
                        @click.stop="activeTalkId = null"
                      >
                        ✕
                      </button>
                    </div>

                    <!-- Collapsed Portrait -->
                    <div v-else class="aspect-square w-full">
                      <img
                        :src="talk.speakerPortrait"
                        :alt="talk.speakerName"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                        loading="lazy"
                      />
                      <!-- Watch Overlay -->
                      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground shadow-sm">
                          ▶ Watch talk
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Details Area (only shows when video is NOT active or is kept underneath) -->
                  <div class="p-4 flex flex-col flex-grow text-left">
                    <h5 class="font-display text-base font-bold text-foreground">
                      {{ talk.speakerName }}
                    </h5>
                    <p class="text-xs text-muted-foreground font-medium">
                      {{ talk.speakerTitle }}
                    </p>
                    <p class="text-sm font-semibold text-foreground mt-2 line-clamp-2 leading-relaxed">
                      {{ talk.talkTitle }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
