<script>
import HomepageCard from '../components/HomepageCard.vue';
export default {
    data() {
        return {
            cards: [
                {link: 'http://localhost:5000/assets/41053be053887e7985d1e70dd93fd21a', title: 'For him', description: 'discover men\'s collection', isShow: false, isChosen: false, path: '/shop/entry/men'},
                {link: 'http://localhost:5000/assets/a88ea5944c647f08eaff2b5b08ba3e72', title: 'For her', description: 'discover women\'s collection', isShow: false, isChosen: false, path: '/shop/entry/women'},
                {link: 'http://localhost:5000/assets/00c1c2c1deb2c6f2bcddc49c4f56baad', title: 'Sale', description: 'view all available items', isShow: false, isChosen: false, path: '/shop/sale/1'}

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
        />
    </main>
</template>

<style>
    .Homepage {
        height: 100vh;
        display: flex;
    }
</style>
