import { useRouter } from "next/navigation";

export default function ListStartupButton() {

    const router = useRouter();

    const handleClick = () => {
        router.push("/dashboard/list-startup");
    }

    return (
        <button onClick={handleClick} className="cursor-pointer bg-[#4459FF] text-xs sm:text-base border border-white text-white px-5 py-2 rounded-lg sm:rounded-full font-semibold w-full sm:w-auto" >
            <span className="inline sm:hidden">List</span>
            <span className="hidden sm:inline">List your Startup</span>
        </button>
    );
} 