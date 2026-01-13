import React from 'react';

interface FiltersButtonProps {
    onClick?: () => void;
    ref?: React.RefObject<HTMLButtonElement>;
}

const FiltersButton = React.forwardRef<HTMLButtonElement, { onClick?: () => void }>(
    function FiltersButton({ onClick }, ref) {
        return (
            <button
                ref={ref}
                onClick={onClick}
                className="flex items-center gap-2 px-4 py-2 rounded cursor-pointer text-gray-200 hover:bg-secondary sm:w-auto"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
            </button>
        );
    }
);

export default FiltersButton;
