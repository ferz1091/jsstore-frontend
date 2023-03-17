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
    getProducts({gender, category, currentPage, sort, brands, types, valueRange}) {
        console.log(valueRange);
        return instance.get(`/product/get?gender=${gender}&category=${category}&currentPage=${currentPage}&sort=${sort ? sort : 'rating'}${brands ? `&brands=${brands}` : ''}${types ? `&types=${types}` : ''}${valueRange ? `&range=${valueRange}` : ''}`);
    },
    getFilters({gender, category, brands, types, sale, categoryFilters, valueRange}) {
        return instance.get(`/product/getfilter?gender=${gender}${category ? `&category=${category}` : ''}${brands ? `&brands=${brands}` : ''}${types ? `&types=${types}` : ''}${sale ? `&sale=${sale}` : ''}${categoryFilters ? `&categoryFilters=${categoryFilters}` : ''}${valueRange ? `&range=${valueRange}` : ''}`);
    },
    getSales({gender, category, currentPage, sort, brands, types, categoryFilters, valueRange}) {
        return instance.get(`/product/getsale?currentPage=${currentPage}${gender ? `&gender=${gender}` : ''}${category ? `&category=${category}` : ''}&sort=${sort ? sort : 'rating'}${brands ? `&brands=${brands}` : ''}${types ? `&types=${types}` : ''}${categoryFilters ? `&categoryFilters=${categoryFilters}` : ''}${valueRange ? `&range=${valueRange}` : ''}`)
    }
}

export default api;
