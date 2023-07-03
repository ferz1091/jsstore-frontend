export default {
    state: {
        products: []
    },
    mutations: {
        addToBasket(state, {product, size, amount}) {
            state.products = [...state.products, {item: product, size: size ? size : null, amount: amount ? amount : 0}]
        },
        removeFromBasket(state, id) {
            state.products = state.products.filter(product => product.item._id !== id);
        },
        setProductSize(state, {id, size}) {
            state.products = state.products.map(product => {
                if (product.item._id === id) {
                    return {
                        ...product,
                        size: size
                    }
                } else {
                    return product;
                }
            })
        },
        setProductAmount(state, {id, amount}) {
            state.products = state.products.map(product => {
                if (product.item._id === id) {
                    return {
                        ...product,
                        amount: amount
                    }
                } else {
                    return product;
                }
            })
        },
        setBasket(state, products) {
            state.products = products;
        },
        clearBasket(state) {
            state.products = [];
        },
        removeBasketErrors(state) {
            state.products = state.products.map(product => {
                return {item: product.item, size: product.size, amount: product.amount}
            })
        }
    },
    getters: {
        basket(state) {
            return state.products;
        },
        basketPrice(state) {
            return state.products.map(product => {
                if (product.amount) {
                    return product.item.value * product.amount;
                } else {
                    return 0;
                }
            }).reduce((acc, item) => acc + item, 0);
        },
        basketSize(state) {
            return state.products.length;
        }
    },
    actions: {

    }
}
