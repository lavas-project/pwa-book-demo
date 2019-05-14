fetch('/data/article.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('title').innerHTML = data.title
    document.getElementById('content').innerHTML = data.content
  })

fetch('/data/statistic.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('count').innerHTML = data.count
  })
  .catch((e) => {
    document.getElementById('count').innerHTML = 0
  })
