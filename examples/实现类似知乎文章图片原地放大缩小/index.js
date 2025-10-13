const zoomImg = (function () {
  let zoomEl = null
  let isOpen = false
  const body = document.body
  const div = document.createElement('div')
  const img = document.createElement('img')
  div.appendChild(img)

  function closeImg() {
    div.className = 'zoom-wrap close'
    isOpen = false
    setTimeout(() => {
      document.body.removeChild(div)
      zoomEl = null
    }, 500);
  }

  function getTransform({left, top, width, height}) {
    let scale = 1
    // 计算放大多少
    if (innerWidth / width > innerHeight / height) {
      scale = innerHeight / height
    } else {
      scale = innerWidth / width
    }
    
    // 计算中心点偏移量
    const translateX = ((innerWidth / 2) - (left + width / 2)) / scale
    const translateY = ((innerHeight / 2) - (top + height / 2)) / scale
    return { scale, translateX, translateY }
  }

  function setOpenImgStyle(rectEl, hasTransform) {
    const actEl = rectEl.getBoundingClientRect()
    const { left, top, width, height } = actEl
    let transform = 'scale(1) translateX(0) translateY(0)'
    if (hasTransform) {
      const { scale, translateX, translateY } = getTransform(actEl)
      transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`
    }
    img.style.cssText = `
      left: ${left}px;
      top: ${top}px;
      width: ${width}px;
      height: ${height}px;
      transform: ${transform};
    `
  }

  function changeOpenImg(hasClose) {
    if (zoomEl) {
      setOpenImgStyle(zoomEl)
      if (isOpen && hasClose) {
        closeImg()
      }
    }
  }

  div.addEventListener('click', changeOpenImg.bind(null, true))
  // 一下两个时间需要坐节流处理，因为现在都用的现成库，就暂时不实现了
  window.addEventListener('scroll', changeOpenImg.bind(null, true))
  window.addEventListener('resize', changeOpenImg)

  function zoomImg(wrap) {
    wrap.addEventListener('click', (e) => {
      const el = e.target
      zoomEl = el
      isOpen = true
      if (el.tagName === 'IMG') {
        setOpenImgStyle(zoomEl)
        img.src = el.src
        div.className = 'zoom-wrap'
        body.appendChild(div)
        Promise.resolve().then(() => {
          setOpenImgStyle(zoomEl, true)
        })
      }
      
    })
  }
  return zoomImg
})()