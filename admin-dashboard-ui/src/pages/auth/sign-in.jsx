import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Checkbox, Button, Typography } from '@material-tailwind/react';

import { useDebounce } from '@/hooks';
import CustomLabel from '@/components/CustomLabel';
import { authService } from '@/apiServices';
const validations = {
    username: {
        maxLength: 50,
    },
    password: {
        patternRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        errorMessage:
            'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
        maxLength: 50,
    },
};

export function SignIn() {
    const navigate = useNavigate();
    const [errorSignInForm, setErrorSignInForm] = useState(null);
    const [signInInfo, setSignInInfo] = useState(() => ({
        username: '',
        password: '',
    }));
    const [signInError, setSignInError] = useState(() => ({
        usernameError: '',
        passwordError: '',
    }));

    const lengthErrorMessage = (l) => {
        return 'This field has a maximum of ' + l + ' characters.';
    };

    const validField = (value, filedName, validation) => {
        if (value !== '') {
            if (validation.length !== undefined || validation.length !== null) {
                if (value.length >= validation.maxLength) {
                    setSignInError((error) => ({
                        ...error,
                        [filedName + 'Error']: lengthErrorMessage(validation.maxLength),
                    }));

                    return false;
                }
            }

            if (validation.patternRegex !== undefined || validation.patternRegex !== null) {
                const regex = new RegExp(validation.patternRegex);
                if (!regex.test(value)) {
                    setSignInError((error) => ({
                        ...error,
                        [filedName + 'Error']: validation.errorMessage,
                    }));
                    return false;
                }
            }

            setSignInError((error) => ({
                ...error,
                [filedName + 'Error']: '',
            }));
            return true;
        } else {
            setSignInError((error) => ({
                ...error,
                [filedName + 'Error']: 'This field is require',
            }));

            return false;
        }
    };

    const signInInfoDebounce = useDebounce(signInInfo, 500);

    useEffect(() => {}, [signInInfoDebounce]);

    const handleSignInFormChange = (e) => {
        setSignInInfo((info) => ({
            ...info,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        let haveError = false;
        for (const filedName in signInInfo) {
            if (!validField(signInInfo[filedName], filedName, validations[filedName])) haveError = true;
        }
        const login = async () => {
            const result = await authService.login(signInInfo.username, signInInfo.password);
            if (result.token !== undefined && result.token !== null) {
                localStorage.setItem('token', result.token);
                setErrorSignInForm(null);
                navigate('/dashboard/home');
            } else {
                setErrorSignInForm('Username or password is incorrect!');
            }
            // console.log(result);
        };
        if (!haveError) {
            login();
            // navigate('/dashboard/home');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <section className="m-8 flex gap-4" onKeyDown={handleKeyPress}>
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        Sign In
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                        Enter your username and password to Sign In.
                    </Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                    {errorSignInForm !== null && (
                        <Typography variant="small" className="italic font-bold" color="red">
                            {errorSignInForm}
                        </Typography>
                    )}
                    <div className="mb-1 flex flex-col gap-6">
                        <CustomLabel
                            label="Your username"
                            variant="small"
                            className="-mb-3 font-medium"
                            errorMessage={signInError.usernameError !== '' && signInError.usernameError}
                            displayErrorMessage={
                                signInError.usernameError !== '' && signInError.usernameError.length < 50
                            }
                        />
                        <Input
                            size="lg"
                            placeholder="username"
                            name="username"
                            value={signInInfo.username}
                            className={`${
                                signInError.usernameError !== ''
                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                            }`}
                            labelProps={{
                                className: 'before:content-none after:content-none',
                            }}
                            error={signInError.usernameError !== ''}
                            onChange={handleSignInFormChange}
                        />
                        <CustomLabel
                            label="Password"
                            variant="small"
                            className="-mb-3 font-medium"
                            errorMessage={signInError.passwordError !== '' && signInError.passwordError}
                            displayErrorMessage={
                                signInError.passwordError !== '' && signInError.passwordError.length < 50
                            }
                        />
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            name="password"
                            value={signInInfo.password}
                            pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/"
                            className={`${
                                signInError.passwordError !== ''
                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                            }`}
                            labelProps={{
                                className: 'before:content-none after:content-none',
                            }}
                            error={signInError.passwordError !== ''}
                            onChange={handleSignInFormChange}
                        />
                    </div>
                    <Checkbox
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center justify-start font-medium"
                            >
                                I agree the&nbsp;
                                <a
                                    href="#"
                                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                                >
                                    Terms and Conditions
                                </a>
                            </Typography>
                        }
                        containerProps={{ className: '-ml-2.5' }}
                    />
                    <Button className="mt-6" fullWidth onClick={handleSubmit}>
                        Sign In
                    </Button>

                    <div className="flex items-center justify-between gap-2 mt-6">
                        <Checkbox
                            label={
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center justify-start font-medium"
                                >
                                    Subscribe me to newsletter
                                </Typography>
                            }
                            containerProps={{ className: '-ml-2.5' }}
                        />
                        <Typography variant="small" className="font-medium text-gray-900">
                            <a href="#">Forgot Password</a>
                        </Typography>
                    </div>
                    <div className="space-y-4 mt-8">
                        <Button
                            size="lg"
                            color="white"
                            className="flex items-center gap-2 justify-center shadow-md"
                            fullWidth
                        >
                            <svg
                                width="17"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_1156_824)">
                                    <path
                                        d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z"
                                        fill="#FBBC04"
                                    />
                                    <path
                                        d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z"
                                        fill="#EA4335"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1156_824">
                                        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>Sign in With Google</span>
                        </Button>
                        <Button
                            size="lg"
                            color="white"
                            className="flex items-center gap-2 justify-center shadow-md"
                            fullWidth
                        >
                            <img src="/img/twitter-logo.svg" height={24} width={24} alt="" />
                            <span>Sign in With Twitter</span>
                        </Button>
                    </div>
                    <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        Not registered?
                        <Link to="/auth/sign-up" className="text-gray-900 ml-1">
                            Create account
                        </Link>
                    </Typography>
                </form>
            </div>
            <div className="w-2/5 h-full hidden lg:block">
                <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" />
            </div>
        </section>
    );
}

export default SignIn;
