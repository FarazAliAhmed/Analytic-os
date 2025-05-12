import ListStartupBreadcrumb from '../components/list-startup/ListStartupBreadcrumb';
import ListStartupForm from '../components/list-startup/ListStartupForm';

export default function ListStartupContainer() {
    return (
        <div className="w-full mx-auto px-4 md:px-10 py-8">
            <ListStartupBreadcrumb />
            <div className='max-w-7xl mx-auto'>
                <ListStartupForm />
            </div>
        </div>
    );
} 