"use client"

import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import SearchBar from '../common/SearchBar';
import FiltersButton from '../common/FiltersButton';
import ListStartupButton from '../common/ListStartupButton';
import TrendingStartups from '../components/dashboard/TrendingStartups';
import Tabs from '../components/dashboard/Tabs';
import TopGainersTable from '../components/dashboard/TopGainersTable';

export default function DashboardContainer() {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <main className="flex-1 p-8">
                <Header />
                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Explore Startups <span className="ml-2 bg-gray-800 text-xs px-2 py-1 rounded-full">13 new</span></h2>
                        <div className="flex items-center gap-3">
                            <SearchBar />
                            <FiltersButton />
                            <ListStartupButton />
                        </div>
                    </div>
                    <TrendingStartups />
                </section>
                <section className="mt-8">
                    <Tabs />
                    <TopGainersTable />
                </section>
            </main>
        </div>
    );
} 