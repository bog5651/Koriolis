import { onContentUpdated } from 'vitepress'
import { ref } from 'vue'

export function useSidebarToggle() {
  if (typeof window === 'undefined') {
    return
  }

  const isSidebarHidden = ref(false)
  const TRANSITION_DURATION = 300
  const STORAGE_KEY = 'vp-sidebar-hidden'
  const SIDEBAR_SELECTOR = '.VPSidebar'
  const TOGGLE_BUTTON_SELECTOR = '.vp-sidebar-toggle'
  const CONTENT_SELECTOR = '.VPContent'

  const VP_ELEMENTS = [
    CONTENT_SELECTOR,
    '.VPNavBar',
    '.VPNavBarTitle',
    '.VPLocalNav',
    '.VPDoc',
    '.VPFooter',
  ]

  function toggle() {
    document.documentElement.classList.add('vp-sidebar-transitioning')
    isSidebarHidden.value = !isSidebarHidden.value
    updateDOM()
    saveState()

    setTimeout(() => {
      document.documentElement.classList.remove('vp-sidebar-transitioning')
    }, TRANSITION_DURATION)
  }

  function updateDOM() {
    const rootElement = document.documentElement

    if (!rootElement.classList.contains('has-sidebar-toggle')) {
      rootElement.classList.add('has-sidebar-toggle')
    }

    rootElement.classList[isSidebarHidden.value ? 'add' : 'remove']('vp-sidebar-hidden')

    VP_ELEMENTS.forEach((selector) => {
      const element = document.querySelector(selector)
      if (!element)
        return

      if (isSidebarHidden.value && element.classList.contains('has-sidebar')) {
        element.classList.remove('has-sidebar')
      }
      else if (document.querySelector(SIDEBAR_SELECTOR)) {
        element.classList.add('has-sidebar')
      }
    })
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, isSidebarHidden.value ? '1' : '0')
  }

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY)
    isSidebarHidden.value = saved === '1'
    updateDOM()
  }

  function addToggleButton() {
    const button = document.createElement('button')
    button.className = 'vp-sidebar-toggle'
    button.setAttribute('aria-label', 'Toggle sidebar')
    button.setAttribute('title', 'Toggle sidebar')

    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
      </svg>
    `

    button.addEventListener('click', toggle)

    const content = document.querySelector(CONTENT_SELECTOR)
    if (content) {
      content.appendChild(button)
    }
  }

  function removeToggleButton() {
    const button = document.querySelector(TOGGLE_BUTTON_SELECTOR)
    if (button) {
      button.remove()
    }
  }

  onContentUpdated(() => {
    const vpContent = document.querySelector('.VPContent')

    if (vpContent) {
      loadState()

      const hasToggleButton = document.querySelector('.vp-sidebar-toggle')
      const hasSidebar = document.querySelector('.VPSidebar')

      if (!hasToggleButton && hasSidebar) {
        addToggleButton()
      }
      else if (!hasSidebar) {
        removeToggleButton()
      }

      const observer = new MutationObserver((mutations, obs) => {
        if (
          (isSidebarHidden.value && document.querySelector('.VPContent.has-sidebar'))
          || (!isSidebarHidden.value && !document.querySelector('.VPContent.has-sidebar'))
        ) {
          updateDOM()
          obs.disconnect()
        }
      })
      observer.observe(vpContent, {
        childList: true,
        subtree: true,
      })
    }
  })
}
