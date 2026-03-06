import React from 'react';
import { render } from '@testing-library/react-native';
import StatusPill from '../../src/components/common/StatusPill';

describe('StatusPill', () => {
  it('renders correct label for "enroute"', () => {
    const { getByText } = render(<StatusPill status="enroute" />);
    expect(getByText('En Route')).toBeTruthy();
  });

  it('renders correct label for "dispatched"', () => {
    const { getByText } = render(<StatusPill status="dispatched" />);
    expect(getByText('Dispatched')).toBeTruthy();
  });

  it('renders correct label for "scheduled"', () => {
    const { getByText } = render(<StatusPill status="scheduled" />);
    expect(getByText('Scheduled')).toBeTruthy();
  });

  it('renders correct label for "delivered"', () => {
    const { getByText } = render(<StatusPill status="delivered" />);
    expect(getByText('Delivered')).toBeTruthy();
  });

  it('renders correct label for "processing"', () => {
    const { getByText } = render(<StatusPill status="processing" />);
    expect(getByText('Processing')).toBeTruthy();
  });

  it('renders correct label for "cancelled"', () => {
    const { getByText } = render(<StatusPill status="cancelled" />);
    expect(getByText('Cancelled')).toBeTruthy();
  });

  it('renders correct label for "paid"', () => {
    const { getByText } = render(<StatusPill status="paid" />);
    expect(getByText('Paid')).toBeTruthy();
  });

  it('renders correct label for "unpaid"', () => {
    const { getByText } = render(<StatusPill status="unpaid" />);
    expect(getByText('Unpaid')).toBeTruthy();
  });

  it('renders the raw status for unknown statuses', () => {
    const { getByText } = render(<StatusPill status="custom-status" />);
    expect(getByText('custom-status')).toBeTruthy();
  });

  it('renders with md size', () => {
    const { getByText } = render(<StatusPill status="delivered" size="md" />);
    expect(getByText('Delivered')).toBeTruthy();
  });
});
