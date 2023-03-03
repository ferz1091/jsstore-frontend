<script>
export default {
    data () {
        return {
            isHover: false
        }
    },
    props: {
        category: {
            type: Object,
            required: true,
            default: {name: '', link: '', desc: ''}
        }
    },
    methods: {
        mouserEnter() {
            this.isHover = true;
        },
        mouseLeave() {
            this.isHover = false;
        },
        cardClick() {
            this.$router.push(`/shop/${this.$route.params.gender}/${this.category.name}/1`);
        }
    }
}
</script>

<template>
    <v-card class="category-card rounded-0" @mouseenter="mouserEnter" @mouseleave="mouseLeave" @click="cardClick">
        <v-card-title class="category-title text-overline font-weight-bold">
            {{ category.name }}
            <v-divider class="border-opacity-75"></v-divider>
        </v-card-title>
        <v-img class="category-img" :src="category.link" cover />
        <Transition name="card-text">
            <v-card-text v-if="isHover" class="category-text text-overline">
                {{ category.desc }}
            </v-card-text>
        </Transition>
    </v-card>
</template>

<style>
    @keyframes imageIn {
        0% {
            transform: translateY(-100%);
        }
        100% {
            opacity: 1;
            transform: translateY(0%);
        }
    }
    .category-card {
        cursor: pointer;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.1) !important;
    }
    .category-card:hover .category-img {
        scale: 1.1;
    }
    .category-title {
        position: absolute;
        z-index: 1;
        text-shadow: 0px 0px 2px black;
        font-size: 16px !important;
        color: white;
    }
    .category-text {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: white;
        background: rgba(0, 0, 0, 0.35);
    }
    .category-img {
        opacity: 0;
        animation: imageIn 1s ease-in-out 0.5s 1 normal forwards;
        transition: all 0.5s ease;
    }
    .card-text-enter-active,
    .card-text-leave-active {
        transition: all 0.5s ease;
    }

    .card-text-enter-from, .card-text-leave-to {
        transform: translateY(100px);
    }
</style>
