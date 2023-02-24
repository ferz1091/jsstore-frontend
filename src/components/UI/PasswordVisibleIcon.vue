<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiEye } from '@mdi/js';
export default {
    name: 'password-icon',
    data() {
        return {
            path: mdiEye
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
        SvgIcon
    },
    computed: {
        iconColor() {
            if (this.isPasswordVisible) {
                return "color: rgb(200, 200, 200);"
            } else {
                return "color: rgb(120, 120, 120);"
            }
        }
    }
}
</script>

<template>
    <Transition name="passwordIcon" appear>
        <svg-icon v-if="isVisible" :style="iconColor" class="passwordIcon" type="mdi" :path="path"></svg-icon>
    </Transition>
</template>

<style>
    .passwordIcon {
        cursor: pointer;
        position: absolute;
        top: 18px;
        right: 10px;
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
