export default function SearchBar({ onFocus, onClick }: { onFocus?: () => void, onClick?: () => void }) {
    return (
        <div className="flex items-center border-2 border-borderColor rounded-xl px-3 py-2 w-full sm:w-72">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            <input
                className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                placeholder="Search startups, CA"
                type="text"
                onFocus={onFocus}
                onClick={onClick}
            />
        </div>
    );
} 