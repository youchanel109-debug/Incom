/* Animated leaf generation and motion for the login page */
const behindLayer = document.querySelector('.leaf-layer.behind')
const frontLayer = document.querySelector('.leaf-layer.front')
const particleLayer = document.querySelector('.particle-layer')
const body = document.body
const leafCount = 44
const particleCount = 24

// Utility: random number between min and max
const randRange = (min, max) => Math.random() * (max - min) + min

// Create a leaf with randomized fall parameters
const createLeaf = (layer, index) => {
  const leaf = document.createElement('div')
  leaf.className = 'leaf'

  const size = randRange(0.9, 1.9)
  const duration = randRange(10, 18)
  const delay = randRange(-10, 0)
  const swayDistance = randRange(18, 48)
  const rotation = randRange(280, 520)
  const hue = randRange(18, 32)

  leaf.style.width = `${size * 1.9}rem`
  leaf.style.height = `${size * 1.6}rem`
  leaf.style.opacity = randRange(0.45, 0.92)
  leaf.style.left = `${randRange(-14, 112)}%`
  leaf.style.top = `${randRange(-140, -15)}%`
  leaf.style.transform = `rotate(${randRange(-40, 40)}deg) scale(${randRange(0.85, 1.3)})`
  leaf.style.setProperty('--leaf-duration', `${duration}s`)
  leaf.style.setProperty('--leaf-delay', `${delay}s`)
  leaf.style.setProperty('--leaf-sway', `${swayDistance}px`)
  leaf.style.setProperty('--leaf-rotate', `${rotation}deg`)
  leaf.style.setProperty('--leaf-scale', `${size}`)
  leaf.style.setProperty('--leaf-hue', hue)

  const colorA = `hsla(${hue}, 91%, 66%, 0.96)`
  const colorB = `hsla(${hue + 18}, 90%, 51%, 0.92)`
  const colorC = `hsla(${hue + 6}, 96%, 42%, 0.9)`
  leaf.style.background = `radial-gradient(circle at 32% 28%, ${colorA}, transparent 42%), radial-gradient(circle at 70% 45%, ${colorB}, transparent 45%), radial-gradient(circle at 50% 82%, ${colorC}, transparent 40%)`

  layer.appendChild(leaf)
  return leaf
}

// Create small floating particles for atmosphere
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div')
  particle.className = 'particle'
  const size = randRange(3, 7)
  particle.style.width = `${size}px`
  particle.style.height = `${size}px`
  particle.style.left = `${randRange(8, 92)}%`
  particle.style.top = `${randRange(8, 72)}%`
  particle.style.opacity = randRange(0.18, 0.52)
  particle.style.animationDuration = `${randRange(8.5, 12.5)}s`
  particle.style.animationDelay = `${randRange(-6, 0)}s`
  particle.style.transform = `scale(${randRange(0.75, 1.15)})`
  particleLayer.appendChild(particle)
}

const leaves = []
for (let i = 0; i < leafCount; i++) {
  const layer = i % 2 === 0 ? behindLayer : frontLayer
  leaves.push(createLeaf(layer, i))
}

// Animate leaves using requestAnimationFrame for smoother motion
const animateLeaves = (time) => {
  leaves.forEach((leaf, index) => {
    const duration = parseFloat(getComputedStyle(leaf).getPropertyValue('--leaf-duration'))
    const delay = parseFloat(getComputedStyle(leaf).getPropertyValue('--leaf-delay'))
    const sway = parseFloat(getComputedStyle(leaf).getPropertyValue('--leaf-sway'))
    const leafRotation = parseFloat(getComputedStyle(leaf).getPropertyValue('--leaf-rotate'))
    const leafScale = parseFloat(getComputedStyle(leaf).getPropertyValue('--leaf-scale'))

    const elapsed = ((time / 1000) + Math.abs(delay)) % duration
    const progress = elapsed / duration

    const centerX = parseFloat(leaf.style.left)
    const drift = Math.sin(progress * Math.PI * 2 + index) * sway
    const vertical = progress * 135
    const rotation = progress * leafRotation + Math.cos(progress * Math.PI * 3 + index) * 14

    leaf.style.transform = `translate3d(calc(${centerX}% + ${drift}px), ${vertical}vh, 0) rotate(${rotation}deg) scale(${leafScale})`
    leaf.style.opacity = `${0.35 + Math.sin(progress * Math.PI) * 0.45}`

    if (progress > 0.98) {
      leaf.style.left = `${randRange(-14, 112)}%`
      leaf.style.top = `${randRange(-140, -15)}%`
      leaf.style.setProperty('--leaf-duration', `${randRange(10, 18)}s`)
      leaf.style.setProperty('--leaf-delay', `${randRange(-10, 0)}s`)
      leaf.style.setProperty('--leaf-sway', `${randRange(18, 48)}px`)
      leaf.style.setProperty('--leaf-rotate', `${randRange(280, 520)}deg`)
      leaf.style.setProperty('--leaf-scale', `${randRange(0.95, 1.35)}`)
    }
  })

  requestAnimationFrame(animateLeaves)
}

const getAppRootPath = () => {
  const current = window.location.pathname
  return current.replace(/\/login(\/index\.html)?$/, '/') || '/'
}

const redirectToApp = () => {
  window.location.href = getAppRootPath()
}

const init = () => {
  if (document.cookie.split(';').some(cookie => cookie.trim().startsWith('demoLoggedIn=true'))) {
    redirectToApp()
    return
  }

  body.classList.add('loaded')
  requestAnimationFrame(animateLeaves)
  wireLoginForm()
}

const showFormMessage = (container, message, type = 'error') => {
  let messageEl = container.querySelector('.form-message')
  if (!messageEl) {
    messageEl = document.createElement('div')
    messageEl.className = 'form-message'
    messageEl.style.marginTop = '1rem'
    messageEl.style.padding = '0.9rem 1rem'
    messageEl.style.borderRadius = '1rem'
    messageEl.style.fontSize = '0.95rem'
    messageEl.style.lineHeight = '1.4'
    container.appendChild(messageEl)
  }
  messageEl.textContent = message
  messageEl.style.background = type === 'error' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)'
  messageEl.style.color = type === 'error' ? '#b91c1c' : '#065f46'
  messageEl.style.border = type === 'error' ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
}

const wireLoginForm = () => {
  const loginForm = document.querySelector('.login-form')
  if (!loginForm) return

  loginForm.addEventListener('submit', event => {
    event.preventDefault()
    const username = loginForm.querySelector('input[type="text"]').value.trim()
    const password = loginForm.querySelector('input[type="password"]').value.trim()

    if (!username || !password) {
      showFormMessage(loginForm, 'Please enter both username and password.')
      return
    }

    if (username === 'seanghai168@gmail.com' && password === '769853') {
      showFormMessage(loginForm, 'Login successful! This demo page is now authenticated.', 'success')
      document.cookie = 'demoLoggedIn=true; path=/; samesite=lax'
      return
    }

    showFormMessage(loginForm, 'Invalid credentials. Use seanghai168@gmail.com / 769853.', 'error')
  })
}

window.addEventListener('load', init)
