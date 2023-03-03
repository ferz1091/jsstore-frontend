import api from "../http/api";
export default {
    state: {
        totalPages: null,
        category: '',
        gender: '',
        products: [],
        filters: null,
    },
    mutations: {
        setProducts(state, {data, totalPages, page, category, gender}) {
            state.products = [...state.products, {data, page}];
            state.totalPages = totalPages ? totalPages : state.totalPages;
            state.category = category ? category : state.category;
            state.gender = gender ? gender : state.gender
        },
        deleteProducts(state) {
            state.totalPages = null;
            state.products = [];
            state.category = '';
            state.gender = '';
            state.filters = null;
        },
        setFilters(state, {filters}) {
            state.filters = filters;
        }
    },
    getters: {

    },
    actions: {
        async getProducts({commit, dispatch, state}, {gender, category, page, fetchFilters, sort}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getProducts(gender, category, page ? page : 1, sort);
                if (fetchFilters) {
                    const filters = await api.getFilters(gender, category);
                    commit('setFilters', {filters: filters.data});
                }
                commit('setProducts', {
                    data: response.data.data, 
                    totalPages: state.totalPages ? null : response.data.totalPages, 
                    page: response.data.page,
                    category: state.category ? null : category,
                    gender: state.gender ? null : gender
                });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        }
    }
}