<script>
export default {
    name: 'button-ui',
    props: {
        set: {type: Array, default: []}
    },
    computed: {
        variant() {
            switch(this.set[0]) {
                case 't': return 'text';
                case 'f': return 'flat';
                case 'o': return 'outlined';
                default: return 'elevated';
            }
        },
        color() {
            if (this.set[1].length > 2) {
                return this.set[1];
            }
            switch(this.set[1]) {
                case 'b': return 'background';
                case 's': return 'surface';
                case 'sc': return 'success';
                case 'e': return 'error';
                case 'w': return 'warning';
                case 'i': return 'info';
                case 'tr': return 'transparent'
            }
        },
        density() {
            switch(this.set[2]) {
                case '1': return 'comfortable';
                case '2': return 'compact';
                default: return 'default'
            }
        },
        icon() {
            return this.set[3] ? this.set[3] : false;
        },
        size() {
            switch(this.set[4]) {
                case 'xs': return 'x-small';
                case 's': return 'small';
                case 'l': return 'large';
                case 'xl': return 'x-large';
                default: return 'default'
            }
        }
    }
}
</script>
<template>
    <v-btn 
        :variant="variant"
        :color="color" 
        :density="density"
        :icon="icon"
        :size="size"
    >
        <v-icon v-if="icon" :icon="icon"></v-icon>
        <span v-else>
            {{ this.set[5] }}
        </span>
    </v-btn>
</template>
<style>

</style>
