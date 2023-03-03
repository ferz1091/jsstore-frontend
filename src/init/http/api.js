import instance from './index';

const api = {
    login(email, password, isRemember) {
        return instance.post(`/auth/login`, {email, password, isRemember});
    },
    registration(email, password, phone) {
        return instance.post('/auth/registration', {email, password, phone});
    },
    logout() {
        return instance.post('/auth/logout');
    },
    refresh() {
        return instance.get('/auth/refresh');
    },
    getProducts(gender, category, currentPage, sort) {
        return instance.get(`/product/get?gender=${gender}&category=${category}&currentPage=${currentPage}&sort=${sort ? sort : 'rating'}`);
    },
    getFilters(gender, category) {
        return instance.get(`/product/getfilter?gender=${gender}&category=${category}`);
    }
}

export default api;
