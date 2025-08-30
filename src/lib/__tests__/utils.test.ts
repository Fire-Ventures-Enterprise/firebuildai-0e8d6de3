import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-primary', 'bg-secondary');
    expect(result).toBe('text-primary bg-secondary');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should handle falsy values', () => {
    const result = cn('base-class', false, null, undefined, '');
    expect(result).toBe('base-class');
  });

  it('should merge Tailwind classes correctly', () => {
    // Should override conflicting classes
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['text-primary', 'bg-secondary'], 'border');
    expect(result).toBe('text-primary bg-secondary border');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'text-primary': true,
      'bg-secondary': false,
      'border': true,
    });
    expect(result).toBe('text-primary border');
  });
});