<script>
import ProductProp from '@/components/ProductItemPageComponents/ProductProp.vue';
export default {
    components: {
        ProductProp
    },
    props: {
        product: {type: Object, required: true}
    }
}
</script>
<template>
    <v-sheet class="order-desc-item px-4 pb-2 mb-2 rounded-lg elevation-4" color="background">
        <p class="text-button text-center text-truncate">
            {{ product.item.name }}
        </p>
        <v-sheet class="order-desc-item-info" color="background">
            <v-img
                
                class="order-desc-item-img" 
                :src="`https://jsstore-backend.vercel.app/${product.item.images.find(image => image.title).path}`" 
            />
            <div class="order-desc-item-panel ml-5">
                <div class="order-desc-item-panel-content">
                    <product-prop class="font-weight-bold text-body-2" name="Size">
                        <v-chip 
                            class="content-chip ml-2" 
                            variant="elevated" 
                            color="surface" 
                            density="compact"
                        >
                            {{ product.size }}
                        </v-chip>
                    </product-prop>
                    <product-prop class="font-weight-bold text-body-2" name="Amount">
                        <v-chip 
                            class="content-chip ml-2" 
                            variant="elevated" 
                            color="surface" 
                            density="compact"
                        >
                                {{ product.amount }}
                            </v-chip>
                    </product-prop>
                    <div class="price-panel">
                        <product-prop class="mr-2" name="Price">
                            <span class="ml-1">
                                <span class="text-decoration-underline ml-1">
                                    {{ product.item.value + '$' }}
                                </span>
                            </span>
                        </product-prop>
                        <product-prop name="Total">
                            <span class="ml-1">
                                <span class="price-prop font-weight-bold ml-1">
                                    {{ product.item.value * product.amount + '$' }}
                                </span>
                            </span>
                        </product-prop>
                    </div>
                </div>
            </div>
        </v-sheet>
    </v-sheet>
</template>
<style>
.order-desc-item-img {
    height: 100px;
    max-width: 100px;
}
.order-desc-item-info {
    display: flex;
}
.order-desc-item-panel {
    width: calc(100% - 100px);
}
.content-chip {
    position: relative;
    bottom: 2px;
}
.price-panel {
    display: flex;
}
.price-prop {
    color: #B00020;
}
</style>
