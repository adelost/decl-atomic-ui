import type { SlideItem } from 'svelte-daui';

// Sample achievements for demo
const sampleAchievements: SlideItem[] = [
  {
    id: 'first-jump',
    header: 'ACHIEVEMENT!',
    icon: '🪂',
    title: 'First Jump',
    subtitle: 'Complete your first skydive',
    badge: '+50p',
    theme: 'gold',
  },
  {
    id: 'speed-demon',
    header: 'ACHIEVEMENT!',
    icon: '⚡',
    title: 'Speed Demon',
    subtitle: 'Reach terminal velocity',
    badge: '+100p',
    theme: 'purple',
  },
  {
    id: 'perfect-landing',
    header: 'ACHIEVEMENT!',
    icon: '🎯',
    title: 'Perfect Landing',
    subtitle: 'Land within 1 meter of target',
    badge: '+75p',
    theme: 'green',
  },
];

const sampleLevelUp: SlideItem[] = [
  {
    id: 'level-5',
    header: 'LEVEL UP!',
    icon: '5',
    title: 'Skydiver Level 5',
    subtitle: 'Level 4 › Level 5',
    theme: 'cyan',
  },
];

const sampleOnboarding: SlideItem[] = [
  {
    id: 'welcome',
    icon: '👋',
    title: 'Welcome to DAUI!',
    subtitle: 'A declarative approach to building UIs',
  },
  {
    id: 'pages',
    icon: '📄',
    title: 'Pages are Data',
    subtitle: 'Define your UI as typed objects, not code',
  },
  {
    id: 'components',
    icon: '🧩',
    title: 'Atomic Components',
    subtitle: 'Atoms, Molecules, and Organisms work together',
  },
  {
    id: 'ready',
    icon: '🚀',
    title: "You're Ready!",
    subtitle: 'Start building amazing interfaces',
  },
];

export class CelebrationStore {
  // Achievement modal state
  achievementModalOpen = $state(false);
  achievementSlides = $state<SlideItem[]>([]);

  // Onboarding modal state
  onboardingModalOpen = $state(false);

  // Level up modal state
  levelUpModalOpen = $state(false);

  // Trigger achievements
  showAchievements = () => {
    this.achievementSlides = [...sampleAchievements];
    this.achievementModalOpen = true;
  };

  showSingleAchievement = () => {
    this.achievementSlides = [sampleAchievements[0]];
    this.achievementModalOpen = true;
  };

  closeAchievements = () => {
    this.achievementModalOpen = false;
    this.achievementSlides = [];
  };

  // Trigger level up
  showLevelUp = () => {
    this.levelUpModalOpen = true;
  };

  closeLevelUp = () => {
    this.levelUpModalOpen = false;
  };

  // Trigger onboarding
  showOnboarding = () => {
    this.onboardingModalOpen = true;
  };

  closeOnboarding = () => {
    this.onboardingModalOpen = false;
  };

  // Get slides
  getOnboardingSlides = () => sampleOnboarding;
  getLevelUpSlides = () => sampleLevelUp;
}

export const celebrationStore = new CelebrationStore();
