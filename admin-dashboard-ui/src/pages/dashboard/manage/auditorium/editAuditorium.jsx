import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

import { useNotify } from '@/hooks';
import MyCustomInput from '@/components/MyCustomInput';
import { auditoriumService } from '@/apiServices';

function EditAuditorium() {
    const { auditoriumId } = useParams();
    const notify = useNotify();
    const navigate = useNavigate();
    const [auditoriumInfo, setAuditoriumInfo] = useState(() => ({
        name: '',
        address: '',
    }));

    useEffect(() => {
        const fetchAuditoriumInfo = async () => {
            const res = await auditoriumService.getAuditoriumInfo(auditoriumId);
            setAuditoriumInfo((prev) => ({
                ...prev,
                ...res,
            }));
        };

        fetchAuditoriumInfo();
    }, []);

    const handleInputChange = (e) => {
        setAuditoriumInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        const res = await auditoriumService.editAuditorium(auditoriumId, auditoriumInfo.name, auditoriumInfo.address);
        if (res && res.state === 'success') {
            notify(res.message);
            navigate(-1);
        } else {
            notify(res.message, 'error');
        }
    };

    console.log(auditoriumInfo);
    return (
        <div className="h-lg">
            <form>
                <div className="mb-5">
                    <MyCustomInput
                        label="Auditorium name:"
                        name="name"
                        value={auditoriumInfo.name}
                        placeholder="Auditorium name..."
                        validation={{ patternRegex: '', errorMessage: '', maxLength: 100 }}
                        // error={movieInfo.titleErrorMessage}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="">
                    <MyCustomInput
                        label="Address:"
                        name="address"
                        value={auditoriumInfo.address}
                        placeholder="Address..."
                        validation={{ patternRegex: '', errorMessage: '', maxLength: 100 }}
                        // error={movieInfo.titleErrorMessage}
                        onChange={handleInputChange}
                    />
                </div>
                <Button color="green" onClick={handleSubmit}>
                    Save
                </Button>
            </form>
        </div>
    );
}

export default EditAuditorium;
