// Режим «День / Вечер» до загрузки приложения — чтобы вечером страница не мигала светлой.
// Та же логика, что в src/sun.ts и src/theme.ts: вечер — после заката в Москве (формулы NOAA).
;(function () {
  var mode = null
  try {
    mode = localStorage.getItem('navecher:theme')
  } catch (e) {}
  if (mode !== 'day' && mode !== 'night') {
    var d = new Date(Date.now() + 180 * 60000) // Москва, UTC+3
    var day = Math.floor((d - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5)
    var now = d.getUTCHours() * 60 + d.getUTCMinutes()
    var g = ((2 * Math.PI) / 365) * (day - 1)
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
    var decl =
      0.006918 -
      0.399912 * Math.cos(g) +
      0.070257 * Math.sin(g) -
      0.006758 * Math.cos(2 * g) +
      0.000907 * Math.sin(2 * g) -
      0.002697 * Math.cos(3 * g) +
      0.00148 * Math.sin(3 * g)
    var r = Math.PI / 180
    var lat = 55.7558 * r
    var ha =
      Math.acos(Math.min(1, Math.max(-1, Math.cos(90.833 * r) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl)))) / r
    var rise = 720 - 4 * (37.6173 + ha) - eq + 180
    var set = 720 - 4 * (37.6173 - ha) - eq + 180
    mode = now >= set || now < rise ? 'night' : 'day'
  }
  document.documentElement.dataset.theme = mode
  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', mode === 'night' ? '#0e0d0c' : '#f2efe9')

  // кадр первого экрана — сразу, не дожидаясь приложения (только на главной)
  if (location.pathname === '/') {
    var mobile = matchMedia('(max-width: 860px)').matches
    var l = document.createElement('link')
    l.rel = 'preload'
    l.as = 'image'
    l.href = mobile ? '/editorial/hero-m.jpg' : '/editorial/hero.jpg'
    l.setAttribute('fetchpriority', 'high')
    document.head.appendChild(l)
  }
})()
