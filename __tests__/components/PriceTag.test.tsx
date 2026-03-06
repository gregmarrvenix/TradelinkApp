import React from 'react';
import { render } from '@testing-library/react-native';
import PriceTag from '../../src/components/common/PriceTag';

describe('PriceTag', () => {
  it('shows formatted trade price', () => {
    const { getByText } = render(<PriceTag tradePrice={1234.5} />);
    expect(getByText('$1,234.50')).toBeTruthy();
  });

  it('shows RRP with strikethrough when provided', () => {
    const { getByText } = render(<PriceTag tradePrice={100} rrp={150} />);
    expect(getByText('RRP $150.00')).toBeTruthy();
  });

  it('does not show RRP when not provided', () => {
    const { queryByText } = render(<PriceTag tradePrice={100} />);
    expect(queryByText(/RRP/)).toBeNull();
  });

  it('does not show RRP when rrp is 0', () => {
    const { queryByText } = render(<PriceTag tradePrice={100} rrp={0} />);
    expect(queryByText(/RRP/)).toBeNull();
  });

  it('shows savings percentage when showSavings=true and rrp provided', () => {
    const { getByText } = render(
      <PriceTag tradePrice={80} rrp={100} showSavings />,
    );
    expect(getByText('SAVE 20%')).toBeTruthy();
  });

  it('does not show savings when showSavings=false', () => {
    const { queryByText } = render(
      <PriceTag tradePrice={80} rrp={100} showSavings={false} />,
    );
    expect(queryByText(/SAVE/)).toBeNull();
  });

  it('does not show savings when there are no savings', () => {
    const { queryByText } = render(
      <PriceTag tradePrice={100} rrp={100} showSavings />,
    );
    expect(queryByText(/SAVE/)).toBeNull();
  });

  it('renders with different sizes', () => {
    const { getByText: getSm } = render(<PriceTag tradePrice={50} size="sm" />);
    expect(getSm('$50.00')).toBeTruthy();

    const { getByText: getLg } = render(<PriceTag tradePrice={50} size="lg" />);
    expect(getLg('$50.00')).toBeTruthy();
  });
});
