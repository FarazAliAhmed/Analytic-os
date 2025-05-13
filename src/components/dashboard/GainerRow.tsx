import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa";

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

    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/token`);
    }

    return (
        <tr className="border-t text-white cursor-pointer border-gray-800 hover:bg-gray-800 transition" onClick={handleClick}>
            <td className="py-3 px-4">
                <FaRegStar />
            </td>
            <td className="py-3 px-4 flex items-center gap-3">
                <Image src={logo} alt={name} width={28} height={28} className="rounded-full" />
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
                <Image src={chart} alt="chart" className="h-8" />
            </td>
        </tr>
    );
} 