<script>
export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    methods: {
        cardClick() {
            console.log('CARD CLICKED');
        }
    },
    computed: {
        imgPath() {
            return `http://localhost:5000/${this.product.images.find(img => img.title).path}`;
        },
        productName() {
            if (window.innerWidth < 1999) {
                return this.product.name.length > 32 ? this.product.name.slice(0,32) + '...' : this.product.name;
            } else {
                return this.product.name;
            }
        }
    }
}
</script>

<template>
    <v-card class="product-card rounded-lg" elevation="10" @click="cardClick">
        <div class="top-panel" :style="{ justifyContent: product.markers && product.markers.length ? 'space-between' : 'flex-end' }">
            <div v-if="product.markers" class="markers">
                <v-chip class="my-1" v-for="marker in product.markers" color="error" variant="elevated">
                    {{ marker }}
                </v-chip>
            </div>
            <v-btn class="fav-btn" icon="mdi-heart-outline" variant="flat" density="compact">
            </v-btn>
        </div>
        <v-img class="product-img" :src="imgPath"/>
        <div class="product-title text-body-1 mx-3 mt-2 rounded-lg">
            <v-card-title class="name-chip text-body-2 font-weight-bold">
                {{ productName }}
            </v-card-title>
        </div>
        <div class="rating">
            <v-rating 
                v-model="product.rating"
                readonly
                density="compact"
                color="rating"
                size="small"
            ></v-rating>
            <span class="text-caption">
                ({{ product.rateAmount }})
            </span>
        </div>
        <div class="price-block mx-7 py-2">
            <span class="value text-h6">
                <b class="actual-price" v-if="!product.isSale.flag">{{ product.value }}$</b>
                <b class="actual-price" v-else="!product.isSale.flag">
                    {{ product.isSale.value }}$
                    <s class="old-price text-body-2">
                        {{ product.value }}$
                    </s>
                </b>
            </span>
            <v-btn @click.stop class="basket-btn" color="background" variant="elevated" size="small" append-icon="mdi-basket-plus">
                add to
            </v-btn>
        </div>
    </v-card>
</template>

<style>
    .product-card {
        cursor: pointer;
    }
    .product-img {
        height: 60%;
        max-height: 250px;
        margin: 10px 10px 0 10px;
    }
    .product-title {
        text-align: center;
        min-height: 80px;
        display: flex;
        align-items: center;
    }
    .rating {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .price-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .actual-price {
        color: #C41E3A;
    }
    .actual-price {
        position: relative;
    }
    .old-price {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        color: gray;
    }
    .name-chip {
        width: 100%;
        display: flex;
        justify-content: center;
        white-space: normal !important;
        overflow: hidden;
        max-height: 80px;
    }
    .top-panel {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        display: flex;
        padding: 10px;
    }
    .markers {
        display: flex;
        flex-direction: column;
    }
</style>
