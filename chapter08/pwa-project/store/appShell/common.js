/**
 * @file appShell/common module
 * @author lavas
 */

export const SET_PAGE_SWITCHING = 'SET_PAGE_SWITCHING';
export const SET_PAGE_SCROLL_POSITION = 'SET_PAGE_SCROLL_POSITION';

export const state = () => {
    return {
        /**
         * 多个页面是否处于切换中
         *
         * @type {boolean}
         */
        isPageSwitching: false,

        /**
         * 保存页面滚动位置，以 `route.fullPath` 为键
         * {'/': 0, '/detail/1': 100, '/detail/2': 200}
         *
         * @type {Object}
         */
        scrollPostionMap: {}
    };
};

export const mutations = {
    [SET_PAGE_SWITCHING](state, isPageSwitching) {
        state.isPageSwitching = isPageSwitching;
    },

    [SET_PAGE_SCROLL_POSITION](state, {pageId, scrollPosition}) {
        state.scrollPostionMap = {
            ...state.scrollPostionMap,
            [pageId]: scrollPosition
        };
    }
};

export const actions = {

    /**
     * 设置页面是否处于切换中
     *
     * @param {Function} commit commit
     * @param {boolean} isPageSwitching isPageSwitching
     */
    setPageSwitching({commit}, isPageSwitching) {
        commit(SET_PAGE_SWITCHING, isPageSwitching);
    },

    /**
     * 保存页面滚动位置
     *
     * @param {Function} commit commit
     * @param {Object} payload
     * @param {string} payload.pageId 页面 ID
     * @param {Object} payload.scrollPosition 滚动位置对象 {x:, y:}
     */
    savePageScrollPosition({commit}, {pageId, scrollPosition}) {
        commit(SET_PAGE_SCROLL_POSITION, {pageId, scrollPosition});
    }
};
