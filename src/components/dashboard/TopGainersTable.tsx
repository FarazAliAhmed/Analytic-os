import GainerRow from "./GainerRow";


const gainers = [
    { logo: '/pysk.png', name: 'PYSK', company: 'Paystack Tech Ltd', price: 0.0054, change: 6.82, industry: 'Software', liquidity: '$302K', marketCap: '$375,088,722.47', chart: '/chart1.png' },
    { logo: '/wisp.png', name: 'WISP', company: 'Wisper Inc.', price: 1.81, change: 5.71, industry: 'EdTech', liquidity: '$6.8m', marketCap: '$1,180,461,481.40', chart: '/chart2.png' },
    { logo: '/edrx.png', name: 'EDRX', company: 'Edurex Service Inc.', price: 0.13, change: 4.63, industry: 'Fintech', liquidity: '$448K', marketCap: '$99,685,507.10', chart: '/chart3.png' },
    { logo: '/hynet.png', name: 'HYNET', company: 'Hynet Tech Ltd', price: 0.64, change: 3.24, industry: 'Software', liquidity: '$5.7m', marketCap: '$63,912,251.45', chart: '/chart4.png' },
];

export default function TopGainersTable() {
    return (
        <div className="bg-gray-900 rounded-lg mt-4 overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-left text-gray-400 text-sm">
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Industry</th>
                        <th className="py-3 px-4">Liquidity</th>
                        <th className="py-3 px-4">Market cap</th>
                        <th className="py-3 px-4">Last 7d</th>
                    </tr>
                </thead>
                <tbody>
                    {gainers.map((g) => (
                        <GainerRow key={g.name} {...g} />
                    ))}
                </tbody>
            </table>
        </div>
    );
} 