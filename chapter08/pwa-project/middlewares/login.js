export default async function ({store, redirect, route}) {

    // 如果是前端，可以直接查看 store 中登录状态，前端跳转不会重置 store 中的值
    let isLogin = store.state.common.login || false;
    if (!isLogin && route.path !== '/login') {

        console.log('用户未登录，请先登录')

        return redirect({
            path: '/login'
        });
    }
}
