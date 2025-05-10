"use client"

import { useState } from "react";
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import SearchBar from '../common/SearchBar';
import FiltersButton from '../common/FiltersButton';
import ListStartupButton from '../common/ListStartupButton';
import TrendingStartups from '../components/dashboard/TrendingStartups';
import Tabs from '../components/dashboard/Tabs';
import TopTable from '../components/dashboard/TopTable';

export default function DashboardContainer() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="w-full flex min-h-screen bg-primary text-white">
            {/* Overlay for mobile sidebar */}
            {/* <div
                className={`
                    fixed w-64 inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden
                    ${sidebarOpen ? "block" : "hidden"}
                `}
                onClick={() => setSidebarOpen(false)}
            /> */}

            {/* Sidebar - passing the open state to the component */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 w-full bg-primary">
                <Header onOpenSidebar={() => setSidebarOpen(true)} />
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
                                <SearchBar />
                                <div className="flex">
                                    <FiltersButton />
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
                </div>
            </main>
        </div>
    );
}