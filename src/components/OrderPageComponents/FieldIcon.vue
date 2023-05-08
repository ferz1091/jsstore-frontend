<script>
export default {
    name: 'field-icon',
    props: {
        isVisible: {type: Boolean, required: true},
        name: {type: String, default: null}
    }
}
</script>
<template>
    <Transition :name="name ? name : 'order-page-field-icon'">
        <v-icon 
            v-if="isVisible" 
            class="field-icon"
            icon="mdi-check-circle-outline" 
            color="success" 
        />
    </Transition>
</template>
<style>
.field-icon {
    position: absolute;
    left: calc(100% + 50px);
    top: 50%;
    transform: translate(0, -50%);
}
.order-page-post-field-icon-enter-active {
    transition: all 0.5s ease;
    transition-delay: 1s !important;
}
.order-page-field-icon-enter-active {
    transition: all 0.5s ease;
    transition-delay: 0.2s !important;
}
.order-page-field-icon-leave-active,
.order-page-post-field-icon-leave-active {
    transition: all 0.1s ease;
}
.order-page-field-icon-enter-from,
.order-page-post-field-icon-enter-from {
    scale: 0;
}
.order-page-field-icon-leave-to,
.order-page-post-field-icon-leave-to {
    scale: 0;
    opacity: 0;
}
</style>
