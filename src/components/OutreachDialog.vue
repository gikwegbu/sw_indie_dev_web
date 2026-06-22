<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from 'radix-vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import emblaCarouselVue from 'embla-carousel-vue'
import type { OutreachActivity } from '@/types'

const props = defineProps<{
  activity: OutreachActivity | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.activity !== null,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})

const currentIdx = ref(0)
const totalSlides = ref(0)

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  align: 'center',
})

const scrollPrev = () => {
  if (emblaApi.value) emblaApi.value.scrollPrev()
}

const scrollNext = () => {
  if (emblaApi.value) emblaApi.value.scrollNext()
}

const onSelect = () => {
  if (!emblaApi.value) return
  currentIdx.value = emblaApi.value.selectedScrollSnap()
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    scrollPrev()
  } else if (event.key === 'ArrowRight') {
    scrollNext()
  }
}

watch(isOpen, (open) => {
  if (open) {
    window.addEventListener('keydown', onKeyDown)
  } else {
    window.removeEventListener('keydown', onKeyDown)
  }
})

// Update embla layout and snap data when active activity shifts
watch(() => props.activity, (newVal) => {
  if (newVal) {
    currentIdx.value = 0
    totalSlides.value = newVal.gallery?.length || 0
    setTimeout(() => {
      if (emblaApi.value) {
        emblaApi.value.reInit()
        totalSlides.value = emblaApi.value.scrollSnapList().length
        currentIdx.value = emblaApi.value.selectedScrollSnap()
      }
    }, 80)
  }
})

// Listen to embla API select events
watch(emblaApi, (api) => {
  if (!api) return
  api.on('select', onSelect)
  api.on('reInit', () => {
    totalSlides.value = emblaApi.value?.scrollSnapList().length || 0
    currentIdx.value = emblaApi.value?.selectedScrollSnap() || 0
  })
})

function formatDate(dateString: string) {
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

// Reference emblaRef to satisfy typescript compiler
if (emblaRef) {
  // no-op
}
</script>

<template>
  <DialogRoot :open="isOpen" @update:open="isOpen = $event">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-bg/70 backdrop-blur-md transition-all duration-300 ease-out"
      />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-surface p-6 md:p-8 shadow-glow outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-all duration-300 ease-out"
      >
        <!-- Close Button -->
        <DialogClose
          class="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X class="h-5 w-5" />
        </DialogClose>

        <div v-if="activity" class="flex flex-col gap-6 text-left">
          
          <!-- Identity & Date Header -->
          <div class="flex flex-col gap-2 items-start border-b border-border/40 pb-4 pr-8">
            <span class="inline-block rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
              {{ formatDate(activity.date) }}
            </span>
            <h3 class="font-display text-2xl font-extrabold text-foreground leading-tight">
              {{ activity.title }}
            </h3>
          </div>

          <!-- Description Section -->
          <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
            {{ activity.fullDescription }}
          </p>

          <!-- Embla Carousel Section -->
          <div v-if="activity.gallery && activity.gallery.length > 0" class="flex flex-col">
            <div class="relative w-full overflow-hidden select-none rounded-2xl border border-border bg-bg/40">
              
              <!-- Embla viewport container -->
              <div class="overflow-hidden" ref="emblaRef">
                <div class="flex -ml-4">
                  <div
                    v-for="(imgSrc, index) in activity.gallery"
                    :key="index"
                    class="flex-[0_0_100%] min-w-0 pl-4"
                  >
                    <div class="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        :src="imgSrc"
                        alt="Outreach gallery picture"
                        class="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Carousel Control Navigation Arrows -->
              <button
                @click="scrollPrev"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 backdrop-blur-md text-foreground hover:bg-brand hover:text-brand-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <button
                @click="scrollNext"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 backdrop-blur-md text-foreground hover:bg-brand hover:text-brand-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight class="h-5 w-5" />
              </button>

            </div>

            <!-- Slide Counter -->
            <div class="text-sm font-semibold text-muted-foreground mt-4 text-center">
              {{ currentIdx + 1 }} / {{ totalSlides }}
            </div>
          </div>

        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
