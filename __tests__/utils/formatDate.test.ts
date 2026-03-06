import { formatDate, formatRelativeDate, formatTime } from '../../src/utils/formatDate';

describe('formatDate', () => {
  it('returns a readable date string', () => {
    const result = formatDate('2024-06-15');
    expect(result).toBe('15 Jun 2024');
  });

  it('accepts a custom format', () => {
    const result = formatDate('2024-06-15', 'YYYY-MM-DD');
    expect(result).toBe('2024-06-15');
  });

  it('handles Date objects', () => {
    const result = formatDate(new Date(2024, 0, 1));
    expect(result).toBe('01 Jan 2024');
  });
});

describe('formatRelativeDate', () => {
  it('returns "Today" for today', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe('Today');
  });

  it('returns "Yesterday" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeDate(yesterday.toISOString())).toBe('Yesterday');
  });

  it('returns relative time for older dates', () => {
    const old = new Date();
    old.setDate(old.getDate() - 10);
    const result = formatRelativeDate(old.toISOString());
    expect(result).toContain('ago');
  });
});

describe('formatTime', () => {
  it('returns formatted time', () => {
    const result = formatTime('2024-06-15T14:30:00');
    expect(result).toBe('2:30pm');
  });

  it('formats morning time', () => {
    const result = formatTime('2024-06-15T09:05:00');
    expect(result).toBe('9:05am');
  });
});
