import { formatCurrency, formatCurrencyWithGST } from '../../src/utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats whole numbers with two decimal places', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats decimals with comma separators', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats large numbers with comma separators', () => {
    expect(formatCurrency(25000)).toBe('$25,000.00');
  });

  it('formats numbers with fractional cents', () => {
    expect(formatCurrency(99.999)).toBe('$100.00');
  });
});

describe('formatCurrencyWithGST', () => {
  it('returns ex-gst, gst, and inc-gst values', () => {
    const result = formatCurrencyWithGST(100);
    expect(result.exGst).toBe('$100.00');
    expect(result.gst).toBe('$10.00');
    expect(result.incGst).toBe('$110.00');
  });
});
