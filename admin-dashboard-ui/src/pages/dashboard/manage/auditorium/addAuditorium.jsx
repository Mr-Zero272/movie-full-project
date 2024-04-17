import { auditoriumService } from '@/apiServices';
import MyCustomInput from '@/components/MyCustomInput';
import { useNotify } from '@/hooks';
import { Button } from '@material-tailwind/react';
import { useRef, useState } from 'react';

function AddAuditorium() {
    const notify = useNotify();
    const [auditoriumInfo, setAuditoriumInfo] = useState(() => ({
        name: '',
    }));
    const nameInputRef = useRef(null);

    const handleInputChange = (e) => {
        setAuditoriumInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        const res = await auditoriumService.addAuditorium(auditoriumInfo.name);
        if (res && res.state === 'success') {
            notify(res.message);
            setAuditoriumInfo(() => ({
                name: '',
            }));
            nameInputRef.current.focus();
        } else {
            notify(res.message, 'error');
        }
    };
    return (
        <div className="h-lg">
            <form>
                <div className="">
                    <MyCustomInput
                        ref={nameInputRef}
                        label="Auditorium name:"
                        name="name"
                        value={auditoriumInfo.name}
                        placeholder="Auditorium name..."
                        validation={{ patternRegex: '', errorMessage: '', maxLength: 100 }}
                        // error={movieInfo.titleErrorMessage}
                        onChange={handleInputChange}
                    />
                </div>
                <Button color="green" onClick={handleSubmit}>
                    Add
                </Button>
            </form>
        </div>
    );
}

export default AddAuditorium;
