<script>
export default {
    name: 'password-icon',
    data() {
        return {
        }
    },
    props: {
        isVisible: {
            type: Boolean,
            required: true
        },
        isPasswordVisible: {
            type: Boolean,
            required: true
        }
    },
    components: {
    },
    computed: {
        iconColor() {
            if (this.isPasswordVisible) {
                return "color: rgb(120, 120, 120);"
            } else {
                return "color: rgb(200, 200, 200);"
            }
        }
    }
}
</script>

<template>
    <Transition name="passwordIcon" appear>
        <v-icon v-if="isVisible" :style="iconColor" class="passwordIcon" icon="mdi-eye" />
        <!-- <svg-icon v-if="isVisible" :style="iconColor" class="passwordIcon" type="mdi" :path="path"></svg-icon> -->
    </Transition>
</template>

<style>
    .passwordIcon {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 17px;
        transition: all 0.3s ease;
    }

    .passwordIcon:hover {
        color: rgb(120, 120, 120) !important;
    }

    .passwordIcon:active {
        scale: 0.9;
    }

    .passwordIcon-enter-active,
    .passwordIcon-leave-active {
        transition: all 1s ease;
    }

    .passwordIcon-enter-from,
    .passwordIcon-leave-to {
        scale: 0;
    }
</style>
