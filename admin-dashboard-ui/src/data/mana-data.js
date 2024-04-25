import { DoScheduleForm, GenreForm, MovieAddForm } from '@/components/form';
import { ChartBarIcon, PlusCircleIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';
import GenreTable from '@/pages/dashboard/manage/genre/genreTable';
import MovieTable from '@/pages/dashboard/manage/movie/movieTable';
import AuditoriumTable from '@/pages/dashboard/manage/auditorium/auditoriumTable';
import AddAuditorium from '@/pages/dashboard/manage/auditorium/addAuditorium';

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
    movie: {
        admin: [
            {
                label: 'Movie table',
                value: 'table',
                icon: DocumentChartBarIcon,
                content: MovieTable,
            },
            {
                label: 'Do schedule',
                value: 'schedule',
                icon: ChartBarIcon,
                content: DoScheduleForm,
            },
        ],
        business: [
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
        ],
    },
    Auditorium: [
        {
            label: 'Auditorium table',
            value: 'table',
            icon: DocumentChartBarIcon,
            content: AuditoriumTable,
        },
        {
            label: 'Add auditorium',
            value: 'add_auditorium',
            icon: PlusCircleIcon,
            content: AddAuditorium,
        },
    ],
};

export default manageData;
