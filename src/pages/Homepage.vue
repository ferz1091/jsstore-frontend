<script>
import HomepageCard from '../components/HomepageCard.vue';
import men from '@/assets/men.jpg';
import women from '@/assets/women.jpg';
import sale from '@/assets/sale.jpg';
export default {
    data() {
        return {
            cards: [
                {img: men, title: 'For him', description: 'discover men\'s collection', isShow: false, isChosen: false, path: '/shop/entry/men'},
                {img: women, title: 'For her', description: 'discover women\'s collection', isShow: false, isChosen: false, path: '/shop/entry/women'},
                {img: sale, title: 'Sale', description: 'view all available items', isShow: false, isChosen: false, path: '/shop/sale/1'}

            ],
            displayWidth: null
        }
    },
    methods: {
        showCards(i, length) {
            if (i === length) {
                return 0;
            }
            this.cards[i].isShow = true;
            setTimeout(() => {
                this.showCards(i + 1, length)
            }, 700)
        },
        cardClick(title, i) {
            if (typeof i !== 'number') {
                this.cardClick(title, this.cards.length - 1);
                return 0;
            }
            if (i < 0) {
                return 0;
            }
            if (this.cards[i].title === title) {
                this.cardClick(title, i - 1);
                setTimeout(() => {
                    this.cards[i].isChosen = true;
                }, 1000 + i * 300);
                setTimeout(() => {
                    this.cards[i].isShow = false;
                }, 6000)
                return 0;
            } 
            this.cards[i].isShow = false;
            setTimeout(() => {
                this.cardClick(title, i - 1);
            }, 700)
        },
        redirect() {
            this.$router.push(this.cards.find(card => card.isChosen).path);
        },
        setDisplayWidth() {
            this.displayWidth = window.innerWidth;
        }
    },
    components: {
        HomepageCard
    },
    mounted() {
        this.showCards(0, this.cards.length)
    },
    computed: {
        innerWidth() {
            return window.innerWidth;
        },
        userDeviseIsMobile() {
            return this.$store.state.userDeviseIsMobile;
        }
    }
}
</script>

<template>
    <main class="Homepage">
        <HomepageCard 
            v-for="(card, index) in cards"
            :card="card"
            :index="index"
            :key="card.title"
            @cardClick="cardClick"
            @redirect="redirect"
            v-bind:style="{height: userDeviseIsMobile ? `3000px` : '100vh'}"
        />
    </main>
</template>

<style>
    .Homepage {
        height: 100%;
        display: flex;
    }
</style>
