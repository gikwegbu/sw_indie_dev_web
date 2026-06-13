import type { Project } from "@/types";
import appChronos from "@/assets/app-chronos.jpg";
import appVivid from "@/assets/app-vivid.jpg";
import appNotes from "@/assets/app-notes.jpg";
import appHabit from "@/assets/app-habit.jpg";
import appCalm from "@/assets/app-calm.jpg";

export const projects: Project[] = [
  {
    name: "Chronos",
    tagline: "Time-blocking for deep work.",
    builder: "Adaeze O.",
    cover: appChronos,
    screenshots: [appChronos, appHabit, appNotes],
    description: "Chronos is a calm time-blocking app for people who do their best work in long, uninterrupted stretches. No notifications, no streaks, no nagging — just your day, laid out like an architect's drawing.",
    monetisation: "Freemium with a $4.99/mo Pro tier. 2.1k paying users, ~$9k MRR after 14 months.",
    tags: ["iOS", "Productivity", "Indie"],
    links: [
      { label: "App Store", url: "#", icon: "apple" },
      { label: "Website", url: "#", icon: "web" }
    ]
  },
  {
    name: "Vivid Metrics",
    tagline: "MRR dashboards that don't suck.",
    builder: "Marcus L.",
    cover: appVivid,
    screenshots: [appVivid, appChronos, appNotes],
    description: "A single beautiful dashboard for Stripe, Paddle, and Lemon Squeezy. Designed for solo founders who want their numbers in one glance, not five tabs.",
    monetisation: "Flat $12/mo, no tiers. ~$14k MRR. Most growth came from posting weekly revenue screenshots on X.",
    tags: ["Web", "SaaS", "Founders"],
    links: [
      { label: "Visit App", url: "#", icon: "web" },
      { label: "Download", url: "#", icon: "download" }
    ]
  },
  {
    name: "Halcyon Notes",
    tagline: "Markdown that respects your battery.",
    builder: "Priya K.",
    cover: appNotes,
    screenshots: [appNotes, appCalm, appHabit],
    description: "A minimal markdown notebook with end-to-end encrypted sync. No accounts unless you want them. Local-first, file-based, future-proof.",
    monetisation: "One-time $19 purchase + optional $2/mo sync. Crossed 8k lifetime sales in year one.",
    tags: ["iOS", "Android", "Privacy"],
    links: [
      { label: "App Store", url: "#", icon: "apple" },
      { label: "Play Store", url: "#", icon: "play" }
    ]
  },
  {
    name: "Streakly",
    tagline: "Habit tracking without the guilt trips.",
    builder: "Jonah R.",
    cover: appHabit,
    screenshots: [appHabit, appCalm, appChronos],
    description: "A friendlier take on habit tracking. Streakly forgives missed days, encourages weekly rhythms over perfect streaks, and never sends a shame notification.",
    monetisation: "Pay-what-you-want from $0. Average $7 contribution. ~3k active supporters.",
    tags: ["iOS", "Wellness", "Flutter"],
    links: [
      { label: "App Store", url: "#", icon: "apple" },
      { label: "Play Store", url: "#", icon: "play" }
    ]
  },
  {
    name: "Calm Compass",
    tagline: "Tiny meditations between meetings.",
    builder: "Sofia M.",
    cover: appCalm,
    screenshots: [appCalm, appHabit, appNotes],
    description: "60-second guided breathing sessions designed to fit between back-to-back calls. Calendar integration suggests micro-breaks automatically.",
    monetisation: "$2.99/mo, all features. Grew to 1,200 subscribers via TikTok demos.",
    tags: ["iOS", "Wellness"],
    links: [
      { label: "App Store", url: "#", icon: "apple" },
      { label: "Website", url: "#", icon: "web" }
    ]
  },
  {
    name: "Ledger Light",
    tagline: "Personal finance that fits on one screen.",
    builder: "Kemi A.",
    cover: appVivid,
    screenshots: [appVivid, appNotes, appHabit],
    description: "An honest expense tracker. No bank linking, no AI insights, no upsells — just a fast way to log what you spent and see where it went.",
    monetisation: "Free with a $9 one-time unlock for unlimited categories. ~5k unlocks.",
    tags: ["iOS", "Finance"],
    links: [
      { label: "App Store", url: "#", icon: "apple" },
      { label: "Website", url: "#", icon: "web" }
    ]
  }
];
