<script>
export default {
    name: 'pagination',
    props: {
        class: {type: String},
        length: {type: Number, required: true}
    },
    data() {
        return {
            windowWidth: 0
        }
    },
    methods: {
        handleWindowSize() {
            this.windowWidth = window.innerWidth;
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowSize);
        this.handleWindowSize();
    },
    beforeUnmount() {
        window.addEventListener('resize', this.handleWindowSize);
    },
    computed: {
        totalVisible() {
            return this.windowWidth > 450 ? 5 : 3;
        }
    }
}
</script>
<template>
    <v-pagination
        :class="class"
        :length="length"
        :total-visible="totalVisible"
        density="comfortable"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        active-color="black"
        variant="flat"
        color="background"
    ></v-pagination>
</template>
<style>

</style>
