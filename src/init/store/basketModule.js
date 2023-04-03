export default {
    state: {
        products: []
    },
    mutations: {
        addToBasket(state, {product, size, amount}) {
            state.products = [...state.products, {item: product, size: size ? size : null, amount: amount ? amount : null}]
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
        clearBasket(state) {
            state.products = [];
        }
    },
    getters: {

    },
    actions: {

    }
}