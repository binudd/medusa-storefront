import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names, resolving conflicts (e.g. `p-2 p-4` -> `p-4`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shallow structural equality for flat records of primitives.
 * Used to match a set of selected option values against a variant.
 */
export function shallowEqual(
  a: Record<string, unknown> | undefined,
  b: Record<string, unknown> | undefined
) {
  if (a === b) return true
  if (!a || !b) return false
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every((key) => a[key] === b[key])
}

/**
 * Pick a subset of keys from an object.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) out[key] = obj[key]
  }
  return out
}

/**
 * Clamp a number within [min, max].
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
