import React from 'react';

const TransactionsTabs: React.FC = () => (
    <div className="bg-[#151517] rounded-lg p-4">
        <div className="flex space-x-6 border-b border-[#353945] mb-2">
            <button className="text-white border-b-2 border-blue-600 pb-2">Transactions</button>
            <button className="text-gray-400 pb-2">Holders (401)</button>
        </div>
        {/* Transactions Table Placeholder */}
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-400">
                <thead>
                    <tr className="text-gray-500">
                        <th className="py-2 px-2">DATE</th>
                        <th className="py-2 px-2">TYPE</th>
                        <th className="py-2 px-2">USD</th>
                        <th className="py-2 px-2">SHARES</th>
                        <th className="py-2 px-2">PRICE</th>
                        <th className="py-2 px-2">MAKER</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2 px-2">19s ago, Today</td>
                        <td className="py-2 px-2 text-green-500">Buy</td>
                        <td className="py-2 px-2 text-green-500">285.47</td>
                        <td className="py-2 px-2">203,996</td>
                        <td className="py-2 px-2 text-green-500">$0.001399</td>
                        <td className="py-2 px-2">28aevP</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-2">19s ago, Today</td>
                        <td className="py-2 px-2 text-green-500">Buy</td>
                        <td className="py-2 px-2 text-green-500">14.27</td>
                        <td className="py-2 px-2">10,238</td>
                        <td className="py-2 px-2 text-green-500">$0.001394</td>
                        <td className="py-2 px-2">28aevP</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-2">19s ago, Today</td>
                        <td className="py-2 px-2 text-red-500">Sell</td>
                        <td className="py-2 px-2 text-red-500">132.05</td>
                        <td className="py-2 px-2">95,012</td>
                        <td className="py-2 px-2 text-red-500">$0.001389</td>
                        <td className="py-2 px-2">28aevP</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default TransactionsTabs; 