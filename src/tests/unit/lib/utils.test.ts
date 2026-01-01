import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz')
  })

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    expect(cn('foo', null, 'bar')).toBe('foo bar')
  })

  it('should merge Tailwind classes correctly', () => {
    // twMerge should handle conflicting Tailwind classes
    expect(cn('px-4', 'px-6')).toBe('px-6')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should handle object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })

  it('should handle complex combinations', () => {
    expect(
      cn(
        'base-class',
        true && 'conditional-true',
        false && 'conditional-false',
        { 'object-true': true, 'object-false': false },
        ['array-1', 'array-2']
      )
    ).toBe('base-class conditional-true object-true array-1 array-2')
  })
})
