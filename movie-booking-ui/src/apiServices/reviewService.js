import * as request from '~/utils/request';

export const addNewComment = async (movieId, rating = 1, comment = '', token) => {
    try {
        const res = await request.postAuth(
            '/intermediary/review',
            {
                movieId,
                rating,
                comment,
            },
            { headers: { Authorization: 'Bearer ' + token } },
        );
        return res;
    } catch (error) {
        alert('Add review error!');
        console.log(error);
    }
};

export const loveReview = async (reviewId, token) => {
    try {
        const res = await request.postMovie('/review/love', reviewId, {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        alert('Love review error!');
        console.log(error);
    }
};

export const getReviewInfo = async (reviewId) => {
    try {
        const res = await request.get(`/review/info/${reviewId}`);
        return res;
    } catch (error) {
        alert('Get review error!');
        console.log(error);
    }
};

export const editReview = async (reviewId, rating = 1, comment = '', token) => {
    try {
        const res = await request.putMovie(
            `/review/${reviewId}`,
            {
                rating,
                comment,
            },
            { headers: { Authorization: 'Bearer ' + token } },
        );
        return res;
    } catch (error) {
        alert('Add review error!');
        console.log(error);
    }
};

export const getAllReviewsByMovieId = async (movieId) => {
    try {
        const res = await request.get(`/review/all/${movieId}`);
        return res;
    } catch (error) {
        alert('Get review error!');
        console.log(error);
    }
};

export const deleteReview = async (movieId, reviewId, token) => {
    try {
        const res = await request.deleteMovieRequest(`/review/${movieId}/${reviewId}`, {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        alert('Delete review error!');
        console.log(error);
    }
};

export const reportReview = async (reviewId, reportContent, token) => {
    try {
        const res = await request.postMovie(
            '/review/report',
            { reviewId, reportContent },
            {
                headers: { Authorization: 'Bearer ' + token },
            },
        );
        return res;
    } catch (error) {
        alert('Report review error!');
        console.log(error);
    }
};
