function useCheckValidInput() {
    const lengthErrorMessage = (l) => {
        return 'This field has a maximum of ' + l + ' characters.';
    };

    const validInput = (value, validation = {}) => {
        if (value !== '') {
            if (validation.maxLength && value.length > validation.maxLength) {
                return { valid: false, messageError: lengthErrorMessage(validation.maxLength) };
            } else {
                const regex = new RegExp(validation.patternRegex);
                if (!regex.test(value)) {
                    return { valid: false, messageError: validation.errorMessage };
                } else {
                    return { valid: true, messageError: '' };
                }
            }
        } else {
            return { valid: false, messageError: 'This field is blank!' };
        }
    };
    return validInput;
}

export default useCheckValidInput;
