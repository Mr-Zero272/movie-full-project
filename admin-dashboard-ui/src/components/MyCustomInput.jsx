import { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const defFunction = (e) => {};

const MyCustomInput = forwardRef(
    (
        {
            label,
            name,
            placeholder,
            memo,
            value,
            autoFocus = false,
            onChange = defFunction,
            onValidityChange,
            onFocus,
            onBlur,
            type = 'text',
            className,
            error = '',
            validation = { patternRegex: '', errorMessage: '', maxLength: 20 },
        },
        ref,
    ) => {
        const [inputValue, setInputValue] = useState(() => ({
            value: '',
            isValid: true,
        }));
        const [errorMessage, setErrorMessage] = useState('');

        useEffect(() => {
            if (value === '') {
                setInputValue((prev) => ({
                    ...prev,
                    value: '',
                }));
            }
        }, [value]);

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
            onChange(e, isValid);
        };
        return (
            <div className={classNames('mb-5', { className })}>
                {label && (
                    <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white">{label}</label>
                )}

                {type === 'textarea' ? (
                    <textarea
                        ref={ref}
                        autoFocus={autoFocus}
                        className={classNames(
                            'mb-2 shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg focus:outline-none focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 dark:shadow-sm-light',
                            {
                                'border-red-500': !inputValue.isValid || error !== '',
                                'border-gray-300': inputValue.isValid,
                            },
                        )}
                        rows={5}
                        name={name}
                        onChange={handleOnchange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        value={value ? value : inputValue.value}
                        required
                    />
                ) : (
                    <input
                        ref={ref}
                        autoFocus={autoFocus}
                        className={classNames(
                            'mb-2 shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-lg focus:outline-none focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 dark:shadow-sm-light',
                            {
                                'border-red-500': !inputValue.isValid || error !== '',
                                'border-gray-300': inputValue.isValid,
                            },
                        )}
                        type={type}
                        name={name}
                        onChange={handleOnchange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        value={value ? value : inputValue.value}
                        required
                    />
                )}
                {error === '' && (
                    <div className="ms-1 text-sm text-red-500 italic">
                        {inputValue.isValid === false ? errorMessage : memo}
                    </div>
                )}
                {error !== '' && <div className="ms-1 text-sm text-red-500 italic">{error}</div>}
            </div>
        );
    },
);

MyCustomInput.prototype = {
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    memo: PropTypes.string,
    value: PropTypes.string,
    square: PropTypes.bool,
    sideBtn: PropTypes.bool,
    whiteBg: PropTypes.bool,
    focus: PropTypes.bool,
    onValueChange: PropTypes.func,
    onValidityChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
    validation: PropTypes.object,
};

export default MyCustomInput;
