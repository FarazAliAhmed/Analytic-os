import Image from 'next/image';

const mockData = [
    {
        logo: '/token.png',
        name: 'PYSK',
        company: 'Paystack Tech Ltd',
        price: 224.78,
        priceChange: 0.72,
        holdings: 7867.3,
        units: 35,
        avgCost: 190.25,
        totalYield: 1208.85,
        yieldPercent: 18.15,
        allocation: 13.6,
    },
    {
        logo: '/token.png',
        name: 'PYSK',
        company: 'Paystack Tech Ltd',
        price: 196.42,
        priceChange: -0.31,
        holdings: 4910.5,
        units: 25,
        avgCost: 162.35,
        totalYield: 851.75,
        yieldPercent: 20.98,
        allocation: 8.5,
    },
    {
        logo: '/token.png',
        name: 'PYSK',
        company: 'Paystack Tech Ltd',
        price: 892.35,
        priceChange: 2.43,
        holdings: 10708.2,
        units: 12,
        avgCost: 780.45,
        totalYield: 1344.0,
        yieldPercent: 14.32,
        allocation: 18.5,
    },
    {
        logo: '/token.png',
        name: 'PYSK',
        company: 'Paystack Tech Ltd',
        price: 428.37,
        priceChange: 0.87,
        holdings: 4283.7,
        units: 10,
        avgCost: 372.91,
        totalYield: 554.6,
        yieldPercent: 14.87,
        allocation: 7.4,
    },
    {
        logo: '/token.png',
        name: 'PYSK',
        company: 'Paystack Tech Ltd',
        price: 128.85,
        priceChange: 2.17,
        holdings: 3221.25,
        units: 5,
        avgCost: 92.64,
        totalYield: 905.25,
        yieldPercent: 39.05,
        allocation: 5.6,
    },
];

export default function PortfolioTable() {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-800">
                        <th className="py-3 px-4 font-medium">Asset</th>
                        <th className="py-3 px-4 font-medium">Price</th>
                        <th className="py-3 px-4 font-medium">Holdings</th>
                        <th className="py-3 px-4 font-medium">Avg. Cost</th>
                        <th className="py-3 px-4 font-medium">Total Yield</th>
                        <th className="py-3 px-4 font-medium">Allocation</th>
                        <th className="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.map((row, idx) => (
                        <tr key={idx} className="border-t border-gray-800 hover:bg-gray-900 transition">
                            <td className="py-3 px-4 flex items-center gap-3">
                                <Image src={row.logo} alt={row.name} width={28} height={28} className="rounded-full" />
                                <div>
                                    <div className="font-semibold text-white">{row.name}</div>
                                    <div className="text-xs text-gray-400">{row.company}</div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className={`font-semibold ${row.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>${row.price.toFixed(2)}</div>
                                <div className={`text-xs ${row.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{row.priceChange >= 0 ? '+' : ''}{row.priceChange}%</div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="font-semibold text-white">${row.holdings.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">{row.units} units</div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="font-semibold text-white">${row.avgCost.toFixed(2)}</div>
                                <div className="text-xs text-gray-400">per unit</div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="font-semibold text-green-400">+${row.totalYield.toLocaleString()}</div>
                                <div className="text-xs text-green-400">+{row.yieldPercent}%</div>
                            </td>
                            <td className="py-3 px-4 w-32">
                                <div className="flex items-center gap-2">
                                    <div className="w-full h-2 bg-gray-800 rounded">
                                        <div className="h-2 bg-white rounded" style={{ width: `${row.allocation}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-400">{row.allocation}%</span>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <button className="text-gray-400 hover:text-white text-xl">...</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 