import { icons } from "../../../public/icons";
import GainerRow from "./GainerRow";


const gainers = [
    { logo: icons.weth, name: 'PYSK', company: 'Paystack Tech Ltd', price: 0.0054, change: 6.82, industry: 'Software', annualYield: '20%', marketCap: '$375,088,722.47', chart: icons.chart },
    { logo: icons.weth, name: 'WISP', company: 'Wisper Inc.', price: 1.81, change: 5.71, industry: 'EdTech', annualYield: '15%', marketCap: '$1,180,461,481.40', chart: icons.chart },
    { logo: icons.weth, name: 'EDRX', company: 'Edurex Service Inc.', price: 0.13, change: 4.63, industry: 'Fintech', annualYield: '10%', marketCap: '$99,685,507.10', chart: icons.chart },
    { logo: icons.weth, name: 'HYNET', company: 'Hynet Tech Ltd', price: 0.64, change: 3.24, industry: 'Software', annualYield: '5%', marketCap: '$63,912,251.45', chart: icons.chart },
];

export default function TopTable() {
    return (
        <div className="bg-secondary rounded-lg pt-4 px-4 overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-left text-gray-400 text-sm">
                        <th className="py-3 px-4"></th>
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Industry</th>
                        <th className="py-3 px-4">Annual Yield</th>
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