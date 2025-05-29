import React, { useState } from 'react';
import { RiFileCopyFill, RiShare2Fill } from 'react-icons/ri';
import ToggleSwitch from './ToggleSwitch';

const AccountContainer = () => {
    const [pushNotifications, setPushNotifications] = useState(false);
    const [autoLock, setAutoLock] = useState(false);
    const [priceAlerts, setPriceAlerts] = useState(false);
    const [hideBalances, setHideBalances] = useState(false);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                {/* Wallet Card */}
                <div className="bg-[#121314] border border-[#262626] rounded-lg p-8 flex flex-col items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-400 mb-4" />
                    <div className="flex items-center gap-2">
                        <span className="text-gray-300">0x71C7...1234</span>
                        <RiShare2Fill />
                        <RiFileCopyFill />
                    </div>
                </div>

                {/* Wallet Settings */}
                <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
                    <div className="mb-6">
                        <div className="font-semibold text-white">Wallet Settings</div>
                        <div className="text-gray-400 text-sm">Configure your wallet preferences</div>
                    </div>
                    <div className="divide-y divide-[#23262F]">
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <div className="text-white">Push Notifications</div>
                                <div className="text-gray-400 text-xs">Receive transaction alerts</div>
                            </div>
                            <ToggleSwitch checked={pushNotifications} onChange={setPushNotifications} />
                        </div>
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <div className="text-white">Auto-Lock Wallet</div>
                                <div className="text-gray-400 text-xs">Lock after 15 minutes of inactivity</div>
                            </div>
                            <ToggleSwitch checked={autoLock} onChange={setAutoLock} />
                        </div>
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <div className="text-white">Price Alerts</div>
                                <div className="text-gray-400 text-xs">Notify when token prices change significantly</div>
                            </div>
                            <ToggleSwitch checked={priceAlerts} onChange={setPriceAlerts} />
                        </div>
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <div className="text-white">Hide Token Balances</div>
                                <div className="text-gray-400 text-xs">Mask financial information</div>
                            </div>
                            <ToggleSwitch checked={hideBalances} onChange={setHideBalances} />
                        </div>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="bg-[#2626264D] border border-[#262626] rounded-lg p-6">
                    <div className="mb-4">
                        <div className="font-semibold text-white">Display</div>
                        <div className="text-gray-400 text-sm">Appearance settings</div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="text-white">Currency Display</div>
                            <div className="text-gray-400 text-xs">Select primary currency</div>
                        </div>
                        <select className="bg-[#23262F] text-white rounded px-3 py-1">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountContainer; 