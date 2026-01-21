"use client";

import React, { useState, useEffect } from 'react';
import ToggleSwitch from '@/common/ToggleSwitch';
import { Check, AlertCircle, Bell } from 'lucide-react';

interface PriceAlertSettingsProps {
  className?: string;
}

const PriceAlertSettingsSimple: React.FC<PriceAlertSettingsProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className={`bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#4459FF] border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-400">Loading price alert settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-[#4459FF]" />
          <div className="font-semibold text-white">Price Alert Settings</div>
        </div>
        <div className="text-gray-400 text-sm">
          Get notified when token prices change by your specified threshold
        </div>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg text-sm flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400">
          <Check className="w-4 h-4" />
          {message}
        </div>
      )}

      <div className="flex items-center justify-between py-4 border-b border-[#23262F] mb-6">
        <div>
          <div className="text-white font-medium">Enable Price Alerts</div>
          <div className="text-gray-400 text-xs mt-1">
            Receive notifications when token prices change significantly
          </div>
        </div>
        <ToggleSwitch
          checked={enabled}
          onChange={(value) => {
            setEnabled(value);
            setMessage(`Price alerts ${value ? 'enabled' : 'disabled'}`);
            setTimeout(() => setMessage(null), 3000);
          }}
        />
      </div>

      <div className="bg-[#4459FF]/5 border border-[#4459FF]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#4459FF] mt-0.5" />
          <div>
            <div className="text-[#4459FF] font-medium text-sm mb-1">Price Alert Settings</div>
            <div className="text-gray-400 text-sm">
              This is a simplified version of the price alert settings. The full implementation includes threshold configuration, token selection, and active alerts management.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertSettingsSimple;