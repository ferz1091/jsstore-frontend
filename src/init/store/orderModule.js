import axios from 'axios';
import api from '../http/api';
export default {
    state: {
        cities: [],
        offices: [],
        streets: []
    }, 
    mutations: {
        setCities(state, cities) {
            state.cities = cities;
        },
        clearCities(state) {
            state.cities = [];
        },
        setOffices(state, offices) {
            state.offices = offices;
        },
        clearOffices(state, offices) {
            state.offices = [];
        },
        setStreets(state, streets) {
            state.streets = streets;
        },
        clearStreets(state, streets) {
            state.streets = [];
        }
    },
    getters: {

    },
    actions: {
        async getCities({commit, dispatch}, {value}) {
            try {
                commit('toggleIsFetching', true);
                const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                    apiKey: 'e25d92efef545e7359e4a6f21eb30284',
                    modelName: 'Address',
                    calledMethod: 'searchSettlements',
                    methodProperties: {
                        CityName: value,
                        Limit: 5,
                        page: 1
                    }
                });
                commit('setCities', response.data.data[0].Addresses);
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getPostOffices({commit, dispatch}, {value, ref}) {
            try {
                commit('toggleIsFetching', true);
                const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                    apiKey: 'e25d92efef545e7359e4a6f21eb30284',
                    modelName: 'Address',
                    calledMethod: 'getWarehouses',
                    methodProperties: {
                        CityRef: ref,
                        FindByString: value
                    }
                });
                commit('setOffices', response.data.data);
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async getStreet({commit, dispatch}, {value, ref}) {
            try {
                commit('toggleIsFetching', true);
                const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                    apiKey: 'e25d92efef545e7359e4a6f21eb30284',
                    modelName: 'Address',
                    calledMethod: 'searchSettlementStreets',
                    methodProperties: {
                        StreetName: value,
                        SettlementRef: ref,
                        Limit: 5,
                        page: 1
                    }
                })
                commit('setStreets', response.data.data[0].Addresses);
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
            } finally {
                commit('toggleIsFetching', false);
            }
        },
        async createOrder({commit, dispatch}, order) {
            try {
                commit('toggleIsFetching', true);
                const response = await api.createOrder(order);
                if (response.data.quantityIsNotCorrect) {
                    commit('setBasket', response.data.products);
                    dispatch('activateAlert', {message: 'Check the number of ordered items', status: 'warning'});
                    return null;
                } else {
                    return response.data.id;
                }
            } catch (error) {
                dispatch('activateAlert', {message: error.response.data.error, status: 'error'});
                return null;
            } finally {
                commit('toggleIsFetching', false);
            }
        }
    }
}
