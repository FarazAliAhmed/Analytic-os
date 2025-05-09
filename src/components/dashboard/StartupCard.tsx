interface StartupCardProps {
    name: string;
    symbol: string;
    price: number;
    change: number;
    logo: string;
}

export default function StartupCard({ name, symbol, price, change, logo }: StartupCardProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 min-w-[180px] flex flex-col items-start border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
                <img src={logo} alt={symbol} className="w-7 h-7 rounded-full" />
                <div>
                    <div className="font-semibold">{symbol}</div>
                    <div className="text-xs text-gray-400">{name}</div>
                </div>
            </div>
            <div className="font-bold text-lg">${price}</div>
            <div className={`text-sm ${change < 0 ? 'text-red-500' : 'text-green-400'}`}>{change > 0 ? '+' : ''}{change}%</div>
        </div>
    );
} 