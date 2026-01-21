import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PriceAlertSettings from '../PriceAlertSettings';

// Mock fetch
global.fetch = jest.fn();

// Mock the icons
jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
}));

// Mock ToggleSwitch
jest.mock('@/common/ToggleSwitch', () => {
  return function MockToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
    return (
      <button
        data-testid="toggle-switch"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        {checked ? 'ON' : 'OFF'}
      </button>
    );
  };
});

const mockPriceAlertData = {
  success: true,
  data: {
    settings: {
      enabled: true,
      thresholdPercentage: 5.0,
      watchedTokens: ['BTC', 'ETH']
    },
    priceAlerts: [
      {
        id: '1',
        tokenSymbol: 'BTC',
        thresholdPercentage: 5.0,
        isActive: true,
        lastTriggeredAt: null,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    availableTokens: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        priceChange24h: 2.5
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3000,
        priceChange24h: -1.2
      }
    ]
  }
};

describe('PriceAlertSettings', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<PriceAlertSettings />);
    
    expect(screen.getByText('Loading price alert settings...')).toBeInTheDocument();
  });

  it('renders price alert settings after loading', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceAlertData
    });

    render(<PriceAlertSettings />);

    await waitFor(() => {
      expect(screen.getByText('Price Alert Settings')).toBeInTheDocument();
    });

    expect(screen.getByText('Enable Price Alerts')).toBeInTheDocument();
    expect(screen.getByText('Default Threshold Percentage')).toBeInTheDocument();
    expect(screen.getByText('Active Price Alerts')).toBeInTheDocument();
  });

  it('displays active alerts', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceAlertData
    });

    render(<PriceAlertSettings />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    expect(screen.getByText('Alert at ±5% price change')).toBeInTheDocument();
  });

  it('handles toggle switch for enabling/disabling alerts', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPriceAlertData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Updated' })
      });

    render(<PriceAlertSettings />);

    await waitFor(() => {
      expect(screen.getByTestId('toggle-switch')).toBeInTheDocument();
    });

    const toggleSwitch = screen.getByTestId('toggle-switch');
    fireEvent.click(toggleSwitch);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/settings/price-alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: false })
      });
    });
  });

  it('shows add alert form when Add Alert button is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceAlertData
    });

    render(<PriceAlertSettings />);

    await waitFor(() => {
      expect(screen.getByText('Add Alert')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add Alert');
    fireEvent.click(addButton);

    expect(screen.getByText('Token')).toBeInTheDocument();
    expect(screen.getByText('Threshold (%)')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('handles error states', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<PriceAlertSettings />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load price alert settings/)).toBeInTheDocument();
    });
  });
});