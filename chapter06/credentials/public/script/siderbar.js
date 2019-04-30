let app = {
  sidebarShow: false,
  loadingShow: true
}

// sidebar btn
document.querySelector('.sidebar').addEventListener('click', function () {
  app.closeSidebar()
})

document.querySelector('.icon-category').addEventListener('click', function () {
  app.openSidebar()
})

document.querySelector('.mask').addEventListener('click', function () {
  app.closeSidebar()
})

document.querySelector('.icon-refresh').addEventListener('click', function () {
  app.refresh()
})

app.openSidebar = function () {
  if (app.sidebarShow) return
  document.querySelector('.mask').classList.remove('hide')
  document.querySelector('.sidebar').classList.remove('hide')
  app.sidebarShow = true
}

app.closeSidebar = function () {
  if (!app.sidebarShow) return
  document.querySelector('.mask').classList.add('hide')
  document.querySelector('.sidebar').classList.add('hide')
  app.sidebarShow = false
}
