"use client"

import { useState, useRef, useEffect } from "react";
import SearchBar from '../common/SearchBar';
import FiltersButton from '../common/FiltersButton';
import ListStartupButton from '../common/ListStartupButton';
import TrendingStartups from '../components/dashboard/TrendingStartups';
import Tabs from '../components/dashboard/Tabs';
import TopTable from '../components/dashboard/TopTable';
import FiltersModal from '../components/dashboard/FiltersModal';
import SearchModal from "@/components/dashboard/SearchModal";


export default function DashboardContainer() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const searchModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchModalRef.current && !searchModalRef.current.contains(event.target as Node)) {
                setShowSearchModal(false);
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setShowSearchModal(false);
        }
        if (showSearchModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showSearchModal]);

    return (
        <div className='flex-1'>
            <section className="mt-8 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 sm:gap-0">
                        <h2 className="text-base xs:text-lg sm:text-xl font-semibold">
                            Explore Startups
                            <span className="ml-2 bg-white text-[#013131] font-medium text-xs xs:text-sm px-2 py-1 rounded-full">13 new</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:gap-3 sm:justify-end">
                        <SearchBar onFocus={() => setShowSearchModal(true)} />
                        <div className="flex">
                            <FiltersButton onClick={() => setShowFilters(true)} />
                            <ListStartupButton />
                        </div>
                    </div>
                </div>
                <TrendingStartups />
            </section>
            <section className="mt-8">
                <Tabs />
                <TopTable />
            </section>
            <FiltersModal open={showFilters} onClose={() => setShowFilters(false)} />
            {showSearchModal && <SearchModal ref={searchModalRef} onClose={() => setShowSearchModal(false)} />}
        </div>
    );
}