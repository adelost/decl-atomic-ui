import type { Page } from 'svelte-daui';
import { chatStore } from '../../stores/chat.svelte';
import { celebrationStore } from '../../stores/celebration.svelte';

/**
 * Chat Demo Page - Showcases chat components and slide modal
 */
export const chatPage: Page = {
  layout: 'full',
  title: 'Chat Demo',
  sections: [
    {
      molecule: 'page-header',
      title: 'Chat & Celebration Components',
      subtitle: 'Interactive interfaces built with DAUI',
    },
    {
      molecule: 'grid',
      columns: 2,
      gap: 'lg',
      padding: 'md',
      items: [
        // Full ChatPanel organism
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'md',
          items: [
            { atom: 'text', variant: 'heading', text: 'ChatPanel Organism' },
            { atom: 'text', variant: 'muted', text: 'Complete chat interface with header, messages, and input' },
            {
              organism: 'chat-panel',
              id: 'demo-chat',
              title: 'AI Assistant',
              subtitle: () => (chatStore.status === 'typing' ? 'typing...' : 'Online'),
              avatar: { id: 'assistant', name: 'AI Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant' },
              status: () => chatStore.status,
              showHeader: true,
              messages: () => chatStore.messages,
              currentUserId: chatStore.currentUserId,
              showTimestamps: true,
              groupByDate: true,
              typingIndicator: () => chatStore.isTyping,
              placeholder: 'Type your message...',
              onSend: (msg: string) => chatStore.sendMessage(msg),
              onTyping: (isTyping: boolean) => chatStore.handleTyping(isTyping),
              height: 500,
              variant: 'floating',
              headerActions: [
                {
                  atom: 'icon-button',
                  icon: 'refresh-cw',
                  label: 'Clear chat',
                  variant: 'ghost',
                  onClick: () => chatStore.clearMessages(),
                },
              ],
            },
          ],
        },
        // Individual components showcase
        {
          molecule: 'stack',
          direction: 'vertical',
          gap: 'lg',
          items: [
            // ChatBubble atoms
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'text', variant: 'heading', text: 'ChatBubble Atoms' },
                { atom: 'text', variant: 'muted', text: 'Individual message bubbles with different variants' },
                {
                  organism: 'card',
                  variant: 'outlined',
                  content: [
                    {
                      molecule: 'stack',
                      direction: 'vertical',
                      gap: 'sm',
                      padding: 'md',
                      items: [
                        {
                          atom: 'chat-bubble',
                          content: 'This is an assistant message with a longer text to show how it wraps.',
                          author: { name: 'Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot' },
                          timestamp: Date.now() - 60000,
                          variant: 'assistant',
                        },
                        {
                          atom: 'chat-bubble',
                          content: 'This is a user message',
                          author: { name: 'You' },
                          timestamp: Date.now() - 30000,
                          variant: 'user',
                          status: 'read',
                        },
                        {
                          atom: 'chat-bubble',
                          content: 'System notification',
                          author: { name: 'System' },
                          variant: 'system',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            // TypingIndicator
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'text', variant: 'heading', text: 'TypingIndicator Atom' },
                { atom: 'text', variant: 'muted', text: 'Animated indicator when someone is typing' },
                {
                  organism: 'card',
                  variant: 'outlined',
                  content: [
                    {
                      molecule: 'stack',
                      direction: 'vertical',
                      gap: 'md',
                      padding: 'md',
                      items: [
                        {
                          atom: 'typing-indicator',
                          author: { name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
                          size: 'sm',
                        },
                        {
                          atom: 'typing-indicator',
                          author: { name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
                          size: 'md',
                        },
                        {
                          atom: 'typing-indicator',
                          size: 'lg',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            // ChatInput molecule
            {
              molecule: 'stack',
              direction: 'vertical',
              gap: 'sm',
              items: [
                { atom: 'text', variant: 'heading', text: 'ChatInput Molecule' },
                { atom: 'text', variant: 'muted', text: 'Text input with send button' },
                {
                  organism: 'card',
                  variant: 'outlined',
                  content: [
                    {
                      molecule: 'chat-input',
                      id: 'demo-input',
                      placeholder: 'Type something...',
                      onSend: (msg: string) => alert(`Would send: ${msg}`),
                      maxLength: 200,
                      showCharCount: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // SlideModal Section
    {
      molecule: 'stack',
      direction: 'vertical',
      gap: 'md',
      padding: 'md',
      items: [
        { atom: 'divider', spacing: 'lg' },
        { atom: 'text', variant: 'heading', text: 'SlideModal Organism' },
        { atom: 'text', variant: 'muted', text: 'Multi-slide modal for achievements, onboarding, and more' },
        {
          molecule: 'grid',
          columns: 3,
          gap: 'md',
          items: [
            // Achievement demo
            {
              organism: 'card',
              content: [
                {
                  molecule: 'stack',
                  direction: 'vertical',
                  gap: 'md',
                  align: 'center',
                  items: [
                    { atom: 'text', text: '🏆', variant: 'heading' },
                    { atom: 'text', text: 'Achievements', variant: 'heading' },
                    { atom: 'text', text: 'Celebration variant with gold theme', variant: 'muted' },
                    {
                      atom: 'button',
                      text: 'Show 3 Achievements',
                      variant: 'primary',
                      onClick: () => celebrationStore.showAchievements(),
                    },
                    {
                      atom: 'button',
                      text: 'Show 1 Achievement',
                      variant: 'secondary',
                      onClick: () => celebrationStore.showSingleAchievement(),
                    },
                  ],
                },
              ],
            },
            // Level up demo
            {
              organism: 'card',
              content: [
                {
                  molecule: 'stack',
                  direction: 'vertical',
                  gap: 'md',
                  align: 'center',
                  items: [
                    { atom: 'text', text: '⬆️', variant: 'heading' },
                    { atom: 'text', text: 'Level Up', variant: 'heading' },
                    { atom: 'text', text: 'Cyan theme with numeric icon', variant: 'muted' },
                    {
                      atom: 'button',
                      text: 'Level Up!',
                      variant: 'primary',
                      onClick: () => celebrationStore.showLevelUp(),
                    },
                  ],
                },
              ],
            },
            // Onboarding demo
            {
              organism: 'card',
              content: [
                {
                  molecule: 'stack',
                  direction: 'vertical',
                  gap: 'md',
                  align: 'center',
                  items: [
                    { atom: 'text', text: '👋', variant: 'heading' },
                    { atom: 'text', text: 'Onboarding', variant: 'heading' },
                    { atom: 'text', text: 'Default variant, 4 steps', variant: 'muted' },
                    {
                      atom: 'button',
                      text: 'Start Tour',
                      variant: 'primary',
                      onClick: () => celebrationStore.showOnboarding(),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // Slide Modals (rendered but hidden until triggered)
    {
      organism: 'slide-modal',
      id: 'achievement-modal',
      open: () => celebrationStore.achievementModalOpen,
      onClose: () => celebrationStore.closeAchievements(),
      slides: () => celebrationStore.achievementSlides,
      variant: 'celebration',
      nextText: 'Awesome!',
      closeText: 'Done!',
      onComplete: () => console.log('All achievements viewed!'),
    },
    {
      organism: 'slide-modal',
      id: 'levelup-modal',
      open: () => celebrationStore.levelUpModalOpen,
      onClose: () => celebrationStore.closeLevelUp(),
      slides: () => celebrationStore.getLevelUpSlides(),
      variant: 'celebration',
      closeText: 'Continue',
      showDots: false,
    },
    {
      organism: 'slide-modal',
      id: 'onboarding-modal',
      open: () => celebrationStore.onboardingModalOpen,
      onClose: () => celebrationStore.closeOnboarding(),
      slides: () => celebrationStore.getOnboardingSlides(),
      variant: 'onboarding',
      showArrows: true,
      nextText: 'Next',
      prevText: 'Back',
      closeText: 'Get Started',
    },
  ],
};
