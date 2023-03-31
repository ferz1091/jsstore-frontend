<script>
import ProductInfo from '@/components/ProductItemPageComponents/ProductInfo.vue';
import ProductComments from '@/components/ProductItemPageComponents/ProductComments.vue';
export default {
    data() {
        return {
            commentPage: 1,
            select: 'latest',
            rating: null,
            comment: '',
            editCommentMode: false,
            sizeSelect: null,
            amountSelect: 0,
            userCommentExists: false
        }
    },
    components: {
        ProductInfo,
        ProductComments
    },
    methods: {
        deleteUserComment() {
            this.editCommentMode = false;
            this.commentPage = 1;
            this.rating = null;
            this.comment = '';
        },
        async submitForm(valid) {
            if (valid) {
                if (!this.editCommentMode) {
                    this.$store.dispatch('rateProduct', { gender: this.$route.params.gender, productId: this.currentProduct._id, email: this.userEmail, comment: this.comment ? this.comment : null, rating: this.rating });
                    this.commentPage = 1;
                    this.rating = null;
                    this.comment = '';
                } else {
                    this.$store.dispatch('editUserComment', { gender: this.$route.params.gender, productId: this.currentProduct._id, email: this.userEmail, comment: this.comment ? this.comment : null, rating: this.rating });
                    this.commentPage = 1;
                    this.rating = null;
                    this.comment = '';
                    this.editCommentMode = false;
                }
            }
        },
        editComment(payload) {
            this.editCommentMode = true;
            this.comment = payload.comment;
            this.rating = payload.rating;
        },
        addToCart() {
            this.$store.commit('addToBasket', {product: this.currentProduct, size: this.sizeSelect, amount: this.amountSelect});
        },
        removeFromBasket() {
            this.$store.commit('removeFromBasket', this.currentProduct._id);
        },
        closeEdit() {
            this.editCommentMode = false;
            this.rating = null;
            this.comment = '';
        },
        updateSizeSelect(value) {
            this.sizeSelect = value;
        },
        changeAmount(value) {
            if (value && this.amountSelect < this.currentSizeAmount) {
                this.amountSelect += 1;
            } else if (!value && this.amountSelect > 0) {
                this.amountSelect -= 1;
            }
        },
        updateSortSelect(value) {
            this.select = value;
        },
        updateRatingInput(value) {
            this.rating = value;
        },
        updateCommentInput(value) {
            this.comment = value;
        },
        changePage(value) {
            this.commentPage = value;
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });
        if (this.product) {
            this.$store.dispatch('getProductComments', { gender: this.$route.params.gender, id: this.$route.params.itemId, page: this.commentPage, user: this.userEmail, sort: this.select });

        } else {
            this.$store.dispatch('getProduct', { gender: this.$route.params.gender, id: this.$route.params.itemId, page: this.commentPage, user: this.userEmail, sort: this.select });
        }
    },
    unmounted() {
        this.$store.commit('clearCurrentProduct');
    },
    watch: {
        select() {
            this.$store.commit('clearCurrentProductComments');
            this.commentPage = 1;
            this.$store.dispatch('getProductComments', { gender: this.$route.params.gender, id: this.$route.params.itemId, page: this.commentPage, user: this.userEmail, sort: this.select });
        },
        commentPage() {
            if (!this.currentPageComments) {
                this.$store.dispatch('getProductComments', { gender: this.$route.params.gender, id: this.$route.params.itemId, page: this.commentPage, user: this.userEmail, sort: this.select });
            }
        }
    },
    computed: {
        currentProduct() {
            return this.$store.state.currentProduct;
        },
        currentPageComments() {
            return this.$store.state.currentProduct && this.$store.state.currentProduct.comments ? this.$store.state.currentProduct.comments.pages.find(page => page.page === this.commentPage) : null;
        },
        userEmail() {
            return this.$store.state.user.email;
        },
        currentSizeAmount() {
            return this.sizeSelect ? this.$store.state.currentProduct.amount.find(size => size.size === this.sizeSelect).amount : 0;
        },
    }
}
</script>
<template>
    <main class="ProductItem page">
        <Transition name="productItem-container" appear>
            <v-sheet v-if="currentProduct" color="background">
                <ProductInfo 
                    :sizeSelect="sizeSelect"
                    :amountSelect="amountSelect"
                    @updateSizeSelect="updateSizeSelect"
                    @changeAmount="changeAmount"
                    @addToCart="addToCart"
                    @removeFromBasket="removeFromBasket"
                />
                <v-divider class="my-3 mx-16 border-opacity-25" color="surface" />
                <ProductComments 
                    :sortSelect="select"
                    :editCommentMode="editCommentMode"
                    :ratingInput="rating"
                    :commentInput="comment"
                    :commentPage="commentPage"
                    @updateSortSelect="updateSortSelect"
                    @updateRatingInput="updateRatingInput"
                    @updateCommentInput="updateCommentInput"
                    @changePage="changePage"
                    @submitForm="submitForm"
                    @editComment="editComment"
                    @deleteUserComment="deleteUserComment"
                    @closeEdit="closeEdit"
                />
            </v-sheet>
        </Transition>
    </main>
</template>
<style>
.productItem-container-enter-active,
.productItem-container-leave-active {
    transition: all 0.75s ease;
}
.productItem-container-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
.productItem-container-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
@media (max-width: 300px) {
    .form-rating {
        margin-left: 0px !important;
    }
    .product-info,
    .product-comments {
        padding-left: 5px;
        padding-right: 5px;
    }
}
</style>
