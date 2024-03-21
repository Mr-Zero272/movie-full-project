import { useState } from 'react';

// const cx = classNames.bind(styles);
const defFunction = () => {};

function FormInputText3({
    label,
    name,
    placeholder,
    memo,
    value,
    square,
    sideBtn,
    whiteBg,
    focus,
    onValueChange = defFunction,
    onValidityChange,
    onFocus,
    onBlur,
    type = 'text',
    className,
    validation = { patternRegex: '', errorMessage: '', maxLength: 20 },
}) {
    const [inputValue, setInputValue] = useState(() => ({
        value: '',
        isValid: true,
    }));
    const [errorMessage, setErrorMessage] = useState('');

    const lengthErrorMessage = (l) => {
        return 'This field has a maximum of ' + l + ' characters.';
    };

    const isInputValid = (value) => {
        if (value !== '') {
            if (value.length > validation.maxLength) {
                setErrorMessage(lengthErrorMessage(validation.maxLength));
                return false;
            } else {
                const regex = new RegExp(validation.patternRegex);
                if (!regex.test(value)) {
                    setErrorMessage(validation.errorMessage);
                    return false;
                } else {
                    setErrorMessage(validation.errorMessage);
                    return true;
                }
            }
        } else {
            setErrorMessage('This field is blank!');
            return false;
        }
    };

    const handleOnchange = (e) => {
        const isValid = isInputValid(e.target.value);
        setInputValue((prev) => ({
            ...prev,
            value: e.target.value,
            isValid: isValid,
        }));
        onValueChange(e, isValid);
    };
    return (
        <div className={className}>
            <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder}
                name={name}
                onChange={(e) => handleOnchange(e)}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value ? value : inputValue.value}
                required
            />
            <div className="italic text-red-500">{inputValue.isValid === false ? errorMessage : memo}</div>
        </div>
    );
}

export default FormInputText3;
