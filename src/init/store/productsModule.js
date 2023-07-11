import api from "../http/api";
export default {
    state: {
        totalPages: null,
        category: '',
        gender: '',
        products: [],
        filters: {typeStats: null, brandStats: null, valueRange: {min: null, max: null}, categoryStats: null},
        initFilters: null
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
            state.category = '';
            state.gender = '';
            state.products = [];
            state.filters = {typeStats: null, brandStats: null, valueRange: {min: null, max: null}, categoryStats: null};
        },
        setFilters(state, {filters}) {
            state.filters = filters;
        },
        saveFilters(state) {
            if (!state.initFilters) {
                state.initFilters = state.filters;
            }
        },
        clearFilters(state) {
            state.initFilters = null;
        }
    },
    getters: {
        filters(state) {
            return state.filters;
        }
    },
    actions: {
        async getProducts({commit, dispatch, state}, {gender, category, page, fetchFilters, sort, brands, types, valueRange}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getProducts({ gender, category, currentPage: page ? page : 1, sort, brands, types, valueRange});
                if (fetchFilters) {
                    const filters = await api.getFilters({gender, category, brands, types, sale: false, valueRange});
                    if (state.initFilters) {
                        commit('setFilters', {filters:{
                            typeStats: filters.data.typeStats ? 
                            [...state.initFilters.typeStats.filter(stat => !filters.data.typeStats.some(type => type._id.type === stat._id.type)).map(type => {
                                return {...type, count: 0}
                            }), ...filters.data.typeStats] 
                            : state.initFilters.typeStats, 
                            brandStats: filters.data.brandStats ? [...state.initFilters.brandStats.filter(stat => !filters.data.brandStats.some(brand => brand._id.brand === stat._id.brand)).map(brand => {
                                return { ...brand, count: 0 }
                            }), ...filters.data.brandStats] : state.initFilters.brandStats,
                            valueRange: filters.data.valueRange[0]
                        }});
                    } else {
                        commit('setFilters', {filters:{...filters.data, valueRange: filters.data.valueRange[0]}});
                    }
                }
                commit('setProducts', {
                    data: response.data.data, 
                    totalPages: state.totalPages ? null : response.data.totalPages, 
                    page: response.data.page,
                    category: state.category ? null : category,
                    gender: state.gender ? null : gender
                });
            } catch (error) {
                console.log(error);
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getSale({ commit, dispatch, state }, {gender, category, page, fetchFilters, sort, brands, types, categoryFilters, valueRange}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getSales({ gender, category, currentPage: page, sort, brands, types, categoryFilters, valueRange});
                if (fetchFilters) {
                    const filters = await api.getFilters({ gender, category, brands, types, sale: true, categoryFilters, valueRange});
                    if (state.initFilters) {
                        commit('setFilters', {filters:{
                            typeStats: filters.data.typeStats && state.initFilters.typeStats ? 
                            [...state.initFilters.typeStats.filter(stat => !filters.data.typeStats.some(type => type._id.type === stat._id.type)).map(type => {
                                return {...type, count: 0}
                            }), ...filters.data.typeStats] 
                            : state.initFilters.typeStats, 
                            brandStats: filters.data.brandStats && state.initFilters.brandStats ? 
                            [...state.initFilters.brandStats.filter(stat => !filters.data.brandStats.some(brand => brand._id.brand === stat._id.brand)).map(brand => {
                                return { ...brand, count: 0 }
                            }), ...filters.data.brandStats] : state.initFilters.brandStats,
                            categoryStats: filters.data.categoryStats && state.initFilters.categoryStats ? 
                            [...state.initFilters.categoryStats.filter(stat => !filters.data.categoryStats.some(category => category._id.category === stat._id.category)).map(category => {
                                return { ...category, count: 0 }
                            }), ...filters.data.categoryStats] : state.initFilters.categoryStats,
                            valueRange: filters.data.valueRange[0]
                        }});
                    } else {
                        commit('setFilters', {filters:{...filters.data, valueRange: filters.data.valueRange[0]}});
                    }
                }
                commit('setProducts', {
                    data: response.data.data,
                    totalPages: state.totalPages ? null : response.data.totalPages,
                    page: response.data.page,
                    category: state.category ? null : category,
                    gender: state.gender ? null : gender
                });
            } catch (error) {
                console.log(error);
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getProductsByString({ commit, dispatch, state }, { gender, string, page }) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getProductsByString(gender, string, page);
                commit('setProducts', {data: response.data.data, totalPages: response.data.totalPages, page: response.data.page, category: null, gender});
            } catch (error) {
                console.log(error);
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                commit('toggleIsFetching', false);
            }
        }
    }
}