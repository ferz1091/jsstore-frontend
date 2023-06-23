import api from '../http/api';
export default {
    state: {
        code: null
    },
    mutations: {
        setCode(state, code) {
            state.code = code;
        }
    },
    getters: {

    },
    actions: {
        async googleAuth({commit, dispatch}, {code}) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.googleAuth(code);
                const userData = await response.data;
                localStorage.setItem('token', userData.accessToken);
                commit('setUserData', userData.user);
                commit('setIsAuth', true);
                dispatch('activateAlert', { message: 'Successfully logged in', status: 'success' });
                commit('toggleAuthModal', false);
                return true;
            } catch (error) {
                dispatch('activateAlert', { message: error.response.data.error, status: 'error' });
                return false;
            } finally {
                setTimeout(() => {
                    commit('toggleIsFetching', false);
                }, 2000);
            }
        }
    }

}
