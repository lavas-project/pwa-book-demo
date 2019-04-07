<template>
  <div class="bottom-navigation">
    <button class="current">首页</button>
    <button>搜索</button>
    <button>分类</button>
    <button>我的</button>
  </div>
</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  box-shadow: 0 3px 14px 2px rgba(0, 0, 0, .12);
  display: flex;
}

button {
  flex: 1;
  font-size: 14px;
  color: #aaa;
}

button.current {
  color: #328ce6;
  font-size: 15px;
}
</style>
