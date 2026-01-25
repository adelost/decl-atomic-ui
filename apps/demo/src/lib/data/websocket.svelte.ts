/**
 * WebSocket Utilities for DAUI
 *
 * Provides WebSocket connection management with automatic
 * reconnection, message handling, and state tracking.
 */

// ============================================
// TYPES
// ============================================

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketOptions {
  /** Auto-reconnect on disconnect */
  autoReconnect?: boolean;
  /** Reconnect delay in ms */
  reconnectDelay?: number;
  /** Max reconnect attempts (0 = infinite) */
  maxReconnectAttempts?: number;
  /** Ping interval to keep connection alive (0 = disabled) */
  pingInterval?: number;
  /** Message to send as ping */
  pingMessage?: string | object;
  /** Called when connection opens */
  onOpen?: () => void;
  /** Called when connection closes */
  onClose?: (event: CloseEvent) => void;
  /** Called on error */
  onError?: (error: Event) => void;
}

export interface WebSocketState<T = unknown> {
  /** Current connection status */
  status: ConnectionStatus;
  /** Is connected */
  isConnected: boolean;
  /** Last received message */
  lastMessage: T | null;
  /** Last error */
  error: Event | null;
  /** Connect to WebSocket */
  connect: () => void;
  /** Disconnect */
  disconnect: () => void;
  /** Send a message */
  send: (data: string | object) => void;
  /** Subscribe to messages */
  subscribe: (handler: (message: T) => void) => () => void;
}

// ============================================
// CREATE WEBSOCKET
// ============================================

/**
 * Create a WebSocket connection with automatic reconnection
 *
 * @example
 * ```ts
 * const ws = createWebSocket<{ type: string; data: any }>(
 *   'wss://api.example.com/ws',
 *   { autoReconnect: true }
 * );
 *
 * // Subscribe to messages
 * ws.subscribe((msg) => {
 *   if (msg.type === 'member_joined') {
 *     memberStore.add(msg.data);
 *   }
 * });
 *
 * // Connect
 * ws.connect();
 *
 * // In page - show connection status
 * { atom: "text", text: () => ws.isConnected ? "🟢 Online" : "🔴 Offline" }
 * ```
 */
export function createWebSocket<T = unknown>(
  url: string,
  options: WebSocketOptions = {}
): WebSocketState<T> {
  const {
    autoReconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 10,
    pingInterval = 30000,
    pingMessage = 'ping',
    onOpen,
    onClose,
    onError,
  } = options;

  let socket: WebSocket | null = null;
  let status = $state<ConnectionStatus>('disconnected');
  let lastMessage = $state<T | null>(null);
  let error = $state<Event | null>(null);
  let reconnectAttempts = 0;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let pingIntervalId: ReturnType<typeof setInterval> | null = null;

  const subscribers = new Set<(message: T) => void>();

  const isConnected = $derived(status === 'connected');

  function connect() {
    if (socket?.readyState === WebSocket.OPEN) return;

    status = 'connecting';
    error = null;

    try {
      socket = new WebSocket(url);

      socket.onopen = () => {
        status = 'connected';
        reconnectAttempts = 0;
        onOpen?.();
        startPing();
      };

      socket.onclose = (event) => {
        status = 'disconnected';
        stopPing();
        onClose?.(event);

        if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      socket.onerror = (event) => {
        error = event;
        status = 'error';
        onError?.(event);
      };

      socket.onmessage = (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          lastMessage = data as T;
          subscribers.forEach((handler) => handler(data as T));
        } catch {
          // If not JSON, pass raw data
          lastMessage = event.data as T;
          subscribers.forEach((handler) => handler(event.data as T));
        }
      };
    } catch {
      status = 'error';
      if (autoReconnect) {
        scheduleReconnect();
      }
    }
  }

  function disconnect() {
    stopPing();
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    reconnectAttempts = maxReconnectAttempts; // Prevent auto-reconnect
    socket?.close();
    socket = null;
    status = 'disconnected';
  }

  function send(data: string | object) {
    if (socket?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return;
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    socket.send(message);
  }

  function subscribe(handler: (message: T) => void): () => void {
    subscribers.add(handler);
    return () => subscribers.delete(handler);
  }

  function scheduleReconnect() {
    reconnectAttempts++;
    const delay = reconnectDelay * Math.pow(1.5, reconnectAttempts - 1);

    reconnectTimeout = setTimeout(
      () => {
        connect();
      },
      Math.min(delay, 30000)
    ); // Cap at 30 seconds
  }

  function startPing() {
    if (pingInterval <= 0) return;

    pingIntervalId = setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        const msg = typeof pingMessage === 'string' ? pingMessage : JSON.stringify(pingMessage);
        socket.send(msg);
      }
    }, pingInterval);
  }

  function stopPing() {
    if (pingIntervalId) {
      clearInterval(pingIntervalId);
      pingIntervalId = null;
    }
  }

  return {
    get status() {
      return status;
    },
    get isConnected() {
      return isConnected;
    },
    get lastMessage() {
      return lastMessage;
    },
    get error() {
      return error;
    },
    connect,
    disconnect,
    send,
    subscribe,
  };
}

// ============================================
// TYPED CHANNEL (for multiple message types)
// ============================================

export interface ChannelMessage<T extends string = string, D = unknown> {
  type: T;
  data: D;
}

/**
 * Create a typed WebSocket channel for handling multiple message types
 *
 * @example
 * ```ts
 * type Messages =
 *   | { type: 'member_joined'; data: Member }
 *   | { type: 'member_left'; data: { id: string } }
 *   | { type: 'chat'; data: ChatMessage };
 *
 * const channel = createTypedChannel<Messages>('wss://api.example.com/ws');
 *
 * channel.on('member_joined', (data) => memberStore.add(data));
 * channel.on('chat', (data) => chatStore.addMessage(data));
 *
 * channel.connect();
 * ```
 */
export function createTypedChannel<M extends ChannelMessage>(
  url: string,
  options: WebSocketOptions = {}
) {
  const ws = createWebSocket<M>(url, options);
  const handlers = new Map<string, Set<(data: any) => void>>();

  // Subscribe to all messages and route by type
  ws.subscribe((message) => {
    if (message && typeof message === 'object' && 'type' in message) {
      const typeHandlers = handlers.get(message.type);
      typeHandlers?.forEach((handler) => handler(message.data));
    }
  });

  function on<T extends M['type']>(
    type: T,
    handler: (data: Extract<M, { type: T }>['data']) => void
  ): () => void {
    if (!handlers.has(type)) {
      handlers.set(type, new Set());
    }
    handlers.get(type)!.add(handler);
    return () => handlers.get(type)?.delete(handler);
  }

  function emit<T extends M['type']>(type: T, data: Extract<M, { type: T }>['data']) {
    ws.send({ type, data });
  }

  return {
    ...ws,
    on,
    emit,
  };
}
