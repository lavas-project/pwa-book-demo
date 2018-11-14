<template>
    <div class="detail-wrapper">
        <v-layout row wrap>
            <v-flex xs10 offset-xs1>
                <article class="detail-content text-xs-center">
                    <header class="detail-title text-xs-center">
                        Detail {{$route.params.id}}
                    </header>
                    <router-link :to="{
                        name: 'detailId',
                        params: {
                            id: Number($route.params.id) + 1
                        }
                    }">
                        Detail {{Number($route.params.id) + 1}}
                    </router-link>
                    <p>
                    Progressive Web Apps are user experiences that have the reach of the web, and are:
Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                    </p>
                    <p>
                    Progressive Web Apps are user experiences that have the reach of the web, and are:
Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                    </p>
                    <p>
                    Progressive Web Apps are user experiences that have the reach of the web, and are:
Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                    </p>
                    <p>
                    Progressive Web Apps are user experiences that have the reach of the web, and are:
Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                    </p>
                    <p>
                    Progressive Web Apps are user experiences that have the reach of the web, and are:
Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                    </p>
                </article>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
let state = {
    appHeaderState: {
        show: true,
        title: 'Lavas',
        showMenu: false,
        showBack: true,
        showLogo: false,
        actions: [
            {
                icon: 'home',
                route: {
                    name: 'index'
                }
            }
        ]
    }
};

function setState(store) {
    store.dispatch('appShell/appHeader/setAppHeader', state.appHeaderState);
}

export default {
    name: 'detailId',
    metaInfo() {
        return {
            title: `Detail ${this.$route.params.id}`,
            titleTemplate: '%s - Lavas',
            meta: [
                {name: 'keywords', content: 'lavas PWA'},
                {name: 'description', content: '基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题'}
            ]
        }
    },
    async asyncData({store, route}) {
        setState(store);
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 500);
        });
    },
    activated() {
        setState(this.$store);
    }
};
</script>

<style lang="stylus" scoped>

.detail-content
    font-size 16px
    line-height 30px
    margin-top 30px

    .detail-title
        margin-bottom 20px
        padding 10px 0
        font-size 36px
        font-weight bold

</style>
