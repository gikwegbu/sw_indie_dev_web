<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  slides: string[]
}>()

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

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    scrollPrev()
  } else if (event.key === 'ArrowRight') {
    scrollNext()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  if (emblaRef) {
    // Reference emblaRef to satisfy typescript compiler
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="relative w-full overflow-hidden select-none">
    <div class="overflow-hidden" ref="emblaRef">
      <div class="flex -ml-4">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="flex-[0_0_100%] min-w-0 pl-4"
        >
          <div class="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
            <img
              :src="slide"
              alt="Screenshot of project"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
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
</template>
