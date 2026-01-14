import { icons } from "../../../public/icons";
import GainerRow from "./GainerRow";

const gainers = [
  {
    logo: icons.weth,
    name: "PYSK",
    company: "Paystack Tech Ltd",
    price: 0.0054,
    change: 6.82,
    industry: "Software",
    annualYield: "20%",
    marketCap: "₦600,142,116,000",
    chart: icons.chart,
  },
  {
    logo: icons.weth,
    name: "WISP",
    company: "Wisper Inc.",
    price: 1.81,
    change: 5.71,
    industry: "EdTech",
    annualYield: "15%",
    marketCap: "₦1,888,738,370,000",
    chart: icons.chart,
  },
  {
    logo: icons.weth,
    name: "EDRX",
    company: "Edurex Service Inc.",
    price: 0.13,
    change: 4.63,
    industry: "Fintech",
    annualYield: "10%",
    marketCap: "₦159,496,811,000",
    chart: icons.chart,
  },
  {
    logo: icons.weth,
    name: "HYNET",
    company: "Hynet Tech Ltd",
    price: 0.64,
    change: 3.24,
    industry: "Software",
    annualYield: "5%",
    marketCap: "₦102,259,602,000",
    chart: icons.chart,
  },
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
            <th className="py-3 px-4">Volume</th>
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
