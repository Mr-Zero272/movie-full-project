import { DoScheduleForm, GenreForm, MovieAddForm } from '@/components/form';
import { GenreCustomTable } from '@/components/CustomTable';
import { ChartBarIcon, PlusCircleIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';
import GenreTable from '@/pages/dashboard/manage/genre/genreTable';
import MovieTable from '@/pages/dashboard/manage/movie/movieTable';

export const manageData = {
    Genre: [
        {
            label: 'Genre Table',
            value: 'table',
            icon: DocumentChartBarIcon,
            content: GenreTable,
        },
        {
            label: 'Add gere',
            value: 'add',
            icon: PlusCircleIcon,
            content: GenreForm,
        },
    ],
    Movie: [
        {
            label: 'Movie table',
            value: 'table',
            icon: DocumentChartBarIcon,
            content: MovieTable,
        },
        {
            label: 'Add movie',
            value: 'add_movie',
            icon: PlusCircleIcon,
            content: MovieAddForm,
        },
        {
            label: 'Do schedule',
            value: 'schedule',
            icon: ChartBarIcon,
            content: DoScheduleForm,
        },
    ],
};

export default manageData;
