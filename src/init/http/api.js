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
        return instance.get(`/product/get?gender=${gender}&category=${category}&currentPage=${currentPage}&sort=${sort ? sort : 'rating'}${brands ? `&brands=${brands}` : ''}${types ? `&types=${types}` : ''}${valueRange ? `&range=${valueRange}` : ''}`);
    },
    getFilters({gender, category, brands, types, sale, categoryFilters, valueRange}) {
        return instance.get(`/product/getfilter?gender=${gender}${category ? `&category=${category}` : ''}${brands ? `&brands=${brands}` : ''}${types ? `&types=${types}` : ''}${sale ? `&sale=${sale}` : ''}${categoryFilters ? `&categoryFilters=${categoryFilters}` : ''}${valueRange ? `&range=${valueRange}` : ''}`);
    },
    getSales({gender, category, currentPage, sort, brands, types, categoryFilters, valueRange}) {
        return instance.get(`/product/getsale?currentPage=${currentPage}${gender ? `&gender=${gender}` : ''}${category ? `&category=${category}` : ''}&sort=${sort ? sort : 'rating'}${brands ? `&brands=${brands}` : ''}${types ? `&types=${types}` : ''}${categoryFilters ? `&categoryFilters=${categoryFilters}` : ''}${valueRange ? `&range=${valueRange}` : ''}`)
    },
    getProductComments(gender, id, page, user, sort) {
        return instance.get(`/product/comments?gender=${gender}&id=${id}&page=${page}&sort=${sort}${user ? `&user=${user}` : ''}`);
    },
    getProductById(gender, id) {
        return instance.get(`/product/byid?gender=${gender}&id=${id}`);
    },
    rateProduct(gender, productId, email, comment, rating) {
        return instance.post('/product/rate', {gender, productId, email, comment, rating});
    },
    deleteComment(gender, productId, email) {
        return instance.post('/product/comment_delete', {gender, productId, email});
    },
    editComment(gender, productId, email, comment, rating) {
        return instance.post('/product/comment_edit', {gender, productId, email, comment, rating});
    },
    getUserInfo(id) {
        return instance.get(`/users/info?id=${id}`);
    },
    checkEmail(email) {
        return instance.get(`/users/email_check?email=${email}`);
    },
    getEmailChangeConfirmationCode(id, email) {
        return instance.get(`/users/email_change?id=${id}&email=${email}`);
    },
    editUserInfo(id, info, code) {
        return instance.put('/users/edit', {id, info, code});
    },
    sendActivationEmail(id) {
        return instance.post('/users/email_send', {id});
    },
    addToFavorites(id, gender, productId) {
        return instance.put('/product/addtofav', {id, gender, productId});
    },
    removeFromFavorites(id, gender, productId) {
        return instance.put('/product/removefromfav', {id, gender, productId});
    },
    getUserFavorites(id) {
        return instance.get(`/product/getfavorites?id=${id}`);
    },
    changePassword(id, password, newPassword) {
        return instance.put('/users/change_password', {id, password, newPassword});
    },
    getUserSessions(id) {
        return instance.get(`/users/sessions?id=${id}`);
    },
    closeSession(sessionId, userId) {
        return instance.put('/users/close_session', {sessionId, userId});
    },
    createOrder(order) {
        return instance.post('/order/create', {...order});
    },
    getUserOrders(userId) {
        return instance.get(`/order/user_orders?id=${userId}`);
    },
    getOrderProducts(orderId) {
        return instance.get(`/order/products?orderId=${orderId}`);
    },
    cancelOrder(id) {
        return instance.put('/order/cancel', {id});
    },
    addProduct(data) {
        return instance.post('/product/add', data);
    },
    editProduct(data) {
        return instance.put('/product/edit', data);
    },
    getRecoveryCode(email) {
        return instance.get(`/users/recovery_code?email=${email}`);
    },
    validateRecoveryCode(email, code) {
        return instance.get(`/users/recovery_validate?email=${email}&code=${code}`);
    },
    changePasswordByCode(email, code, password) {
        return instance.put('/users/change_password_code', {email, code, password});
    },
    googleAuth(code) {
        return instance.post('/auth/google', {code});
    },
    getProductsByString(gender, string, page) {
        return instance.get(`/product/getByString?gender=${gender}&searchString=${string}&currentPage=${page}`);
    }
}

export default api;
