import React from 'react';

const PairInfoCard: React.FC = () => (
    <div className="bg-[#151517] rounded-lg p-4 text-gray-200">
        <div className="mb-2 flex justify-between"><span>Pair created</span><span>8h 38m ago</span></div>
        <div className="mb-2 flex justify-between"><span>Pooled BWAH</span><span>56,832,948 <span className="text-xs text-gray-400">$79K</span></span></div>
        <div className="mb-2 flex justify-between"><span>Pooled SOL</span><span>552.22 <span className="text-xs text-gray-400">$79K</span></span></div>
        <div className="mb-2 flex justify-between"><span>Pair</span><span>9hpCN...C8vR</span></div>
        <div className="mb-2 flex justify-between"><span>PYSK</span><span>8sv4W...pump</span></div>
    </div>
);

export default PairInfoCard; 