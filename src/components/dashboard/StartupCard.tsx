'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaRegStar } from 'react-icons/fa';

interface StartupCardProps {
    name: string;
    symbol: string;
    price: number;
    change: number;
    logo: string;
}

export default function StartupCard({ name, symbol, price, change, logo }: StartupCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/token?symbol=${symbol}`);
    };

    return (
        <div 
            onClick={handleClick}
            className="bg-[#18191B] border border-[#232325] rounded-xl p-4 min-w-[220px] flex flex-col gap-3 shadow-sm cursor-pointer hover:border-[#3a3a3c] transition-colors"
        >
            <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                    <Image src={logo} alt={symbol} width={28} height={28} className="rounded-full" />
                    <div>
                        <div className="font-bold text-white text-base leading-tight">{symbol}</div>
                        <div className="text-xs text-gray-400 leading-tight">{name}</div>
                    </div>
                </div>
                <FaRegStar className="text-gray-400 text-lg" />
            </div>
            <div className="flex items-end justify-between w-full mt-2">
                <div className="font-bold text-xl text-white">₦{price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`font-bold text-lg ml-4 ${change < 0 ? 'text-[#FF4D4F]' : 'text-green-400'}`}>{change > 0 ? '+' : ''}{change}%</div>
            </div>
        </div>
    );
} 