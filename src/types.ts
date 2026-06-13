export type MemberAppStore = "apple" | "play" | "web" | "download";

export interface MemberApp {
  name: string;
  description: string;
  url: string;
  store: MemberAppStore;
}

export interface Member {
  name: string;
  role: "Organizing Team" | "Member";
  title: string;
  portrait: string;
  bio: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  apps: MemberApp[];
}

export interface ProjectLink {
  label: string;
  url: string;
  icon: "apple" | "play" | "web" | "download";
}

export interface Project {
  name: string;
  tagline: string;
  builder: string;
  cover: string;
  screenshots: string[];
  description: string;
  monetisation: string;
  tags: string[];
  links: ProjectLink[];
}
