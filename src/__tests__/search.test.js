import { describe, expect, it } from 'vitest';
import { destinations, SITE } from '../data/navigation.js';
import { searchDestinations } from '../lib/search.js';

const ids = (q) => searchDestinations(destinations, q).map((d) => d.id);

describe('navigation data', () => {
  it('has unique ids and only cynbit.in URLs', () => {
    expect(new Set(destinations.map((d) => d.id)).size).toBe(destinations.length);
    destinations.forEach((d) => expect(d.url.startsWith(SITE)).toBe(true));
  });
});

describe('searchDestinations', () => {
  it('returns everything for an empty query', () => expect(ids('  ')).toHaveLength(destinations.length));
  it('ignores case', () => expect(ids('CONTACT')[0]).toBe('contact'));
  it('maps the alias "about" to Our Story', () => expect(ids('about')[0]).toBe('story'));
  it('maps "jobs" to Careers', () => expect(ids('jobs')[0]).toBe('careers'));
  it('finds products by topic', () => expect(ids('rent')).toContain('tenantease'));
  it('requires every word to match', () => expect(ids('contact zzz')).toEqual([]));
  it('returns nothing for gibberish', () => expect(ids('qqqxyz')).toEqual([]));
  it('treats regex characters as plain text', () => expect(() => ids('(*[')).not.toThrow());
});
