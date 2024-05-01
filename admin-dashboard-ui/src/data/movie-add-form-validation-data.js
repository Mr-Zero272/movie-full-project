export const movieAddFormValidation = {
    title: {
        blank: false,
        maxLength: 100,
    },
    director: {
        blank: false,
        maxLength: 30,
    },
    description: {
        blank: false,
        maxLength: 1000,
    },
    manufacturer: {
        blank: false,
        maxLength: 30,
    },
    price: {
        blank: false,
    },
    duration_min: {
        blank: false,
    },
    releaseDate: {
        blank: false,
    },
    movieImages: {
        blank: false,
        requireFiles: 4,
    },
    movieTrailer: {
        blank: false,
    },
    fullName: {
        blank: false,
        maxLength: 50,
    },
    characterName: {
        blank: false,
        maxLength: 50,
    },
    avatar: {
        blank: false,
    },
    screeningsPerWeek: {
        blank: false,
    },
    totalWeekScheduling: {
        blank: false,
    },
    typeName: {
        blank: false,
        maxLength: 50,
    },
    nscreenings: {
        blank: false,
        maxLength: 50,
    },
    email: {
        patternRegex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorMessage: 'Your email is not valid!!!',
    },
    password: {
        patternRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        errorMessage:
            'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:',
        maxLength: 20,
    },
};

export default movieAddFormValidation;
