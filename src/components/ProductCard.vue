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
        },
        topPanelJustify() {
            if (this.product.markers.length || this.product.isSale.flag || this.product.amount.every(prod => prod.amount === 0)) return 'space-between';
            return 'flex-end';
        }
    }
}
</script>

<template>
    <v-card class="product-card rounded-lg" elevation="10" @click="cardClick" color="background">
        <div class="top-panel" :style="{ justifyContent: topPanelJustify }">
            <div v-if="product.markers" class="markers">
                <v-chip v-if="product.isSale.flag" class="my-1" color="error" variant="elevated">
                    Sale
                </v-chip>
                <v-chip class="my-1" v-for="marker in product.markers" color="error" variant="elevated">
                    {{ marker }}
                </v-chip>
                <v-chip v-if="product.amount.every(prod => prod.amount === 0)" color="gray" variant="elevated" >
                    Out
                </v-chip>
            </div>
            <v-btn class="fav-btn" icon="mdi-heart-outline" color="background" variant="flat" density="compact" @click.stop="">
            </v-btn>
        </div>
        <v-img class="product-img" :src="imgPath">
            <div class="product-sizes">
                <v-chip 
                    class="product-size-label"
                    v-for="size in product.amount.filter(size => size.amount)"
                    variant="elevated"
                    density="comfortable"
                    color="surface"
                >
                    {{ size.size }}
                </v-chip>
            </div>
        </v-img>
        <div class="price-block mx-7 py-2">
            <span class="value text-h5">
                <b class="actual-price" :style="product.amount.every(prod => prod.amount === 0) ? 'color: gray;' : 'color: #C41E3A;'">
                    {{ product.value }}$
                </b>
                <s v-if="product.isSale.flag" class="old-price text-body-2">
                    {{ product.isSale.oldValue }}$
                </s>
            </span>
            <v-btn :disabled="product.amount.every(prod => prod.amount === 0)" @click.stop class="basket-btn" color="surface" variant="elevated" size="small" append-icon="mdi-basket-plus">
                add to
            </v-btn>
        </div>
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
    </v-card>
</template>

<style>
    @keyframes imageIn {
        0% {
            opacity: 0;
             transform: translateY(-100%);
        }
        100% {
            opacity: 1;
            transform: translateY(0%);
        }
    }
    .product-card {
        cursor: pointer;
        display: flex !important;
        flex-direction: column;
        justify-content: space-around;
    }
    .product-img {
        opacity: 0;
        margin: 10px 10px 0 10px;
        animation: imageIn 1s ease-in-out 0.4s 1 normal forwards;

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
        padding-bottom: 20px;
    }
    .price-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .actual-price {
        position: relative;
    }
    .old-price {
        position: absolute;
        top: 100%;
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
    .value {
        position: relative;
    }
    .product-sizes {
        position: absolute;
        bottom: 10px;
        right: 0;
        display: flex;
        flex-direction: column;
    }
    .product-size-label {
        display: flex;
        justify-content: center;
        margin-top: 2px;
    }
    @media (max-width: 3840px) {
        .product-img {
            height: calc(60vw / 3.1);
        }
    }
    @media (max-width: 2048px) {
        .product-img {
            height: calc(80vw / 3.1);
        }
    }
    @media (max-width: 1400px) {
        .product-img {
            height: calc(95vw / 3.1);
        }
    }
    @media (max-width: 950px) {
        .product-img {
            height: calc(95vw / 2.3);
        }
    }
    @media (max-width: 725px) {
        .product-img {
            height: calc(90vw / 1.5);
        }
    }
    @media (max-width: 480px) {
        .product-img {
            height: calc(90vw / 0.77);
        }
    }
</style>
