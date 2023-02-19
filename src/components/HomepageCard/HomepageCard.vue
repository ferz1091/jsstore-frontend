<script>
export default {
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
            :style="card.isChosen ? 'max-width: none' : 'max-width: calc(100vw / 3);'"
            >
            <div class="info-wrapper">
                <v-card 
                class="desc"
                variant="outlined"
                color="surface"
            >
                <v-card-title class="card-title text-h5">
                    {{ card.title }}
                </v-card-title>
                <v-divider 
                    class="card-divider" 
                    color="surface" 
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
                color="surface"
                label
                @click="() => this.$emit('cardClick', card.title)"
            >
                to view
                <Transition name="circle">
                    <v-progress-circular 
                        v-show="card.isChosen" 
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
        left: calc((100vw / 3) * v-bind(index));
        width: calc(100vw / 3);
    }
    25% {
        left: 0;
        width: calc(100vw / 3);
    }
    100% {
        left: 0;
        width: 99vw;
    }
}
.card {
    position: relative;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
}
.chosen_card {
    position: absolute;
    top: 0;
    z-index: 2;
    left: 0;
    height: 100vh;
    animation: cardHasChosen 3s ease;
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
