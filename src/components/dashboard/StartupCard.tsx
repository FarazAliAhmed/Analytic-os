import Image from 'next/image';
import { FaRegStar } from 'react-icons/fa';

interface StartupCardProps {
    name: string;
    symbol: string;
    price: number;
    change: number;
    logo: string;
}

export default function StartupCard({ name, symbol, price, change, logo }: StartupCardProps) {
    return (
        <div className="bg-secondary rounded-lg p-4 min-w-[200px] flex flex-col items-start border border-borderColor">
            <div className="flex items-center justify-between gap-2 mb-2">
                <div><Image src={logo} alt={symbol} width={28} height={28} className="rounded-full" />
                    <div>
                        <div className="font-semibold">{symbol}</div>
                        <div className="text-xs text-gray-400">{name}</div>
                    </div></div>

                <FaRegStar />
            </div>
            <div className="font-bold text-lg">${price}</div>
            <div className={`text-sm ${change < 0 ? 'text-red-500' : 'text-green-400'}`}>{change > 0 ? '+' : ''}{change}%</div>
        </div>
    );
} 