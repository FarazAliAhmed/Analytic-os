export default function ListStartupForm() {
    return (
        <form className="bg-transparent">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                List your startup
                <span className="bg-[#E6F7FF] text-[#013131] text-xs px-2 py-1 rounded-full font-medium">new</span>
            </h2>
            <p className="text-gray-400 mb-8 text-base">Get your business listed on our exchange.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 text-sm">Company Name</label>
                    <input className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Enter the company name" />
                </div>
                <div>
                    <label className="block mb-2 text-sm">Ticker Symbol</label>
                    <input className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Enter ticker symbol" />
                </div>
                <div>
                    <label className="block mb-2 text-sm">Decimals</label>
                    <input className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Enter decimals" />
                </div>
                <div>
                    <label className="block mb-2 text-sm">Total Share Supply</label>
                    <input className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Enter total share supply" />
                </div>
            </div>
            <div className="mt-6">
                <label className="block mb-2 text-sm">Description</label>
                <textarea className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[100px]" placeholder="Enter the company name" />
            </div>
            <div className="flex justify-end mt-8">
                <button type="submit" className="bg-[#4459FF] text-white px-12 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
                    Next
                </button>
            </div>
        </form>
    );
} 