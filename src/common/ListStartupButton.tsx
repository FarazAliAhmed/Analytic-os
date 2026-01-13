import { useRouter } from "next/navigation";

export default function ListStartupButton() {

    const router = useRouter();

    const handleClick = () => {
        router.push("/dashboard/list-startup");
    }

    return (
        <button onClick={handleClick} className="cursor-pointer px-3 py-1.5 bg-[#4459FF] hover:bg-[#3448EE] text-white text-xs font-medium rounded-lg transition-colors">
           + List your startup
        </button>
    );
}