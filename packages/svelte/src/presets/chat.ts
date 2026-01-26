/**
 * Chat preset - components for building chat interfaces
 * Includes chat bubbles, typing indicators, message lists, and full chat panels
 */
import type { Preset } from '@daui/core';

// Atoms
import ChatBubble from '../atoms/ChatBubble.svelte';
import TypingIndicator from '../atoms/TypingIndicator.svelte';

// Molecules
import ChatInput from '../molecules/ChatInput.svelte';
import ChatHeader from '../molecules/ChatHeader.svelte';
import ChatMessagesList from '../molecules/ChatMessagesList.svelte';

// Organisms
import ChatPanel from '../organisms/ChatPanel.svelte';

export const chat: Preset = {
  atoms: {
    'chat-bubble': ChatBubble,
    'typing-indicator': TypingIndicator,
  },
  molecules: {
    'chat-input': ChatInput,
    'chat-header': ChatHeader,
    'chat-messages-list': ChatMessagesList,
  },
  organisms: {
    'chat-panel': ChatPanel,
  },
};
