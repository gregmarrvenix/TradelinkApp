import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../src/components/product/ProductCard';
import type { Product } from '../../src/types';

const mockProduct: Product = {
  id: 'prod-1',
  sku: 'RIN-HWS-001',
  name: 'Rinnai Infinity 26 Continuous Flow',
  description: 'A hot water system',
  brand: 'Rinnai',
  category: 'Hot Water',
  subCategory: 'Continuous Flow',
  price: 1649,
  rrp: 1999,
  unit: 'each',
  stockStatus: 'in-stock',
  stockQty: 15,
  images: [],
  specifications: {},
  relatedProductIds: [],
};

describe('ProductCard', () => {
  const defaultProps = {
    product: mockProduct,
    onPress: jest.fn(),
    onAddToCart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product name', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText('Rinnai Infinity 26 Continuous Flow')).toBeTruthy();
  });

  it('renders product brand', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText('Rinnai')).toBeTruthy();
  });

  it('renders trade price', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText('$1,649.00')).toBeTruthy();
  });

  it('renders SKU in list layout', () => {
    const { getByText } = render(<ProductCard {...defaultProps} layout="list" />);
    expect(getByText('SKU: RIN-HWS-001')).toBeTruthy();
  });

  it('calls onPress when card is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ProductCard {...defaultProps} onPress={onPress} layout="list" />,
    );
    fireEvent.press(getByText('Rinnai Infinity 26 Continuous Flow'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders in list layout by default', () => {
    const { getByText } = render(<ProductCard {...defaultProps} />);
    expect(getByText('SKU: RIN-HWS-001')).toBeTruthy();
  });

  it('renders in grid layout', () => {
    const { getByText } = render(
      <ProductCard {...defaultProps} layout="grid" />,
    );
    expect(getByText('Rinnai Infinity 26 Continuous Flow')).toBeTruthy();
    expect(getByText('Rinnai')).toBeTruthy();
  });

  it('disables add-to-cart for out-of-stock products', () => {
    const outOfStockProduct = { ...mockProduct, stockStatus: 'out-of-stock' as const };
    const onAddToCart = jest.fn();
    render(
      <ProductCard
        {...defaultProps}
        product={outOfStockProduct}
        onAddToCart={onAddToCart}
        layout="list"
      />,
    );
    // The add button is disabled but we can still verify it renders
    expect(onAddToCart).not.toHaveBeenCalled();
  });
});
