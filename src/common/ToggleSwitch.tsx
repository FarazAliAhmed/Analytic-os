import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
    <button
        type="button"
        aria-pressed={checked}
        className={`w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none border border-[#23262F] bg-white flex items-center`}
        onClick={() => onChange(!checked)}
    >
        <span
            className={`w-6 h-6 bg-black rounded-full shadow transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`}
        />
    </button>
);

export default ToggleSwitch; 