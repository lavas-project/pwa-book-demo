<template>
    <div class="sidebar-wrapper"
        ref="sidebarWrapper"
        :class="wrapperClass"
    >
        <div class="sidebar-scroller"
            ref="sidebarScroller"
            :style="{
                'padding-left': widthProp
            }"
        >
            <div class="sidebar-main"
                :style="{
                    width: widthProp
                }"
                @scroll.stop
            >
                <slot></slot>
            </div>
            <div class="touch-toggle"
                :style="{
                    'opacity': opacity,
                    'padding-left': widthProp
                }"
                ref="sidebarToggle"
                @click.stop.prevent="toggleClick"
            ></div>
        </div>
    </div>
</template>

<script>
import IScroll from 'iscroll/build/iscroll-lite';

let rAF = function (cb) {
    setTimeout(cb, 1000 / 60);
};
// 兼容服务器端渲染的情况
if (process.env.VUE_ENV === 'client') {
    rAF = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || rAF;
}

const DEFAULT_PROP = 'default';

export default {
    props: {
        value: {
            'type': Boolean,
            'default': false
        },
        enable: {
            'type': Boolean,
            'default': true
        },
        width: {
            'type': Number,
            'default': 0.75
        },
        duration: {
            'type': Number,
            'default': 200
        },
        region: {
            'type': Object,
            [DEFAULT_PROP]() {
                return {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 40
                };
            }
        }
    },
    data() {
        return {
            clientWidth: 320,
            clientHeight: 568,
            startX: 0,
            startY: 0,
            scrollEnable: false,
            wrapperClass: {
                'expand': false,
                'collapse': true,
                'w-left': true
            },
            opacity: 0,
            iscroll: null
        };
    },
    computed: {
        itsWidth() {
            return this.width < 1
                ? Math.round(this.width * this.clientWidth)
                : this.width;
        },
        widthProp() {
            return this.itsWidth + 'px';
        },
        status: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        zone() {
            let {top, right, bottom, left, width, height} = this.region;
            let clientWidth = this.clientWidth;
            let clientHeight = this.clientHeight;

            return {
                top: top === undefined
                    ? (clientHeight - bottom - height)
                    : top,
                left: left === undefined
                    ? (clientWidth - right - width)
                    : left,
                width: width === undefined
                    ? (clientWidth - left - right)
                    : width,
                height: height === undefined
                    ? (clientHeight - top - left)
                    : height
            };
        }
    },
    watch: {
        status(val) {
            if (val) {
                this.expand();
            }
            else {
                this.collapse();
            }
        }
    },
    mounted() {
        this.clientWidth = clientWidth();
        this.clientHeight = clientHeight();
        document.body.addEventListener('touchstart', this.touchStart.bind(this));
        document.body.addEventListener('touchmove', this.touchMove.bind(this));
    },
    methods: {

        /**
         * 用于记录 touch 初始位置
         *
         * @param {Event} e 原生事件对象
         */
        touchStart(e) {
            if (this.wrapperClass.expand) {
                return;
            }

            if (!this.enable) {
                return;
            }

            let {clientX, clientY} = e.touches[0];
            let {left, top, width, height} = this.zone;

            if (clientX < left
                || clientX > left + width
                || clientY < top
                || clientY > top + height
            ) {
                return;
            }

            this.scrollEnable = true;
            this.startX = clientX;
            this.startY = clientY;
        },

        /**
         * 用于判断当前滑动距离和方向是否满足触发 sidebar 侧滑
         *
         * @param {Event} e 原生事件对象
         */
        touchMove(e) {
            if (!this.scrollEnable) {
                return;
            }

            let {clientX, clientY} = e.touches[0];
            let x = clientX - this.startX;

            // 只有当滑动距离大于 5 像素
            // 同时滑动角度小于 30° 时，触发 sidebar 侧滑
            if (x > 5 && Math.abs(clientY - this.startY) / x < 0.577) {
                this.wrapperClass.expand = true;
                this.wrapperClass.collapse = false;

                this.$nextTick(() => {
                    this.bindScroll(e);
                });
            }
        },

        /**
         * 点击 sidebar 阴影部分收起 sidebar
         *
         * @param {Event} e 原生点击事件
         */
        toggleClick(e) {
            this.status = false;
        },

        /**
         * 绑定 iscroll
         *
         * @param {Event} e 原生 touchmove 事件对象
         */
        bindScroll(e) {
            if (this.iscroll) {
                return;
            }

            // 初始化 iscroll
            this.iscroll = new IScroll(
                this.$refs.sidebarWrapper,
                {
                    eventPassthrough: true,
                    scrollY: false,
                    scrollX: true,
                    bounce: false,
                    startX: -this.itsWidth
                }
            );

            this.iscroll.on('scrollEnd', () => {
                let {directionX, x} = this.iscroll;
                // 完全展开的时候 showStatus 状态变为 true
                if (x === 0) {
                    this.status = true;
                }
                // 完全收起的时候 showStatus 状态变为 false 同时解绑 iscroll
                else if (x === -this.itsWidth) {
                    this.status = false;
                }
                // 滑到一半的情况 就根据其不同的滑动状态去补完剩余操作
                else if (directionX > 0) {
                    this.status = false;
                }
                else if (directionX < 0) {
                    this.status = true;
                }
                else {
                    this.status = !this.status;
                }
            });

            // 触发蒙层的透明度计算
            this.changeOpacity();
            // 将原生事件对象透传给 iscroll 使其在初始化完成后立马实现滚动
            e && this.iscroll._start(e);
        },

        /**
         * 展开侧边栏
         */
        expand() {
            this.wrapperClass.expand = true;
            this.wrapperClass.collapse = false;
            // 得等到 wrapper 的 class 改变生效，才能去做下一步的绑定操作
            // 故而用 nextTick
            this.$nextTick(() => {
                if (!this.iscroll) {
                    this.bindScroll();
                }

                if (this.iscroll.x < 0) {
                    // 部分机型在 iscroll 初始化完成后立即执行 scrollTo 会有问题
                    // 用 nextTick 无效
                    setTimeout(() => {
                        this.iscroll && this.iscroll.scrollTo(0, 0, this.duration);
                    }, 10);
                }
            });
        },

        /**
         * 收起侧边栏
         */
        collapse() {
            if (!this.iscroll) {
                return;
            }
            if (this.iscroll.x === -this.itsWidth) {
                this.unbindScroll();
            }
            else {
                // 解决部分机型在调用 scrollTo 完成的时候 不会触发 scrollEnd 事件的 bug
                setTimeout(() => {
                    this.iscroll.scrollTo(-this.itsWidth, 0, this.duration);
                });
                // 滚动结束后解绑 iscroll
                setTimeout(() => {
                    this.unbindScroll();
                }, this.duration + 10);
            }
        },

        /**
         * 解绑并销毁 iscroll
         */
        unbindScroll() {
            if (!this.iscroll) {
                return;
            }
            // 销毁 iscroll
            this.iscroll.destroy();
            this.iscroll = null;
            // 清除各项数值
            this.wrapperClass.expand = false;
            this.wrapperClass.collapse = true;
            this.scrollEnable = false;
            this.opacity = 0;
            // 去掉 iscroll 遗留下的 style
            this.$refs.sidebarScroller.setAttribute(
                'style',
                `padding-left:${this.widthProp}`
            );
        },

        /**
         * 触发 mask 的透明度改变
         */
        changeOpacity() {
            if (this.wrapperClass.expand && this.iscroll) {
                this.opacity = (this.iscroll.x + this.itsWidth) / this.itsWidth * 0.5;
                rAF(this.changeOpacity.bind(this));
            }
        }
    }
};

function clientWidth() {
    return document.documentElement.clientWidth;
}

function clientHeight() {
    return document.documentElement.clientHeight;
}

</script>

<style lang="stylus" scoped>
.sidebar-wrapper
    z-index 9999

    .sidebar-main
        overflow-y auto
        overflow-x hidden
        box-sizing border-box
        z-index 25
        display none
        background #fff
        height 0
        top 0

    .touch-toggle
        position fixed
        top 0
        bottom 0
        left 0
        width 0
        // width 45px
        z-index 100
        opacity 0
        transition opacity .3s

    &.collapse
        margin-top 0 !important
        .sidebar-scroller
            padding-left 0 !important
        .touch-toggle
            padding-left 0 !important
            top 64px

    &.expand
        position fixed
        top 0
        right 0
        bottom 0
        left 0
        z-index 150
        overflow hidden
        box-shadow 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px rgba(0, 0, 0, .14), 0 1px 10px rgba(0, 0, 0, .12)

        .sidebar-scroller
            width 100%
            height 100%
            white-space nowrap
            position relative
            box-sizing content-box

        .sidebar-main
            display block
            height 100%
            position absolute
            top 0
            right auto
            bottom 0
            left 0
            overflow auto

        .touch-toggle
            position static
            width 100%
            height 100%
            background #212121
            opacity .5

</style>
