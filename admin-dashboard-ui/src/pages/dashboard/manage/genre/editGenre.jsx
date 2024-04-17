import { genreService } from '@/apiServices';
import MyCustomInput from '@/components/MyCustomInput';
import { useNotify } from '@/hooks';
import { Button, Input } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditGenre() {
    const { genreId } = useParams();
    const notify = useNotify();
    const navigate = useNavigate();
    const [genreInfo, setGenreInfo] = useState(() => ({
        name: '',
    }));
    useEffect(() => {
        const fetchGenreInfo = async () => {
            const res = await genreService.getGenreInfo(genreId);
            setGenreInfo((prev) => ({
                ...prev,
                ...res,
            }));
        };

        fetchGenreInfo();
    }, []);

    const handleInputChange = (e) => {
        setGenreInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        const res = await genreService.editGenre(genreInfo.id, genreInfo.name);
        if (res && res.state === 'success') {
            notify(res.message);
            navigate(-1);
        } else {
            notify('Some thing went wrong!', 'error');
        }
    };
    // console.log(genreInfo);
    return (
        <div className="h-lg">
            <h1 className="my-5 ml-2 text-2xl font-semibold">Edit genre</h1>
            <form>
                <div className="">
                    <MyCustomInput
                        label="Genre name:"
                        name="name"
                        value={genreInfo.name}
                        placeholder="Genre name..."
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

export default EditGenre;
