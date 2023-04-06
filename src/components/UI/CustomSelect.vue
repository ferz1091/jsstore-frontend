<script>
export default {
    name: 'custom-select',
    props: {
        items: {type: Array, default: []},
        currentSize: {type: String, default: null}
    },
    data() {
        return {
            size: this.currentSize
        }
    },
    watch: {
        size() {
            this.$emit('sizeChanged', this.size);
        }
    }
}
</script>
<template>
    <select class="text-body-2" name="size" v-model="size">
        <option
            v-for="item in items"
            :value="item"
            class="sizeSelectOption text-body-2"
        >
            {{ item }}
        </option>
    </select>
</template>
<style>
.sizeSelectOption {
    color: white;
    background: black;
}
</style>
