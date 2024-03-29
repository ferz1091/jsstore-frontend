import { createStore } from 'vuex';
import api from '../http/api';
import axios from 'axios';
import { BASE_URL } from '../http';
import products from './productsModule';
import basket from './basketModule';
import order from './orderModule';
import authBack from './authBackModule';
import { router } from '@/router/router';

const defaultState = {
    user: {
        id: null,
        email: null,
        isActivated: false,
        roles: [],
        phone: null,
        name: null,
        surname: null
    },
    isFetching: false,
    isAuth: false,
    authModalActive: false,
    filterModalActive: false,
    basketModalActive: false,
    emailConfirmationModalActive: false,
    alertData: {
        isVisible: false,
        message: '',
        status: ''
    },
    currentProduct: null,
    userCommentExists: false,
    userDeviceIsMobile: false,
    userFavorites: null,
    userSessions: null,
    userOrders: null
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
        toggleBasketModal(state, isActive) {
            state.basketModalActive = isActive;
        },
        emailConfirmationModal(state, isActive) {
            state.emailConfirmationModalActive = isActive;
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
        },
        toggleUserDevice(state, flag) {
            state.userDeviceIsMobile = flag;
        },
        setFavorites(state, products) {
            state.userFavorites = products;
        },
        clearFavorites(state) {
            state.userFavorites = null;
        },
        setSessions(state, sessions) {
            state.userSessions = sessions;
        },
        clearSessions(state) {
            state.userSessions = null;
        },
        setOrders(state, orders) {
            state.userOrders = orders;
        },
        updateOrder(state, updatedOrder) {
            state.userOrders = state.userOrders.map(order => {
                if (order._id === updatedOrder._id) {
                    return updatedOrder;
                } else {
                    return order;
                }
            })
        },
        clearOrders(state) {
            state.userOrders = null;
        },
        updateOrderProduct(state, {orderId, updatedProducts}) {
            state.userOrders = state.userOrders.map(order => {
                if (order._id === orderId) {
                    return {
                        ...order,
                        products: updatedProducts
                    }
                } else {
                    return order;
                }
            })
        }
    },
    getters: {
        isAuth(state) {
            return state.isAuth;
        },
        isFetching(state) {
            return state.isFetching;
        },
        panelRights(state) {
            return state.user.roles.some(role => role === 'ADMIN');
        },
        userId(state) {
            return state.user.id;
        },
        userEmail(state) {
            return state.user.email;
        },
        userRoles(state) {
            return state.user.roles;
        },
        userFavorites(state) {
            const products = state.userFavorites;
            if (products) {
                let result = [];
                for (let i = 0; i < products.men.length + products.women.length; i++) {
                    if (products.men[i] !== undefined) {
                        result.push(products.men[i]);
                    }
                    if (products.women[i] !== undefined) {
                        result.push(products.women[i]);
                    }
                }
                return result;
            }
            return [];
        },
        userOrders(state) {
            const orders = state.userOrders;
            return orders && orders.length ? orders.sort((orderA, orderB) => {
                if (new Date(orderA.order_date) < new Date(orderB.order_date)) {
                    return 1;
                } else {
                    return -1;
                }
            }) : [];
        }
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
                commit('toggleIsFetching', false);
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
                commit('toggleIsFetching', false);
            }
        },
        async logoutUser({commit, dispatch}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.logout();
                localStorage.removeItem('token');
                localStorage.removeItem('sendMailLinkExpiresIn');
                commit('setUserData', {
                    id: null,
                    email: null,
                    isActivated: false,
                    roles: [],
                    phone: null
                });
                commit('setIsAuth', false);
                dispatch('activateAlert', { message: 'User successfully logged out', status: 'success' });
            } catch (e) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
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
                commit('toggleIsFetching', false);
            }
        },
        async activateAlert({commit, state}, { message, status }) {
            const alertMessage = message;
            commit('alertOn', {message: message ? message : 'Something goes wrong, try again later.', status})
            setTimeout(() => {
                if (state.alertData.isVisible && alertMessage === state.alertData.message) commit('alertOff');
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
                commit('toggleIsFetching', false);
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
                commit('toggleIsFetching', false);
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
                commit('toggleIsFetching', false);
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
                commit('toggleIsFetching', false);
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
                commit('toggleIsFetching', false);
            }
        },
        async getUserInfo({commit}, {id}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getUserInfo(id);
                return response.data;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getEmailChangeConfirmationCode({commit, dispatch}, {id, email}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getEmailChangeConfirmationCode(id, email);
                dispatch('activateAlert', { message: 'The code has been sent. Check your email!', status: 'info' });
                commit('emailConfirmationModal', true);
            } catch (error) {
                console.log(error);
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async editUserInfo({commit, dispatch}, {id, info, code}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.editUserInfo(id, info, code ? code : null);
                if (code) {
                    this.commit('emailConfirmationModal', false);
                }
                const user = await dispatch('getUserInfo', {id});
                this.commit('setUserData', user);
                dispatch('activateAlert', { message: 'Profile updated!', status: 'success' });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                if (code) {
                    this.commit('emailConfirmationModal', false);
                }
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async sendActivationLink({commit, dispatch}, id) {
            try {
                commit('toggleIsFetching', true);
                const sendMailLinkExpiresIn = localStorage.getItem('sendMailLinkExpiresIn');
                if (sendMailLinkExpiresIn && new Date().getTime() < Number(sendMailLinkExpiresIn)) {
                    const ms = Number(sendMailLinkExpiresIn) - new Date().getTime();
                    const minutes = Math.floor((ms / 1000) / 60);
                    const seconds = (ms / 1000) & 60;
                    dispatch('activateAlert', { message: `Try again in ${minutes}:${seconds} mins.`, status: 'error' });
                } else {
                    await api.sendActivationEmail(id);
                    localStorage.setItem('sendMailLinkExpiresIn', new Date().getTime() + 300000);
                    dispatch('activateAlert', { message: 'Activation link has been sent. Check your email.', status: 'success' });
                    localStorage.removeItem('sendMailLinkExpiresIn');
                }
            } catch(error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async addToFavorites({commit, dispatch}, {id, gender, productId}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.addToFavorites(id, gender, productId);
                commit('setUserData', response.data.user);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async removeFromFavorites({commit, dispatch, state}, {id, gender, productId}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.removeFromFavorites(id, gender, productId);
                commit('setUserData', response.data.user);
                if (state.userFavorites) {
                    state.userFavorites[gender] = state.userFavorites[gender].filter(product => product._id !== productId);
                }
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getUserFavorites({commit, dispatch}, {id}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getUserFavorites(id);
                commit('setFavorites', response.data);
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async changePassword({commit, dispatch}, {id, password, newPassword}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.changePassword(id, password, newPassword);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getUserSessions({commit, dispatch}, {id}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getUserSessions(id);
                commit('setSessions', response.data);
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async closeSession({commit, dispatch}, {sessionId, userId}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.closeSession(sessionId, userId);
                commit('setSessions', response.data);
                dispatch('activateAlert', { message: 'Session successfully closed.', status: 'success' });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getUserOrders({commit, dispatch}, {userId}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getUserOrders(userId);
                commit('setOrders', response.data);
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getOrderProducts({commit, dispatch}, {orderId}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getOrderProducts(orderId);
                commit('updateOrderProduct', {orderId, updatedProducts: response.data});
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async cancelOrder({commit, dispatch}, {id}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.cancelOrder(id);
                console.log(response);
                commit('updateOrder', response.data);
                dispatch('activateAlert', { message: 'Order has been canceled', status: 'success' });
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async addProduct({commit, dispatch}, payload) {
            try {
                commit('toggleIsFetching', true);
                const formData = new FormData();
                formData.append('product', JSON.stringify({prod: payload.product, type: payload.type, title: payload.title}));
                Object.values(payload.images).forEach(image => formData.append('files', image));
                const response = await api.addProduct(formData);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                return response.data.link;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async editProduct({commit, dispatch}, payload) {
            try {
                commit('toggleIsFetching', true);
                const formData = new FormData();
                formData.append('product', JSON.stringify({prod: payload.product, type: payload.type, title:payload.title, oldImages: payload.oldImages, newTitle: payload.newTitle}));
                Object.values(payload.images).forEach(image => formData.append('files', image));
                const response = await api.editProduct(formData);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getRecoveryCode({commit, dispatch}, email) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.getRecoveryCode(email);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async validateRecoveryCode({commit, dispatch}, {email, code}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.validateRecoveryCode(email, code);
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async changePasswordByCode({commit, dispatch}, {email, code, password}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.changePasswordByCode(email, code, password);
                dispatch('activateAlert', { message: response.data.message, status: 'success' });
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                commit('toggleIsFetching', false);
            }
        }
    },
    modules: {
        products,
        basket,
        order,
        authBack
    }
})
