"use client"

import { useState, useRef, useEffect } from "react";
import SearchBar from '../common/SearchBar';
import FiltersButton from '../common/FiltersButton';
import ListStartupButton from '../common/ListStartupButton';
import TrendingStartups from '../components/dashboard/TrendingStartups';
import Tabs from '../components/dashboard/Tabs';
import TopTable from '../components/dashboard/TopTable';
import FiltersDropdown from '../components/dashboard/FiltersDropdown';
import SearchDropdown from '@/components/dashboard/SearchDropdown';

export default function DashboardContainer() {
    const [showFilters, setShowFilters] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const searchDropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside and escape
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const dropdown = document.getElementById('filters-dropdown');
            const dropdownBackdrop = document.getElementById('filters-dropdown-backdrop');
            const filtersButton = document.querySelector('[class*="FiltersButton"]') as HTMLElement;

            if (showFilters && dropdown && dropdownBackdrop) {
                if (!dropdown.contains(event.target as Node) &&
                    !dropdownBackdrop.contains(event.target as Node) &&
                    (!filtersButton || !filtersButton.contains(event.target as Node))) {
                    setShowFilters(false);
                }
            }
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setShowFilters(false);
                setShowSearchDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showFilters]);

    return (
        <div className='flex-1'>
            <section className="mt-8 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 sm:gap-0">
                        <h2 className="text-base xs:text-lg sm:text-xl font-semibold">
                            Explore Tokens
                            <span className="ml-2 bg-white text-[#013131] font-medium text-xs xs:text-sm px-2 py-1 rounded-full">13 new</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:gap-3 sm:justify-end relative">
                        <div ref={searchDropdownRef}>
                            <SearchBar onClick={() => setShowSearchDropdown(true)} />
                            {showSearchDropdown && (
                                <SearchDropdown
                                    isOpen={showSearchDropdown}
                                    onClose={() => setShowSearchDropdown(false)}
                                />
                            )}
                        </div>
                        <div className="flex relative">
                            <FiltersButton onClick={() => setShowFilters(!showFilters)} />
                            <ListStartupButton />
                        </div>
                    </div>
                </div>
                <TrendingStartups />
            </section>
            <section className="mt-8">
                <Tabs onTabChange={setActiveTab} />
                <TopTable activeTab={activeTab} />
            </section>
            <FiltersDropdown
                id="filters-dropdown"
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
            />
        </div>
    );
}
