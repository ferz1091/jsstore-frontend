import { createStore } from 'vuex';
import api from '../http/api';
import axios from 'axios';
import { BASE_URL } from '../http';
import products from './productsModule';
import { router } from '@/router/router';

const defaultState = {
    user: {
        id: null,
        email: null,
        isActivated: false,
        roles: [],
        phone: null
    },
    isFetching: false,
    isAuth: false,
    authModalActive: false,
    filterModalActive: false,
    alertData: {
        isVisible: false,
        message: '',
        status: ''
    },
    currentProduct: null,
    userCommentExists: false
}

export default createStore({
    state: defaultState,
    mutations: {
        setUserData(state, data) {
            state.user = data;
        },
        setIsAuth(state, isAuth) {
            state.isAuth = isAuth;
        },
        toggleAuthModal(state, isActive) {
            state.authModalActive = isActive;
        },
        toggleFilterModal(state, isActive) {
            state.filterModalActive = isActive;
        },
        alertOn(state, { message, status }) {
            state.alertData = {
                isVisible: true,
                message,
                status
            }
        },
        alertOff(state) {
            state.alertData = {isVisible: false, message: '', status: ''};
        },
        toggleIsFetching(state, isFetching) {
            state.isFetching = isFetching;
        },
        setCurrentProduct(state, product) {
            state.currentProduct = product;
        },
        clearCurrentProduct(state) {
            state.currentProduct = null;
            state.userCommentExists = false;
        },
        setProductComments(state, comments) {
            state.currentProduct.comments = comments;
        },
        clearCurrentProductComments(state) {
            state.currentProduct.comments = null;
        },
        toggleUserCommentExists(state, flag) {
            state.userCommentExists = flag;
        }
    },
    getters: {

    },
    actions: {
        async registration({commit, dispatch}, {email, password}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.registration(email, password, null);
                const userData = await response.data;
                localStorage.setItem('token', userData.accessToken);
                commit('setUserData', userData.user);
                commit('setIsAuth', true);
                dispatch('activateAlert', { message: 'User successfully registered', status: 'success' });
                commit('toggleAuthModal', false);
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async loginUser({commit, dispatch}, {email, password, isRemember}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.login(email, password, isRemember);
                const userData = await response.data;
                localStorage.setItem('token', userData.accessToken);
                commit('setUserData', userData.user);
                commit('setIsAuth', true);
                dispatch('activateAlert', { message: 'User successfully authorized', status: 'success'});
                commit('toggleAuthModal', false);
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async logoutUser({commit}) {
            try {
                await api.logout();
                localStorage.removeItem('token');
                commit('setUserData', defaultState.user);
                commit('setIsAuth', false);
            } catch (e) {
                console.log(e)
            }
        },
        async checkAuth({commit, dispatch}) {
            try {
                commit('toggleIsFetching', true);
                const response = await axios.get(`${BASE_URL}/auth/refresh`, {withCredentials: true});
                const userData = await response.data;
                localStorage.setItem('token', userData.accessToken);
                commit('setUserData', userData.user);
                commit('setIsAuth', true);
            } catch (e) {
                console.log(e);
                await dispatch('logoutUser');
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async activateAlert({commit, state}, { message, status }) {
            commit('alertOn', {message, status})
            setTimeout(() => {
                if (state.alertData.isVisible) commit('alertOff');
            }, 6000)
        },
        async getProductComments({commit, state}, {gender, id, page, user, sort}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getProductComments(gender, id, page, user, sort);
                commit('setProductComments', 
                state.currentProduct.comments ? 
                { 
                    pages: [...state.currentProduct.comments.pages, {data: response.data.data, page: response.data.page}], 
                    totalPages: state.currentProduct.comments.totalPages, 
                    totalCount: state.currentProduct.comments.totalCount,
                    userComment: response.data.userComment
                }
                : { 
                    pages: [{ data: response.data.data, page: response.data.page }], 
                    totalPages: response.data.totalPages, 
                    totalCount: response.data.totalCount,
                    userComment: response.data.userComment
                });
                if (response.data.userComment) {
                    commit('toggleUserCommentExists', true);
                }
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async getProduct({commit}, {gender, id, page, user, sort}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getProductById(gender, id);
                if (response.data) {
                    commit('setCurrentProduct', response.data);
                } else {
                    router.push('/');
                }
                const comments = await api.getProductComments(gender, id, page, user, sort);
                commit('setProductComments', {
                    pages: [{data: comments.data.data, page: comments.data.page}], 
                    totalPages: comments.data.totalPages, 
                    totalCount: comments.data.totalCount, 
                    userComment: comments.data.userComment
                });
                if (comments.data.userComment) {
                    commit('toggleUserCommentExists', true);
                }

            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async rateProduct({commit, dispatch}, {gender, productId, email, comment, rating}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.rateProduct(gender, productId, email, comment, rating);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                commit('clearCurrentProductComments');
                dispatch('getProductComments', { gender, id: productId, page: 1, user: email, sort: 'latest' });
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async deleteUserComment({commit, dispatch}, {gender, productId, email}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.deleteComment(gender, productId, email);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                commit('toggleUserCommentExists', false);
                dispatch('getProductComments', { gender, id: productId, page: 1, user: email, sort: 'latest' });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        },
        async editUserComment({commit, dispatch}, {gender, productId, email, comment, rating}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.editComment(gender, productId, email, comment, rating);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                commit('clearCurrentProductComments');
                dispatch('getProductComments', { gender, id: productId, page: 1, user: email, sort: 'latest' });
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        }
    },
    modules: {
        products
    }
})
