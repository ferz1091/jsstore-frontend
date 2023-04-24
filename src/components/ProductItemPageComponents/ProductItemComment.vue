<script>
export default {
    name: 'comment-item',
    props: {
        comment: {type: Object, required: true},
        user: {type: Boolean},
        productId: {type: String},
        email: {type: String},
        editMode: {type: Boolean}
    },
    methods: {
        deleteUserComment() {
            this.$emit('deleteUserComment');
            this.$store.dispatch('deleteUserComment', {gender: this.$route.params.gender, productId: this.productId, email: this.email});
        },
        editComment() {
            if (this.editMode) {
                this.$emit('closeEdit');
            } else {
                this.$emit('editComment', this.comment);
            }
        }
    },
    computed: {
        editBtnColor() {
            return this.editMode ? 'b' : 's';
        },
        editBtnVariant() {
            return this.editMode ? 0 : 't';
        }
    }
}
</script>
<template>
    <v-list-item
        class="comment ma-5 rounded-lg"
        :key="comment.user"
        elevation="10"
        :style="{ background: user ? 'rgba(0, 100, 0, 0.2)' : 'none' }"
    >
        <p class="comment-user text-body-1 font-weight-bold ml-2 mt-2">
            {{ user ? 'My review' : comment.user.slice(0, comment.user.indexOf('@')) }}
        </p>
        <div class="comment-rating">
            <v-chip class="comment-date" density="compact" variant="elevated" color="surface">
                {{ new Date(comment.date).toLocaleString() }}
            </v-chip>
            <v-rating
                class="ml-2"
                v-if="comment.rating"
                v-model="comment.rating"
                readonly
                density="compact"
                color="rating"
                size="small"
            />
        </div>
        <p v-if="comment.comment" class="comment-text text-caption font-italic rounded-lg my-2 pa-2 elevation-2">
            {{ comment.comment }}
        </p>
        <div class="comment-btns">
            <button-ui 
                v-if="user"
                class="comment-edit-btn mr-1"
                :set="[editBtnVariant, editBtnColor, '1', 'mdi-pencil', 's']"
                @click="editComment"
            />
            <button-ui
                v-if="user"
                class="comment-delete-btn"
                :set="['t', 's', '1', 'mdi-delete', 's']"
                @click="deleteUserComment"
            />
        </div>
    </v-list-item>
</template>
<style>
    .comment-text {
        background: rgba(0, 0, 0, 0.1);
        word-wrap: break-word;
    }
    .comment-rating {
        display: flex;
    }
    .comment-btns {
        position: absolute;
        top: 12px;
        right: 16px;
    }
    @media (max-width: 370px) {
        .comment-rating {
            flex-direction: column;
        }
        .comment-date {
            display: flex;
            justify-content: center;
        }
    }
</style>
