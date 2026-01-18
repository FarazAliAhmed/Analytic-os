"use client";

import { Camera, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

const AccountContainer = () => {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = session?.user;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
  });

  // Update form data when session loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoLock, setAutoLock] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const imageUrl = preview || user?.image;

      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to update profile");
      } else {
        await updateSession();
        setMessage("Profile updated successfully!");
        if (preview) {
          setPreview(null);
        }
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address?: string | null) => {
    if (!address) return "0x71C7...1234";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">My Account</h1>
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Profile Settings */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
          <div className="mb-6">
            <div className="font-semibold text-white">Profile Settings</div>
            <div className="text-gray-400 text-sm">
              Manage your personal information
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes("success")
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1A1A1A] border-2 border-[#23262F]">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#4459FF] to-[#3448EE] flex items-center justify-center text-white text-2xl font-semibold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#4459FF] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#3448EE] transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <p className="text-sm text-gray-400 mt-2">Click to upload</p>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full bg-[#1A1A1A] border border-[#23262F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4459FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full bg-[#1A1A1A] border border-[#23262F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4459FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-[#1A1A1A] border border-[#23262F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4459FF]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#1A1A1A] border border-[#23262F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4459FF]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#1A1A1A] border border-[#23262F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4459FF]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-[#4459FF] hover:bg-[#3448EE] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        {/* <div className="bg-[#121314] border border-[#262626] rounded-lg p-8 flex flex-col items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-400 mb-4 overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#4459FF] to-[#3448EE] flex items-center justify-center text-white text-xl font-semibold">
                                {getInitials(user?.firstName, user?.lastName)}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-300">{formatAddress(user?.walletAddress)}</span>
                        <RiShare2Fill className="text-gray-400" />
                        <RiFileCopyFill className="text-gray-400 cursor-pointer" />
                    </div>
                </div> */}

        {/* Wallet Settings */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
          <div className="mb-6">
            <div className="font-semibold text-white">Wallet Settings</div>
            <div className="text-gray-400 text-sm">
              Configure your wallet preferences
            </div>
          </div>
          <div className="divide-y divide-[#23262F]">
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-white">Push Notifications</div>
                <div className="text-gray-400 text-xs">
                  Receive transaction alerts
                </div>
              </div>
              <ToggleSwitch
                checked={pushNotifications}
                onChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-white">Auto-Lock Wallet</div>
                <div className="text-gray-400 text-xs">
                  Lock after 15 minutes of inactivity
                </div>
              </div>
              <ToggleSwitch checked={autoLock} onChange={setAutoLock} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-white">Price Alerts</div>
                <div className="text-gray-400 text-xs">
                  Notify when token prices change significantly
                </div>
              </div>
              <ToggleSwitch checked={priceAlerts} onChange={setPriceAlerts} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-white">Hide Token Balances</div>
                <div className="text-gray-400 text-xs">
                  Mask financial information
                </div>
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
              <div className="text-gray-400 text-xs">
                Select primary currency
              </div>
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
