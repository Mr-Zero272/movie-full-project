import { useState } from 'react';

import { authService } from '@/apiServices';
import { useCheckValidInput, useNotify } from '@/hooks';
import { Input, Checkbox, Button, Typography } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';

const validation = {
    email: {
        patternRegex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorMessage: 'Your email is not valid!!!',
    },
    password: {
        patternRegex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
        errorMessage: 'Minimum eight characters, at least a number, and at least a special character.',
        maxLength: 20,
    },
    passwordConfirm: {
        patternRegex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
        errorMessage: 'Minimum eight characters, at least a number, and at least a special character.',
        maxLength: 20,
    },
};

const maskEmail = (email) => {
    // Split email address into local part and domain part
    const [localPart, domain] = email.split('@');

    // If local part has less than 4 characters, return the original email
    if (localPart.length <= 4) {
        return email;
    }

    // Get the first two characters of the local part
    const firstTwoChars = localPart.substring(0, 2);

    // Create the masked local part with asterisks
    const maskedLocalPart = firstTwoChars + '*'.repeat(localPart.length - 4) + localPart.slice(-2);

    // Return the masked email address
    return maskedLocalPart + '@' + domain;
};

const passwordFields = ['password', 'passwordConfirm'];
const emailField = ['email'];
const otpFields = ['first', 'second', 'third', 'fourth', 'fifth'];

export function ForgetPass() {
    const [signUpInfo, setSignUpInfo] = useState(() => ({
        password: '',
        passwordErrorMessage: '',
        passwordConfirm: '',
        passwordConfirmErrorMessage: '',
        email: '',
        emailErrorMessage: '',
    }));
    const [otpCode, setOtpCode] = useState(() => ({
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
    }));
    const [tab, setTab] = useState('email');
    const navigate = useNavigate();
    const notify = useNotify();
    const validInput = useCheckValidInput();
    const [loading, setLoading] = useState(false);

    const handleOptCodeChange = (e) => {
        const regex = new RegExp('[0-9]');
        if (regex.test(e.target.value)) {
            setOtpCode((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
            const indexNextField = otpFields.indexOf(e.target.name);
            if (indexNextField !== -1 && indexNextField + 1 < otpFields.length) {
                const nextfield = document.querySelector(`input[name=${otpFields[indexNextField + 1]}]`);

                // If found, focus the next field
                if (nextfield !== null) {
                    nextfield.focus();
                }
            }
        } else {
            setOtpCode((prev) => ({
                ...prev,
                [e.target.name]: '',
            }));
        }
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'termAndConditions') {
            setSignUpInfo((prev) => ({
                ...prev,
                termAndConditions: !prev.termAndConditions,
            }));
            return;
        }
        setSignUpInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const submitFormSendMail = () => {
        let formValid = true;
        emailField.forEach((field) => {
            const { valid, messageError } = validInput(signUpInfo[field], validation[field]);
            if (!valid) {
                setSignUpInfo((prev) => ({
                    ...prev,
                    [field + 'ErrorMessage']: messageError,
                }));
                formValid = false;
            } else {
                setSignUpInfo((prev) => ({
                    ...prev,
                    [field + 'ErrorMessage']: '',
                }));
            }
        });

        const sendMail = async () => {
            setLoading(true);
            const res = await authService.mailRequestChangePass(signUpInfo.email);
            if (res) {
                if (res.state === 'success') {
                    setTab('otp');
                } else {
                    notify(res.message, 'error');
                }
            } else {
                notify('Something went wrong!', 'error');
            }
            setLoading(false);
        };

        if (formValid) {
            sendMail();
        }
    };

    const submitFormOtpCode = () => {
        let formValid = true;
        otpFields.forEach((f) => {
            if (otpCode[f] === '') {
                formValid = false;
            }
        });

        const registerNewAdminAccount = async (code) => {
            setLoading(true);

            const res = await authService.validChangePassCode(code, signUpInfo.email);
            if (res && res.state === 'success') {
                setTab('password');
            } else {
                notify('Something went wrong, try again latter', 'error');
            }
            setLoading(false);
        };

        if (formValid) {
            const code = otpCode.first + otpCode.second + otpCode.third + otpCode.fourth + otpCode.fifth;
            registerNewAdminAccount(code);
        }
    };

    const submitChangePasswordForm = () => {
        let formValid = true;
        passwordFields.forEach((field) => {
            const { valid, messageError } = validInput(signUpInfo[field], validation[field]);
            if (!valid) {
                setSignUpInfo((prev) => ({
                    ...prev,
                    [field + 'ErrorMessage']: messageError,
                }));
                formValid = false;
            } else {
                setSignUpInfo((prev) => ({
                    ...prev,
                    [field + 'ErrorMessage']: '',
                }));
            }
        });

        if (signUpInfo.password !== signUpInfo.passwordConfirm) {
            setSignUpInfo((prev) => ({
                ...prev,
                passwordConfirmErrorMessage: 'Confirm password is not match!',
            }));
            formValid = false;
        } else {
            setSignUpInfo((prev) => ({
                ...prev,
                passwordConfirmErrorMessage: '',
            }));
        }

        const changePassword = async () => {
            setLoading(true);
            const res = await authService.changePass(signUpInfo.password, signUpInfo.email);
            if (res) {
                if (res.state === 'success') {
                    notify(res.message);
                    navigate('/auth/signIn');
                } else {
                    notify(res.message, 'error');
                }
            } else {
                notify('Something went wrong!', 'error');
            }
            setLoading(false);
        };

        if (formValid) {
            changePassword();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (tab) {
            case 'email':
                submitFormSendMail();
                break;
            case 'otp':
                submitFormOtpCode();
                break;
            case 'password':
                submitChangePasswordForm();
                break;
            default:
                console.log('error!');
        }
    };

    // console.log(signUpInfo);
    return (
        <section className="m-8 flex">
            <div className="w-2/5 h-full hidden lg:block">
                <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" />
            </div>
            <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
                {(tab === 'email' || tab === 'password') && (
                    <div className="text-center">
                        <Typography variant="h2" className="font-bold mb-4">
                            Reset your password
                        </Typography>
                        <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                            {tab === 'email' ? 'Enter your email to reset your password.' : 'Enter your new password.'}
                        </Typography>
                    </div>
                )}
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                    {tab === 'email' && (
                        <>
                            <div className="mb-1 flex flex-col gap-6">
                                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                    Your email
                                </Typography>
                                <Input
                                    size="lg"
                                    name="email"
                                    value={signUpInfo.email}
                                    placeholder="name@mail.com"
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    onChange={handleInputChange}
                                />
                                {signUpInfo.emailErrorMessage && (
                                    <Typography
                                        variant="small"
                                        color="red"
                                        className="mt-2 flex items-center gap-1 font-normal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="-mt-px h-4 w-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                        {signUpInfo.emailErrorMessage}
                                    </Typography>
                                )}
                            </div>
                        </>
                    )}
                    {tab === 'password' && (
                        <>
                            <div className="mb-1 flex flex-col gap-6">
                                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                    Your new password
                                </Typography>
                                <Input
                                    size="lg"
                                    type="password"
                                    name="password"
                                    value={signUpInfo.password}
                                    placeholder="New password..."
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    onChange={handleInputChange}
                                />
                                {signUpInfo.passwordErrorMessage && (
                                    <Typography
                                        variant="small"
                                        color="red"
                                        className="mt-2 flex items-center gap-1 font-normal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="-mt-px h-4 w-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                        {signUpInfo.passwordErrorMessage}
                                    </Typography>
                                )}
                            </div>
                            <div className="mb-1 flex flex-col gap-6">
                                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                    Confirm password
                                </Typography>
                                <Input
                                    size="lg"
                                    type="password"
                                    name="passwordConfirm"
                                    value={signUpInfo.passwordConfirm}
                                    placeholder="Confirm password..."
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    onChange={handleInputChange}
                                />
                                {signUpInfo.passwordConfirmErrorMessage && (
                                    <Typography
                                        variant="small"
                                        color="red"
                                        className="mt-2 flex items-center gap-1 font-normal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="-mt-px h-4 w-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                        {signUpInfo.passwordConfirmErrorMessage}
                                    </Typography>
                                )}
                            </div>
                        </>
                    )}
                    {tab === 'otp' && (
                        <div className="relative flex flex-col justify-center overflow-hidden bg-gray-50">
                            <div className="relative bg-white px-6 pt-10 pb-9 mx-auto w-full max-w-lg">
                                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                                        <div className="font-semibold text-3xl">
                                            <p>Email Verification</p>
                                        </div>
                                        <div className="flex flex-row text-sm font-medium text-gray-400">
                                            <p>We have sent a code to your email {maskEmail(signUpInfo.email)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <form>
                                            <div className="flex flex-col space-y-16">
                                                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-sm">
                                                    <div className="w-16 h-16 ">
                                                        <input
                                                            autoFocus
                                                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                            type="text"
                                                            name="first"
                                                            maxLength={1}
                                                            value={otpCode.first}
                                                            onChange={handleOptCodeChange}
                                                        />
                                                    </div>
                                                    <div className="w-16 h-16 ">
                                                        <input
                                                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                            type="text"
                                                            name="second"
                                                            maxLength={1}
                                                            value={otpCode.second}
                                                            onChange={handleOptCodeChange}
                                                        />
                                                    </div>
                                                    <div className="w-16 h-16 ">
                                                        <input
                                                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                            type="text"
                                                            name="third"
                                                            maxLength={1}
                                                            value={otpCode.third}
                                                            onChange={handleOptCodeChange}
                                                        />
                                                    </div>
                                                    <div className="w-16 h-16 ">
                                                        <input
                                                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                            type="text"
                                                            name="fourth"
                                                            maxLength={1}
                                                            value={otpCode.fourth}
                                                            onChange={handleOptCodeChange}
                                                        />
                                                    </div>
                                                    <div className="w-16 h-16 ">
                                                        <input
                                                            className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                            type="text"
                                                            name="fifth"
                                                            maxLength={1}
                                                            value={otpCode.fifth}
                                                            onChange={handleOptCodeChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-5">
                                                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                                        <p>Didn't receive code?</p>{' '}
                                                        <a
                                                            className="flex flex-row items-center text-blue-600"
                                                            href="http://"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Resend
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Button className="mt-6" fullWidth loading={loading} onClick={handleSubmit}>
                        {tab === 'otp' ? 'Verify Account' : tab === 'email' ? 'Reset password' : 'Change password'}
                    </Button>

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
                </form>
            </div>
        </section>
    );
}

export default ForgetPass;
