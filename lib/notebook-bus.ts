"use client";

type Listener<T> = (payload: T) => void;

class Bus<EventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<Listener<unknown>>>();

  on<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn as Listener<unknown>);
    return () => this.off(event, fn);
  }

  off<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>) {
    this.listeners.get(event)?.delete(fn as Listener<unknown>);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
    this.listeners.get(event)?.forEach((fn) => (fn as Listener<EventMap[K]>)(payload));
  }
}

export type NotebookEventMap = {
  "scroll-to": { id: string; trigger?: boolean };
  "restart": void;
  "surprise": void;
  "help": void;
  "execute-cell": { id: string };
};

export const notebookBus = new Bus<NotebookEventMap>();
