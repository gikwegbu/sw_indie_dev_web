<template>
  <section id="join" class="py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-border/40">
    <div class="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-8 sm:p-10 md:p-12 shadow-glow text-left">
      
      <!-- Headers -->
      <span class="text-xs font-bold uppercase tracking-widest text-brand">
        JOIN THE COMMUNITY
      </span>
      <h2 class="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Tell us about what you're building.
      </h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Drop your name, email, and a sentence about your latest project. We'll be in touch within a few days.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-8 flex flex-col gap-6" novalidate>
        
        <!-- Name Field -->
        <div class="flex flex-col gap-2">
          <label for="name" class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="George Ikwegbu"
            class="h-11 rounded-xl border bg-input/40 px-4 text-sm text-foreground placeholder-muted-foreground/60 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            :class="errors.name ? 'border-accent' : 'border-border/60'"
            @input="clearError('name')"
          />
          <span v-if="errors.name" class="text-xs font-semibold text-accent mt-1">
            {{ errors.name }}
          </span>
        </div>

        <!-- Email Field -->
        <div class="flex flex-col gap-2">
          <label for="email" class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="george@example.com"
            class="h-11 rounded-xl border bg-input/40 px-4 text-sm text-foreground placeholder-muted-foreground/60 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            :class="errors.email ? 'border-accent' : 'border-border/60'"
            @input="clearError('email')"
          />
          <span v-if="errors.email" class="text-xs font-semibold text-accent mt-1">
            {{ errors.email }}
          </span>
        </div>

        <!-- Message Field -->
        <div class="flex flex-col gap-2">
          <label for="message" class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            What are you working on?
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="4"
            placeholder="I'm shipping a local-first markdown journal built in Swift. It currently has 200 beta testers..."
            class="rounded-xl border bg-input/40 p-4 text-sm text-foreground placeholder-muted-foreground/60 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none leading-relaxed"
            :class="errors.message ? 'border-accent' : 'border-border/60'"
            @input="clearError('message')"
          ></textarea>
          <span v-if="errors.message" class="text-xs font-semibold text-accent mt-1">
            {{ errors.message }}
          </span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 font-semibold text-brand-foreground shadow-glow hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
        >
          Submit Application
        </button>

      </form>
      
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { toast } from 'vue-sonner'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  message: '',
})

const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

const clearError = (field: 'name' | 'email' | 'message') => {
  errors[field] = ''
}

const handleSubmit = () => {
  let hasErrors = false

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    hasErrors = true
  } else {
    errors.name = ''
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    hasErrors = true
  } else if (!validateEmail(form.email)) {
    errors.email = 'Please enter a valid email address'
    hasErrors = true
  } else {
    errors.email = ''
  }

  // Message validation
  if (!form.message.trim()) {
    errors.message = 'Please tell us about your project'
    hasErrors = true
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long'
    hasErrors = true
  } else {
    errors.message = ''
  }

  if (hasErrors) {
    toast.error('Please fix the errors in the form.')
    return
  }

  // Success
  toast.success("Thanks! We'll be in touch shortly.")
  
  // Reset form
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>
