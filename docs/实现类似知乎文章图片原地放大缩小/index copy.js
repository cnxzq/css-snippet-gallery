let zoomEl = null
let isOpen = false
const body = document.body
const div = document.createElement('div')
const img = document.createElement('img')
div.appendChild(img)

function closeImg() {
  div.className = 'zoom-wrap close'
  img.style.transform = 'scale(1) translateX(0) translateY(0)'
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

div.addEventListener('click', () => {
  closeImg()
})
window.addEventListener('scroll', (e) => {
  if (zoomEl) {
    const { left, top, width, height } = zoomEl.getBoundingClientRect()
    img.style.cssText = `
      left: ${left}px;
      top: ${top}px;
      width: ${width}px;
      height: ${height}px;
    `
    if (isOpen) {
      closeImg()
    }
  }
})
window.addEventListener('resize', () => {
  const actEl = zoomEl.getBoundingClientRect()
  const { left, top, width, height } = actEl
  const {scale, translateX, translateY} = getTransform(actEl)
  img.style.cssText = `
    left: ${left}px;
    top: ${top}px;
    width: ${width}px;
    height: ${height}px;
    transform: scale(${scale}) translateX(${translateX}px) translateY(${translateY}px);
  `
})

function zoomImg(wrap) {
  wrap.addEventListener('click', (e) => {
    const el = e.target
    zoomEl = el
    isOpen = true
    if (el.tagName === 'IMG') {
      const actEl = el.getBoundingClientRect()
      const { left, top, width, height } = actEl
      img.style.cssText = `left: ${left}px;top: ${top}px;width: ${width}px;height: ${height}px;`
      img.src = el.src
      div.className = 'zoom-wrap'
      body.appendChild(div)
      /**
       * 用Promise时，打开的动画就不行，但setTimeout可以，
       * 如果把getBoundingClientRect放到Promise里面打开动画就可以了，奇怪了，
       */
      setTimeout(() => {
        const {scale, translateX, translateY} =  getTransform(actEl)
        img.style.transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`
      }, 0);
      // Promise.resolve().then(() => {
      //   const transform =  getTransform(actEl)
      //   img.style.transform = transform
      // })
    }
    
  })
}
