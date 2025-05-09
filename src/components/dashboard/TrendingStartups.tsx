import { icons } from '../../../public/icons';
import StartupCard from './StartupCard';

const startups = [
    { name: 'Everipedia IQ', symbol: 'IQ', price: 0.0041, change: -0.52, logo: icons.company },
    {
        name: 'Tesla Corp', symbol: 'WEETH', price: 1950.63, change: -0.01, logo: icons.company
    },
    { name: 'Balancer', symbol: 'BAL', price: 1.05, change: -3.69, logo: icons.company },
    { name: 'Methformin', symbol: 'XAUT', price: 3274.71, change: 1.03, logo: icons.company },
    { name: 'BNB', symbol: 'BNB', price: 785.96, change: 0, logo: icons.company },
];

export default function TrendingStartups() {
    return (
        <div className="mt-4 flex gap-4 overflow-x-auto">
            {startups.map((startup) => (
                <StartupCard key={startup.symbol} {...startup} />
            ))}
        </div>
    );
} 