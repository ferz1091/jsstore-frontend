<script>
export default {
    data() {
        return {
            circleOn: false
        }
    },
    props: {
        card: {
            type: Object,
            required: true,
            default(rawProps) {
                return { link: '', description: '', title: '', isShow: false, isChosen: false}
            }
        },
        index: {
            type: Number,
            required: true
        },
        test: {
            type: Object,
            default(rawProps) {
                return {test: true}
            }
        }
    },
    methods: {
        chipClick() {
            this.$emit('cardClick', this.card.title);
            this.circleOn = true;
        }
    },
    watch: {
        card: {
            deep: true,
            handler: function (newValue) {
                if (newValue.isChosen && !newValue.isShow) {
                    setTimeout(() => {
                        this.$emit('redirect');
                    }, 2000)
                }
            }
        }
    }
}
</script>

<template>
    <Transition name="card" appear>
        <section 
            class="card" 
            v-show="card.isShow" 
            :class="{ card: !card.isChosen, chosen_card: card.isChosen }"
            :style="card.isChosen ? 'max-width: none' : 'max-width: calc(100% / 3);'"
            >
            <div class="info-wrapper">
                <v-card 
                class="desc"
                variant="outlined"
                color="background"
            >
                <v-card-title class="card-title text-h5">
                    {{ card.title }}
                </v-card-title>
                <v-divider 
                    class="card-divider" 
                    color="background" 
                    thickness="2"
                    inset 
                ></v-divider>
                <v-card-text class="card-text text-h3">
                    {{ card.description }}
                </v-card-text>
            </v-card>
            <v-chip 
                class="chip font-weight-bold"
                size="large" 
                draggable
                variant="tonal" 
                color="background"
                label
                @click="chipClick"
            >
                to view
                <Transition name="circle">
                    <v-progress-circular 
                        v-show="circleOn" 
                        class="chip-circle ml-3" 
                        :width="3" 
                        :size="25" 
                        indeterminate
                    />
                </Transition>
            </v-chip>
            </div>
            <v-img :src="card.link" cover />
        </section>
    </Transition>
</template>

<style>
    @keyframes cardHasChosen {
        0% {
            left: calc((100% / 3) * v-bind(index));
            width: calc(100% / 3);
        }
        50% {
            left: 0;
            width: calc(100% / 3);
        }
        100% {
            left: 0;
            width: 100vw;
        }
    }
    @keyframes chipIn {
        0% {
            transform: translateY(100px);
        }
        50% {
            transform: translateY(80px);
        }
        100% {
            transform: translateY(0px);
        }
    }
    .card {
        position: relative;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        background-color: black !important;
    }
    .chosen_card {
        position: absolute;
        top: 0;
        z-index: 2;
        left: 0;
        height: 100vh;
        animation: cardHasChosen 2.5s ease-in;
    }
    .card:hover img{
        scale: 1.15;
        filter: blur(0px);
    }
    .chosen_card:hover img {
        scale: 1;
    }
    .info-wrapper {
        position: absolute;
        left: 50%;
        bottom: 5%;
        transform: translateX(-50%);
        z-index: 1;
        display: flex;
        flex-direction: column;
        max-width: 235px !important;
    }
    .desc {
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
        text-shadow: 0px 0px 5px black;
    }
    .card-divider {
        opacity: 0.5 !important;
    }
    .card-text {
        line-height: 45px !important;
    }
    .chip {
        align-self: center;
        margin-top: 30vh !important;
        cursor: pointer !important;
        font-size: calc(12px + 8 * (100vw /1400)) !important;
        text-shadow: 1px 1px 2px black;
        padding: calc(0px + 5 * (100vw / 1400)) calc(14px + 6 * (100vw / 1400)) !important;
        transition: all 0.3s ease;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);
        animation: chipIn 3s ease ;
    }
    .chip:hover {
        background: rgba(256, 256, 256, 0.15) !important;
    }
    .chip:active {
        scale: 0.9;
        background-color: white !important;
        color: rgb(200, 200, 200) !important;
    }
    .card img {
        filter: blur(2px);
    }
    .chosen_card img {
        filter: blur(0px);
    }
    img {
        max-width: 100%;
        object-fit: cover;
        transition: scale 0.5s ease;
    }
    .card-enter-active,
    .card-leave-active {
        transition: all 2s ease;
    }

    .card-enter-from {
        opacity: 0;
        transform: translateX(-70px);
    }
    .card-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }
    .circle-enter-active,
    .circle-leave-active {
        transition: all 1s ease;
    }

    .circle-enter-from {
        opacity: 0;
        transform: translateX(-70px);
    }
    .circle-leave-to {
        opacity: 0;
    }
</style>
