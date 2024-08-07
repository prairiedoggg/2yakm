/// <reference types="vite/client" />

// lodash-es.d.ts
declare module 'lodash-es' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; maxWait?: number; trailing?: boolean }
  ): T;
}
