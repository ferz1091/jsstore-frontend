<script>
import ProductItemComment from './ProductItemComment.vue';
export default {
    components: {
        ProductItemComment
    },
    props: {
        sortSelect: {type: String, required: true},
        editCommentMode: {type: Boolean, required: true},
        ratingInput: {type: Number, default: null},
        commentInput: {type: String, default: null},
        commentPage: {type: Number, required: true}
    },
    data() {
        return {
            sort: this.sortSelect,
            sortSelectVariants: ['latest', 'rating', 'helpful'],
            commentRules: [
                value => {
                    if (!value || value.length < 251) return true;
                    return 'Maximum comment size is 250 characters.';
                }
            ],
            page: this.commentPage,
            rating: this.computedRating,
            comment: this.computedComment
        }
    },
    methods: {
        updateSortSelect(newValue) {
            this.$emit('updateSortSelect', newValue);
        },
        updateRatingInput(newValue) {
            this.$emit('updateRatingInput', newValue);
        },
        updateCommentInput(newValue) {
            this.$emit('updateCommentInput', newValue);
        },
        changePage(newValue) {
            this.$emit('changePage', newValue);
        },
        async submitForm() {
            const { valid } = await this.$refs.commentFormRef.validate();
            this.$emit('submitForm', valid);
        },
        resetRatingInput() {
            this.$emit('updateRatingInput', null);
        },
        deleteUserComment() {
            this.comment = null;
            this.rating = null;
            this.$emit('deleteUserComment');
        },
        editComment(payload) {
            this.comment = payload.comment;
            this.rating = payload.rating;
            this.$emit('editComment', payload);
        },
        closeEdit() {
            this.$emit('closeEdit');
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
        sendCommentBtnVisible() {
            if (!this.editCommentMode) {
                if (this.rating) {
                    if (this.comment) {
                        if (this.comment.length > 3) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                } else if (this.comment && this.comment.length > 3) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.currentProduct.comments.userComment.comment === this.comment && this.currentProduct.comments.userComment.rating === this.rating) return false;
                return true;
            }
        },
        userComment() {
            if (this.currentProduct && this.currentProduct.comments && this.currentProduct.comments.userComment) {
                return true;
            }
            return false;
        },
        computedRating() {
            return this.ratingInput;
        },
        computedComment() {
            return this.commentInput;
        },
        userCommentExists() {
            return this.$store.state.userCommentExists;
        }
    }
}
</script>
<template>
    <v-sheet 
        v-if="currentPageComments && currentProduct.comments.totalCount || userEmail"
        class="product-comments" 
        color="background"
    >
        <p class="reviews-title text-button py-3">
            Reviews&Comments
            <v-select 
                v-model="sort"
                @update:modelValue="updateSortSelect"
                :items="sortSelectVariants" 
                class="comments-sort-select text-caption" 
                variant="solo"
                bg-color="surface" 
                label="Sort by:" 
                density="compact" 
                :disabled="!currentProduct || !currentProduct.comments || !(currentProduct.comments.totalCount > 10)"
                hide-details 
            />
        </p>
        <Transition name="comment-panel" mode="out-in">
            <v-sheet
                v-if="userEmail && !userCommentExists || editCommentMode"
                class="comment-add-panel mx-5 pb-4" color="background"
            >
                <v-form @submit.prevent="submitForm" ref="commentFormRef">
                    <v-rating 
                        v-model="rating"
                        @update:modelValue="updateRatingInput"
                        class="form-rating mx-5 mb-3" 
                        density="compact" 
                        color="rating"
                        size="small" 
                    />
                    <v-textarea 
                        v-model="comment"
                        @update:modelValue="updateCommentInput"
                        :rules="commentRules" 
                        class="comment-input" 
                        variant="outlined"
                        label="Feedback"
                        placeholder="Share your feedback about the product. Your review will help other customers make a choice!"
                        clearable 
                    />
                    <Transition name="reset-rating-btn">
                        <v-btn 
                            v-if="rating" 
                            @click="resetRatingInput"
                            class="reset-rating-btn" 
                            density="comfortable"
                        >
                            reset
                        </v-btn>
                    </Transition>
                    <Transition name="send-comment-btn">
                        <v-btn 
                            v-if="sendCommentBtnVisible" 
                            class="send-comment-btn" 
                            icon="mdi-send"
                            size="small" 
                            density="comfortable"
                            type="submit" 
                        />
                    </Transition>
                </v-form>
            </v-sheet>
        </Transition>
        <pagination 
            v-if="currentProduct && currentProduct.comments && currentProduct.comments.totalPages > 1"
            v-model="page"
            @update:modelValue="changePage"
            :class="'pagination-top'" 
            :length="currentProduct.comments.totalPages" 
        />
        <Transition name="comment-list" mode="out-in">
            <v-list 
                v-if="currentPageComments && currentProduct.comments.totalCount || currentProduct && currentProduct.comments && currentProduct.comments.userComment"
                :key="page"
                class="comment-list" 
                bg-color="background"
            >
                <ProductItemComment 
                    v-if="currentProduct.comments.userComment"
                    :comment="currentProduct.comments.userComment" 
                    :user="true" 
                    :productId="currentProduct._id"
                    :email="userEmail" 
                    :editMode="editCommentMode" 
                    @deleteUserComment="deleteUserComment"
                    @editComment="editComment" 
                    @closeEdit="closeEdit" 
                />
                <ProductItemComment v-for="comment in currentPageComments.data" :comment="comment" />
                <pagination 
                    v-if="currentProduct.comments.totalPages > 1" 
                    v-model="page"
                    @update:modelValue="changePage" 
                    :length="currentProduct.comments.totalPages" 
                    :class="'pagination-bottom'"
                />           
            </v-list>
        </Transition>
    </v-sheet>
</template>
<style>
.product-comments {
    padding-left: calc(0px + 60 * (100vw / 1400));
    padding-right: calc(0px + 60 * (100vw / 1400));
    max-width: 2000px;
    margin: 0 auto;
}
.reviews-title {
    position: relative;
    font-size: 18px !important;
    text-align: center;
}
.comments-sort-select {
    position: absolute;
    z-index: 3;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 200px;
}
.comment-input {
    width: 100%;
}
.reset-rating-btn {
    position: absolute;
    bottom: calc(100% - 28px);
    left: 125px;
}
.send-comment-btn {
    position: absolute;
    bottom: calc(100% - 28px);
    right: -7px;
}
.comment-list {
    min-height: 264px !important;
}
.comment-panel-enter-active,
.comment-panel-leave-active {
    transition: all 0.6s ease;
}

.comment-panel-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}

.comment-panel-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
.comment-add-panel {
    position: relative;
    z-index: 2;
}
.send-comment-btn-enter-active,
.send-comment-btn-leave-active,
.reset-rating-btn-enter-active,
.reset-rating-btn-leave-active {
    transition: all 0.4s ease;
}

.send-comment-btn-enter-from,
.reset-rating-btn-enter-from {
    scale: 0;
}

.send-comment-btn-leave-to,
.reset-rating-btn-leave-to {
    scale: 0;
}
.comment-list-enter-active,
.comment-list-leave-active {
    transition: all 0.6s ease;
}

.comment-list-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}

.comment-list-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
@media (max-width: 750px) {
    .comments-sort-select {
        width: auto;
    }
}
@media (max-width: 600px) {
    .comments-sort-select {
        top: 110%;
    }
    .reviews-title {
        padding-bottom: 22px !important;
    }
}
</style>
