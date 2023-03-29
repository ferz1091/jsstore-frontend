<script>
export default {
    name: 'product-prop',
    props: {
        name: {
            type: String,
            required: true
        }
    }
}
</script>
<template>
    <div class="py-2">
        <span class="text-body-2 font-weight-bold">{{ name }}:</span>
        <slot></slot>
    </div>
</template>
<style>

</style>
