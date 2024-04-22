import { useEffect, useState } from 'react';
import { Card, Typography, Input, Checkbox, Button, Select, Option } from '@material-tailwind/react';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { manageActions } from '@/store/manage-slice';
import { useNotify } from '@/hooks';
import { movieService } from '@/apiServices';

const randomImages = [
    'https://i.pinimg.com/originals/d8/b0/8e/d8b08ea0e439bcdefd6bebbb765ecc1f.jpg',
    'https://i.pinimg.com/originals/b4/0e/20/b40e20379d07ee6b2db30865e43c4a03.jpg',
    'https://i.pinimg.com/originals/52/ff/c8/52ffc8f000fd8155e85019de459695a0.jpg',
    'https://i.pinimg.com/originals/b1/1c/4b/b11c4bc9b90c8bd26fb0973cbe44c4e1.jpg',
];

const getNextMondays = (numberOfMondays = 5) => {
    const result = [];
    const tempDate = new Date();
    let currentDate = new Date(
        tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' 00:00:00',
    );

    for (let i = 0; i < numberOfMondays; i++) {
        currentDate.setDate(currentDate.getDate() + ((1 + 7 - currentDate.getDay()) % 7));
        result.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return result;
};

export function DoScheduleForm() {
    const [dateSchedule, setDateSchedule] = useState('');
    const listSelectDays = getNextMondays(3);
    const notify = useNotify();
    const dispatch = useDispatch();

    const handleChooseDate = (e) => {
        setDateSchedule(e.target.value);
    };

    const handleSubmit = () => {
        if (dateSchedule === '') {
            notify('You have to choose date to schedule!', 'warning');
            return;
        }

        const tempDate = new Date(dateSchedule);
        if (tempDate.getDay() !== 1) {
            notify('You have to choose the Monday to schedule!', 'warning');
            return;
        }

        const doSchedule = async () => {
            const token = localStorage.getItem('token');
            const res = await movieService.doSchedule(dateSchedule + 'T00:00:00', token);
            console.log(res);
            if (res) {
                notify(res, 'info');
            } else {
                notify('Something went wrong!', 'error!');
            }
        };

        doSchedule();
    };

    return (
        <Card className="flex justify-center items-center" color="transparent" shadow={false}>
            <div>
                <Typography className="self-left" variant="h4" color="blue-gray">
                    Do schedule form
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    You can schedule movie showings for next week here.
                </Typography>
            </div>
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Choose start time:
                    </Typography>
                    <Input label="date" type="date" value={dateSchedule} onChange={handleChooseDate} />
                    {/* <Select value={dateSchedule} size="lg" label="Choose date" onChange={handleChooseDate}>
                        {listSelectDays?.length !== 0 &&
                            listSelectDays.map((day, index) => (
                                <Option key={index} value={format(day, "yyyy-MM-dd'T'HH:mm:ss")}>
                                    {format(day, 'EEEE, dd MMM yyyy')}
                                </Option>
                            ))}
                    </Select> */}
                </div>
                <Checkbox
                    label={
                        <Typography variant="small" color="gray" className="flex items-center font-normal">
                            Remind me next
                            <a href="#" className="font-medium transition-colors hover:text-gray-900">
                                &nbsp; week
                            </a>
                        </Typography>
                    }
                    containerProps={{ className: '-ml-2.5' }}
                />
                <Button className="mt-6" fullWidth onClick={handleSubmit}>
                    Schedule
                </Button>
            </form>
        </Card>
    );
}

export default DoScheduleForm;
