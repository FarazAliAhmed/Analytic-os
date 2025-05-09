interface GainerRowProps {
    logo: string;
    name: string;
    company: string;
    price: number;
    change: number;
    industry: string;
    liquidity: string;
    marketCap: string;
    chart: string;
}

export default function GainerRow({ logo, name, company, price, change, industry, liquidity, marketCap, chart }: GainerRowProps) {
    return (
        <tr className="border-t border-gray-800 hover:bg-gray-800 transition">
            <td className="py-3 px-4 flex items-center gap-3">
                <img src={logo} alt={name} className="w-7 h-7 rounded-full" />
                <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-xs text-gray-400">{company}</div>
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="font-semibold">${price}</div>
                <div className="text-xs text-green-400">{change > 0 ? '+' : ''}{change}%</div>
            </td>
            <td className="py-3 px-4">{industry}</td>
            <td className="py-3 px-4">{liquidity}</td>
            <td className="py-3 px-4">{marketCap}</td>
            <td className="py-3 px-4">
                <img src={chart} alt="chart" className="h-8" />
            </td>
        </tr>
    );
} 