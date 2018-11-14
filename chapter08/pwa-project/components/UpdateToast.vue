<template>
    <transition name="popup">
        <div class="update-toast" v-show="show">
            <span>{{ text }}</span>
            <span class="update-toast-close-btn" @click="handleRefresh">
                <i class="iconfont icon-refresh"></i>
            </span>
        </div>
    </transition>
</template>

<script>

export default {
    name: 'updateToast',
    props: {
        text: {
            type: String,
            default: '站点发生更新，请手动刷新'
        }
    },
    data() {
        return {
            show: false
        };
    },
    mounted() {
        window.addEventListener('sw.update', this.handleUpdate);
    },
    beforeDestroy() {
        window.removeEventListener('sw.update', this.handleUpdate);
    },
    methods: {
        handleUpdate(event) {
            this.show = true;
        },
        handleRefresh() {
            window.location.reload();
        }
    }
};
</script>

<style lang="stylus" scoped>
$height = 56px
$close-btn-height = 28px

.update-toast
    position fixed
    left 0
    right 0
    top 0
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    background-color #333
    color #ffffff
    font-size 16px
    height $height
    line-height $height
    padding 0 13px
    opacity 1
    transform translateY(0)
    z-index 1000

    &.popup-enter-active,
    &.popup-leave-active
        transition all .5s ease-in-out

    &.popup-enter,
    &.popup-leave-to
        opacity 0
        transform translateY(-($height))

    &-close-btn
        width $close-btn-height
        height $close-btn-height
        line-height $close-btn-height
        text-align center
        border-radius $close-btn-height
        background rgba(0, 0, 0, 0.2)
</style>
