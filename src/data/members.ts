import type { Member } from "@/types";
import memberAdaeze from "@/assets/member-adaeze.jpg";
import memberMarcus from "@/assets/member-marcus.jpg";
import memberPriya from "@/assets/member-priya.jpg";
import memberJonah from "@/assets/member-jonah.jpg";
import memberSofia from "@/assets/member-sofia.jpg";
import memberKemi from "@/assets/member-kemi.jpg";

export const members: Member[] = [
  {
    name: "Adaeze O.",
    role: "Organizing Team",
    title: "Founder & Community Lead",
    portrait: memberAdaeze,
    bio: "Ex-Flutter engineer turned indie maker. Started SW-Indie Devs after shipping her first solo app and realising how lonely the journey can be. Now runs the weekly ship logs and hosts monthly office hours.",
    socials: {
      linkedin: "#",
      twitter: "#",
      website: "#"
    },
    apps: [
      { name: "Chronos", description: "Time-blocking for deep work.", url: "#", store: "apple" },
      { name: "Focus Field", description: "Pomodoro for teams", url: "#", store: "web" }
    ]
  },
  {
    name: "Marcus L.",
    role: "Organizing Team",
    title: "Monetisation Lead",
    portrait: memberMarcus,
    bio: "Solo founder who's been transparent about every dollar he's made (and lost). Runs the monetisation tear-down sessions and mentors first-time launchers on pricing.",
    socials: {
      twitter: "#",
      github: "#",
      website: "#"
    },
    apps: [
      { name: "Vivid Metrics", description: "MRR dashboards that don't suck.", url: "#", store: "web" },
      { name: "Receipts.fm", description: "Stripe receipts for podcasters", url: "#", store: "web" }
    ]
  },
  {
    name: "Priya K.",
    role: "Member",
    title: "iOS & Privacy",
    portrait: memberPriya,
    bio: "Privacy-first developer building local-first apps. Believes good software shouldn't need a backend. Frequent contributor to the boost circles.",
    socials: {
      github: "#",
      website: "#"
    },
    apps: [
      { name: "Halcyon Notes", description: "Markdown that respects your battery.", url: "#", store: "apple" },
      { name: "Halcyon Notes", description: "Markdown that respects your battery.", url: "#", store: "play" }
    ]
  },
  {
    name: "Jonah R.",
    role: "Member",
    title: "Cross-platform builder",
    portrait: memberJonah,
    bio: "Reformed agency dev now happily shipping his own tiny apps. Big on shipping ugly v1s and iterating in public.",
    socials: {
      twitter: "#",
      github: "#"
    },
    apps: [
      { name: "Streakly", description: "Habit tracking without the guilt trips.", url: "#", store: "apple" },
      { name: "Streakly", description: "Habit tracking without the guilt trips.", url: "#", store: "play" }
    ]
  },
  {
    name: "Sofia M.",
    role: "Member",
    title: "Wellness & TikTok growth",
    portrait: memberSofia,
    bio: "Grew her meditation app from zero to 1.2k subscribers using nothing but 60-second TikTok demos. Shares her growth playbook openly inside the community.",
    socials: {
      twitter: "#",
      website: "#"
    },
    apps: [
      { name: "Calm Compass", description: "Tiny meditations between meetings.", url: "#", store: "apple" }
    ]
  },
  {
    name: "Kemi A.",
    role: "Member",
    title: "Finance & one-time purchases",
    portrait: memberKemi,
    bio: "Champions the one-time-purchase model in a subscription-fatigued world. Quietly profitable, loudly opinionated about App Store reviews.",
    socials: {
      linkedin: "#",
      twitter: "#"
    },
    apps: [
      { name: "Ledger Light", description: "Personal finance that fits on one screen.", url: "#", store: "apple" }
    ]
  }
];
