/**
 * @file common module
 * @author lavas
 */

const SET_LOGIN = 'setLogin';

export const state = () => {
    return {
        login: false
    };
};

export const mutations = {
    [SET_LOGIN](state, login) {
        state.login = login;
    }
};

export const actions = {
    setLogin({commit}, login) {
        commit(SET_LOGIN, login);
    },
    async validLogin({commit}) {

        // 可以给服务端发请求，验证用户的登录状态，此处模拟未登录
        let login = await new Promise( resolve => {
            setTimeout(() => {
                resolve(false);
            }, 1000);
        });

        // 并设置 store 中的登录状态
        commit(SET_LOGIN, login);
    }
};
