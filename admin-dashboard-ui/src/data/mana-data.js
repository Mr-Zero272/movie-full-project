import { DoScheduleForm, GenreForm, MovieAddForm } from '@/components/form';
import { GenreCustomTable } from '@/components/CustomTable';
import { ChartBarIcon, PlusCircleIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';

export const manageData = {
    Genre: [
        {
            label: 'Genre Table',
            value: 'table',
            icon: DocumentChartBarIcon,
            content: GenreCustomTable,
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
            label: 'Schedule Table',
            value: 'table',
            icon: DocumentChartBarIcon,
            content: GenreCustomTable,
        },
        {
            label: 'Add movie',
            value: 'addT',
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
