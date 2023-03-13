import { createStore } from 'vuex';
import api from '../http/api';
import axios from 'axios';
import { BASE_URL } from '../http';
import products from './productsModule';

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
    loginModalActive: false,
    regModalActive: false,
    filterModalActive: false,
    alertData: {
        isVisible: false,
        message: '',
        status: ''
    }
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
        toggleLoginModal(state, isActive) {
            state.loginModalActive = isActive;
        },
        toggleRegModal(state, isActive) {
            state.regModalActive = isActive;
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
        }
    },
    getters: {

    },
    actions: {
        async registration({commit, dispatch}, {email, password, phone}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.registration(email, password, phone);
                const userData = await response.data;
                localStorage.setItem('token', userData.accessToken);
                commit('setUserData', userData.user);
                commit('setIsAuth', true);
                dispatch('activateAlert', { message: 'User successfully registered', status: 'success' });
                commit('toggleRegModal', false);
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
                commit('toggleLoginModal', false);
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
                commit('setUserData', defaultState);
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
                commit('toggleIsFetching', false);
            }
        },
        async activateAlert({commit, state}, { message, status }) {
            commit('alertOn', {message, status})
            setTimeout(() => {
                if (state.alertData.isVisible) commit('alertOff');
            }, 6000)
        },
    },
    modules: {
        products
    }
})
