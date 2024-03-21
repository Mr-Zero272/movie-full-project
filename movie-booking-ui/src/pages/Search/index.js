import Sidebar from './SideBar';
import Pagination from './Pagination';

function Search() {
    return (
        <div className="p-8 flex flex-col lg:flex-row">
            <Sidebar />
            <Pagination />
        </div>
    );
}

export default Search;
