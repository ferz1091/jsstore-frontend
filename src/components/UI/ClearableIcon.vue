<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCloseCircle } from '@mdi/js';
    export default {
        name: 'clearable-icon',
        data() {
            return {
                path: mdiCloseCircle
            }
        },
        props: {
            isVisible: {
                type: Boolean,
                required: true
            }
        },
        components: { 
            SvgIcon 
        }
    }
</script>

<template>
    <Transition name="clearableIcon" appear>
        <svg-icon v-if="isVisible" class="clearableIcon" type="mdi" :path="path"></svg-icon>
    </Transition>
</template>

<style>
    .clearableIcon {
        cursor: pointer;
        position: absolute;
        top: 18px;
        right: 10px;
        color: rgb(200, 200, 200);
        transition: all 0.3s ease;
    }
    .clearableIcon:hover {
        color: rgb(120, 120, 120);
    }
    .clearableIcon:active {
        scale: 0.9;
    }
    .clearableIcon-enter-active,
    .clearableIcon-leave-active {
        transition: all 1s ease;
    }

    .clearableIcon-enter-from, .clearableIcon-leave-to {
        scale: 0;
    }
</style>
