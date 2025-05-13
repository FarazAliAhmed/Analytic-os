import React from 'react';
import OverviewCard from './OverviewCard';
import PairInfoCard from './PairInfoCard';

const Sidebar: React.FC = () => (
    <div className="space-y-6">
        <OverviewCard />
        <PairInfoCard />
    </div>
);

export default Sidebar; 