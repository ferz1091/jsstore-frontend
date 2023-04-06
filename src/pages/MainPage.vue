<script>
import MainPageCard from '@/components/MainPageCard.vue';
import initMainPageCard from '@/mixins/initMainPageCard';
export default {
    data() {
        return {
            isVisible: {
                men: false,
                women: false
            }
        }
    },
    mixins: [initMainPageCard],
    components: {
        MainPageCard
    },
    methods: {
        onAfterLeave(category) {
            if (category === 'men') {
                this.isVisible.men = false;
                this.isVisible.women = true;
            } else {
                this.isVisible.women = false;
                this.isVisible.men = true;
            }
        }
    },
    mounted() {
        this.isVisible[this.$route.params.gender] = true;
    },
    watch: {
        '$route.params.gender': {
            handler() {
                this.currentCategory = this.$route.params.gender;
            },
            immediate: true
        }
    },
    computed: {
        innerHeight() {
            return window.innerHeight;
        }
    }
}
</script>

<template>
    <main class="Main page">
        <Transition name="men-cards-container" appear @after-leave="() => onAfterLeave('men')">
            <v-container 
                v-bind:style="{ }"
                class="cards-container" 
                v-if="currentCategory === 'men' && isVisible.men" key="men-cards-container" 
                fluid
            >
                <MainPageCard 
                    v-for="category in categories.find(category => category.path === 'men').categories" 
                    :category="category" 
                />
            </v-container>
        </Transition>
        <Transition name="women-cards-container" appear @after-leave="() => onAfterLeave('women')" >
            <v-container 
                class="cards-container" 
                v-if="currentCategory === 'women' && isVisible.women" key="women-cards-container"
                fluid
            >
                <MainPageCard 
                    v-for="category in categories.find(category => category.path === 'women').categories" 
                    :category="category" 
                />
            </v-container>
        </Transition>
    </main>
</template>

<style>
    .cards-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-gap: calc(0px + 15 * (100vw / 1400));
        height: 100%;
        padding: calc(0px + 50 * (100vw / 1400));
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .men-cards-container-enter-active,
    .men-cards-container-leave-active,
    .women-cards-container-enter-active,
    .women-cards-container-leave-active {
        transition: all 0.75s ease;
    }
    .men-cards-container-enter-from,
    .women-cards-container-enter-from {
        opacity: 0;
        transform: translateX(-100%);
    }
    .men-cards-container-leave-to,
    .women-cards-container-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }
    @media (max-width: 900px) {
        .cards-container {
            grid-gap: 10px;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            padding: 20px;
        }
    }
    @media (max-width: 420px) {
        .cards-container {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, 1fr);
            padding: 10px;
        }
    }
</style>
