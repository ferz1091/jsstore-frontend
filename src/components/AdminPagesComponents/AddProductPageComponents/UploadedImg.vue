<script>
export default {
    props: {
        image: {type: String, required: true},
        index: {type: Number, required: true},
        title: {type: Number, required: true},
        imgArrayLength: {type: Number, required: true},
        newTitle: {type: Boolean, default: false},
        editMode: {type: Boolean, default: false},
        secondImgArrayLength: {type: Number, required: true}
    },
    data() {
        return {
            value: this.title,
            scrimIsVisible: false
        }
    },
    methods: {
        removeImage() {
            if (this.scrimIsVisible) {
                this.$emit('removeImage');
            }
        },
        toggleScrim(value) {
            if (this.imgArrayLength > 1 || this.secondImgArrayLength > 0) {
                this.scrimIsVisible = value;
            }
        }
    },
    watch: {
        value() {
            this.$emit('titleChanged', this.value);
        },
        title() {
            this.value = this.title;
        }
    }
}
</script>
<template>
    <v-sheet 
        class="uploaded-img-wrapper" 
        color="background" 
        @mouseenter="toggleScrim(true)" 
        @mouseleave="toggleScrim(false)"
    >
        <Transition name="uploaded-img-scrim">
            <div v-if="scrimIsVisible" class="uploaded-img-scrim ma-2 rounded-xl" @click="removeImage()">
                <v-icon icon="mdi-delete-circle" color="background" size="large" />
            </div>
        </Transition>
        <v-img
            class="uploaded-img rounded-xl ma-2" 
            :src="image"
            cover
        />
        <v-checkbox 
            v-if="!editMode || editMode && newTitle"
            v-model="value" 
            :value="index" 
            class="img-checkbox" 
            :label="value === index ? 'Main': ''"
            :disabled="this.imgArrayLength < 2"
            hide-details 
        />
    </v-sheet>
</template>
<style>
.uploaded-img-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.uploaded-img-scrim {
    cursor: pointer;
    height: calc(100% - 16px);
    width: calc(100% - 16px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
}
.uploaded-img {
    cursor: pointer;
    max-width: 200px;
    height: 300px;
}
.img-checkbox {
    position: absolute;
    top: 95%;
    left: 50%;
    transform: translateX(-50%);
}
.uploaded-img-scrim-enter-active,
.uploaded-img-scrim-leave-active {
    transition: all 0.25s ease;
}
.uploaded-img-scrim-enter-from {
    opacity: 0;
}
.uploaded-img-scrim-leave-to {
    opacity: 0;
}
</style>
