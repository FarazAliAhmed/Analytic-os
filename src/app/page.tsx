import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181A20]">
      <h1 className="text-3xl font-bold text-white mb-4">Welcome to Analyti Web3</h1>
      <p className="text-gray-400 mb-8">Start exploring by visiting your dashboard.</p>
      <Link href="/dashboard">
        <button className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">Go to Dashboard</button>
      </Link>
    </div>
  );
}
