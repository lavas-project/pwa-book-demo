<template>
    <div>
        <h1>Login Page</h1>
        <div><router-link to="/">LAVAS 首页</router-link></div>
        <button @click="login()">点击登录</button>
        <div class="tips" ref="tips"></div>
    </div>
</template>

<script>

export default {
    name: 'login',
    // middleware: ['login'],
    methods: {
        async login() {

            // 如果未登录，设置登录成功
            if (!this.$store.state.common.login) {

                // 修改 store 中的登录状态为 true
                await this.$store.dispatch('common/setLogin', true);
                this.$refs.tips.innerHTML = 'tips：登录成功';
            }
            // 如果登录显示已登录
            else {
                this.$refs.tips.innerHTML = 'tips：已登录';
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
h2
    margin-top 70%
    font-size 46px
    font-weight 500
    cursor pointer
button
    width 100px
    height 45px
    border solid 1px #ccc
    background #eee
    cursor pointer
.tips
    margin-top 10px
    color #666
    font-size 12px
</style>
