// Import GSAP and plugins
// GSAP is loaded via CDN in HTML, so we use the global objects
window.gsap = window.gsap || {}
window.ScrollTrigger = window.ScrollTrigger || {}
window.TextPlugin = window.TextPlugin || {}

const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger
const TextPlugin = window.TextPlugin

gsap.registerPlugin(ScrollTrigger, TextPlugin)

// Global variables
let customCursor, magneticElements, waterEffect
const scrollProgress = 0
let isLoading = true

// Utility Functions
const lerp = (start, end, factor) => start + (end - start) * factor
const map = (value, start1, stop1, start2, stop2) => start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))

class MobileNavigation {
  constructor() {
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn")
    this.navLinks = document.getElementById("nav-links")
    this.navLinksItems = document.querySelectorAll(".nav-link")
    this.isOpen = false

    this.init()
  }

  init() {
    if (!this.mobileMenuBtn || !this.navLinks) return

    this.mobileMenuBtn.addEventListener("click", () => {
      this.toggleMenu()
    })

    // Close menu when clicking on nav links
    this.navLinksItems.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu()
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.navLinks.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
        this.closeMenu()
      }
    })

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu()
      }
    })
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  openMenu() {
    this.isOpen = true
    this.mobileMenuBtn.classList.add("active")
    this.navLinks.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  closeMenu() {
    this.isOpen = false
    this.mobileMenuBtn.classList.remove("active")
    this.navLinks.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

class ResponsiveParticleSystem {
  constructor() {
    this.container = document.getElementById("particles-container")
    this.particles = []
    this.particleCount = this.getParticleCount()
    this.isTouch = "ontouchstart" in window

    this.init()
  }

  getParticleCount() {
    const width = window.innerWidth
    if (width < 480) return 15
    if (width < 768) return 25
    if (width < 1024) return 35
    return 50
  }

  init() {
    // Disable particles on touch devices for better performance
    if (this.isTouch && window.innerWidth < 768) {
      return
    }

    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle()
    }

    this.animate()

    // Handle resize
    window.addEventListener("resize", () => {
      const newCount = this.getParticleCount()
      if (newCount !== this.particleCount) {
        this.updateParticleCount(newCount)
      }
    })
  }

  updateParticleCount(newCount) {
    const diff = newCount - this.particleCount

    if (diff > 0) {
      // Add particles
      for (let i = 0; i < diff; i++) {
        this.createParticle()
      }
    } else if (diff < 0) {
      // Remove particles
      for (let i = 0; i < Math.abs(diff); i++) {
        const particle = this.particles.pop()
        if (particle) {
          particle.remove()
        }
      }
    }

    this.particleCount = newCount
  }

  createParticle() {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random initial position
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight

    particle.style.left = x + "px"
    particle.style.top = y + "px"

    // Random properties
    const speed = Math.random() * 2 + 0.5
    const angle = Math.random() * Math.PI * 2
    const life = Math.random() * 3 + 2

    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    }

    particle.life = life
    particle.maxLife = life

    this.container.appendChild(particle)
    this.particles.push(particle)

    // Animate particle appearance
    gsap.to(particle, {
      opacity: Math.random() * 0.6 + 0.2,
      duration: 1,
      ease: "power2.out",
    })
  }

  animate() {
    this.particles.forEach((particle, index) => {
      // Update position
      const currentX = Number.parseFloat(particle.style.left)
      const currentY = Number.parseFloat(particle.style.top)

      particle.style.left = currentX + particle.velocity.x + "px"
      particle.style.top = currentY + particle.velocity.y + "px"

      // Update life
      particle.life -= 0.016

      // Update opacity based on life
      const opacity = particle.life / particle.maxLife
      particle.style.opacity = opacity * 0.6

      // Remove and recreate if dead or out of bounds
      if (
        particle.life <= 0 ||
        currentX < -10 ||
        currentX > window.innerWidth + 10 ||
        currentY < -10 ||
        currentY > window.innerHeight + 10
      ) {
        particle.remove()
        this.particles.splice(index, 1)
        this.createParticle()
      }
    })

    requestAnimationFrame(() => this.animate())
  }
}

class ResponsiveCustomCursor {
  constructor() {
    this.cursor = document.getElementById("cursor")
    this.dot = document.querySelector(".cursor-dot")
    this.outline = document.querySelector(".cursor-outline")
    this.isTouch = "ontouchstart" in window

    if (!this.cursor || this.isTouch || window.innerWidth < 768) {
      if (this.cursor) this.cursor.style.display = "none"
      return
    }

    this.mouse = { x: 0, y: 0 }
    this.cursor.pos = { x: 0, y: 0 }
    this.cursor.speed = 0.2

    this.init()
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })

    // Hover effects for interactive elements
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.matches("a, button, .magnetic, input, textarea")) {
          this.cursor.classList.add("hover")
        }
      },
      true,
    )

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.matches("a, button, .magnetic, input, textarea")) {
          this.cursor.classList.remove("hover")
        }
      },
      true,
    )

    this.updateCursor()
  }

  updateCursor() {
    this.cursor.pos.x = lerp(this.cursor.pos.x, this.mouse.x, this.cursor.speed)
    this.cursor.pos.y = lerp(this.cursor.pos.y, this.mouse.y, this.cursor.speed)

    this.cursor.style.transform = `translate(${this.cursor.pos.x}px, ${this.cursor.pos.y}px)`

    requestAnimationFrame(() => this.updateCursor())
  }
}

class ResponsiveMagneticElements {
  constructor() {
    this.elements = document.querySelectorAll(".magnetic")
    this.isTouch = "ontouchstart" in window
    this.init()
  }

  init() {
    // Disable magnetic effects on touch devices
    if (this.isTouch) {
      return
    }

    this.elements.forEach((element) => {
      const strength = Number.parseFloat(element.dataset.magnetic) || 0.3

      element.addEventListener("mousemove", (e) => {
        this.applyMagneticEffect(element, e, strength)
      })

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.3)",
        })
      })
    })
  }

  applyMagneticEffect(element, e, strength) {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    })
  }
}

// Loading Animation
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen")
    this.loaderBar = document.querySelector(".loader-bar")
    this.loadingChars = document.querySelectorAll(".loading-char")
    this.progressPercentage = document.querySelector(".progress-percentage")
    this.statusText = document.querySelector(".status-text")
    this.glitchTexts = document.querySelectorAll(".glitch-text")
    this.progress = 0
    this.init()
  }

  init() {
    // Initialize glitch effects
    this.initGlitchEffects()

    // Start coordinate flickering
    this.startCoordinateFlicker()

    // Animate loading characters
    gsap.to(this.loadingChars, {
      opacity: 1,
      duration: 0.1,
      stagger: 0.15,
      ease: "power2.out",
      delay: 2,
    })

    // Animate loading bar with progress counter
    this.animateProgress()
  }

  initGlitchEffects() {
    this.glitchTexts.forEach((text) => {
      setInterval(() => {
        if (Math.random() < 0.1) {
          text.style.animation = "none"
          setTimeout(() => {
            text.style.animation = ""
          }, 100)
        }
      }, 500)
    })
  }

  startCoordinateFlicker() {
    const coordinates = document.querySelectorAll(".coord-value")
    coordinates.forEach((coord) => {
      setInterval(() => {
        if (Math.random() < 0.05) {
          coord.style.opacity = Math.random() < 0.5 ? "0.3" : "1"
          setTimeout(() => {
            coord.style.opacity = "1"
          }, 50)
        }
      }, 200)
    })
  }

  animateProgress() {
    const duration = 3000 // 3 seconds
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      this.progress = Math.min((elapsed / duration) * 100, 100)

      // Update progress bar
      gsap.to(this.loaderBar, {
        transform: `translateX(${this.progress - 100}%)`,
        duration: 0.1,
        ease: "none",
      })

      // Update percentage display
      if (this.progressPercentage) {
        this.progressPercentage.textContent = `${Math.floor(this.progress)}%`
      }

      // Update status text based on progress
      this.updateStatusText()

      if (this.progress < 100) {
        requestAnimationFrame(updateProgress)
      } else {
        setTimeout(() => this.hideLoader(), 500)
      }
    }

    setTimeout(() => {
      updateProgress()
    }, 2000)
  }

  updateStatusText() {
    if (!this.statusText) return

    if (this.progress < 25) {
      this.statusText.textContent = "ESTABLISHING CONNECTION..."
    } else if (this.progress < 50) {
      this.statusText.textContent = "DECRYPTING SIGNAL..."
    } else if (this.progress < 75) {
      this.statusText.textContent = "LOADING CLASSIFIED DATA..."
    } else if (this.progress < 95) {
      this.statusText.textContent = "FINALIZING TRANSMISSION..."
    } else {
      this.statusText.textContent = "CONNECTION ESTABLISHED"
      this.statusText.style.color = "#00ff00"
    }
  }

  hideLoader() {
    // Add final glitch effect before hiding
    gsap.to(this.loaderBar, {
      transform: "translateX(0%)",
      duration: 0.2,
      ease: "power2.out",
    })

    // Glitch effect on the entire loading screen
    gsap.to(this.loadingScreen, {
      scaleX: 1.02,
      duration: 0.1,
      yoyo: true,
      repeat: 3,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(this.loadingScreen, {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            this.loadingScreen.style.display = "none"
            isLoading = false
            document.body.style.overflow = "auto"
            this.initMainAnimations()
          },
        })
      },
    })
  }

  initMainAnimations() {
    console.log("[v0] Initializing main animations after loading screen")

    // Initialize responsive components
    customCursor = new ResponsiveCustomCursor()
    magneticElements = new ResponsiveMagneticElements()
    waterEffect = new WaterDistortionEffect()

    new ScrollAnimations()
    new ResponsiveParticleSystem()
    new NavigationController()
    new MobileNavigation()
    new FormHandler()
    new ScrollProgressBar()

    this.initHeroAnimations()
  }

  initHeroAnimations() {
    // Hero character animation
    const heroChars = document.querySelectorAll(".hero-char")
    gsap.to(heroChars, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "elastic.out(1, 0.8)",
      delay: 0.5,
    })

    // Subtitle animation
    const subtitleLines = document.querySelectorAll(".subtitle-line")
    gsap.to(subtitleLines, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      delay: 1.2,
    })

    // Hero content animation
    gsap.to(".hero-tags", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 1.5,
    })

    gsap.to(".hero-description", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 1.7,
    })

    gsap.to(".scroll-indicator", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 2,
    })

    // Floating elements parallax
    this.initFloatingElements()
  }

  initFloatingElements() {
    const floatingElements = document.querySelectorAll(".floating-element")

    floatingElements.forEach((element, index) => {
      // Initial animation
      gsap.fromTo(
        element,
        {
          y: 100,
          opacity: 0,
          rotation: 0,
        },
        {
          y: 0,
          opacity: 1,
          rotation: 360,
          duration: 2,
          delay: 2 + index * 0.2,
          ease: "elastic.out(1, 0.5)",
        },
      )

      // Continuous floating animation
      gsap.to(element, {
        y: -20,
        rotation: 180,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5,
      })
    })
  }
}

// Enhanced Custom Cursor
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById("cursor")
    this.dot = document.querySelector(".cursor-dot")
    this.outline = document.querySelector(".cursor-outline")

    if (!this.cursor) return

    this.mouse = { x: 0, y: 0 }
    this.cursor.pos = { x: 0, y: 0 }
    this.cursor.speed = 0.2

    this.init()
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })

    // Hover effects for interactive elements
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.matches("a, button, .magnetic, input, textarea")) {
          this.cursor.classList.add("hover")
        }
      },
      true,
    )

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.matches("a, button, .magnetic, input, textarea")) {
          this.cursor.classList.remove("hover")
        }
      },
      true,
    )

    this.updateCursor()
  }

  updateCursor() {
    this.cursor.pos.x = lerp(this.cursor.pos.x, this.mouse.x, this.cursor.speed)
    this.cursor.pos.y = lerp(this.cursor.pos.y, this.mouse.y, this.cursor.speed)

    this.cursor.style.transform = `translate(${this.cursor.pos.x}px, ${this.cursor.pos.y}px)`

    requestAnimationFrame(() => this.updateCursor())
  }
}

// Enhanced Magnetic Elements
class MagneticElements {
  constructor() {
    this.elements = document.querySelectorAll(".magnetic")
    this.init()
  }

  init() {
    this.elements.forEach((element) => {
      const strength = Number.parseFloat(element.dataset.magnetic) || 0.3

      element.addEventListener("mousemove", (e) => {
        this.applyMagneticEffect(element, e, strength)
      })

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.3)",
        })
      })
    })
  }

  applyMagneticEffect(element, e, strength) {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    })
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.init()
  }

  init() {
    // Text reveal animations
    this.initTextRevealAnimations()

    // Element reveal animations
    this.initElementRevealAnimations()

    // Counter animations
    this.initCounterAnimations()

    // Parallax effects
    this.initParallaxEffects()
  }

  initTextRevealAnimations() {
    const revealTexts = document.querySelectorAll(".reveal-text")

    revealTexts.forEach((element) => {
      const titleLines = element.querySelectorAll(".title-line")

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        onEnter: () => {
          gsap.to(titleLines, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
          })
        },
      })
    })
  }

  initElementRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal-up")

    revealElements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        onEnter: () => {
          gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          })
        },
      })
    })

    // Project cards stagger animation
    const projectCards = document.querySelectorAll(".project-card")

    ScrollTrigger.create({
      trigger: ".portfolio-grid",
      start: "top 70%",
      onEnter: () => {
        gsap.to(projectCards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        })
      },
    })
  }

  initCounterAnimations() {
    const statNumbers = document.querySelectorAll(".stat-number")

    statNumbers.forEach((stat) => {
      const finalValue = Number.parseInt(stat.dataset.count)

      ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
          gsap.to(stat, {
            innerHTML: finalValue,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 1 },
            stagger: 0.2,
          })
        },
      })
    })
  }

  initParallaxEffects() {
    // Gradient orbs parallax
    const orbs = document.querySelectorAll(".gradient-orb")
    orbs.forEach((orb, index) => {
      gsap.to(orb, {
        y: -100 * (index + 1),
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    })

    // Floating elements parallax
    const floatingElements = document.querySelectorAll(".floating-element")
    floatingElements.forEach((element) => {
      const speed = Number.parseFloat(element.dataset.speed) || 1

      gsap.to(element, {
        y: -50 * speed,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    })
  }
}

// Particle System
class ParticleSystem {
  constructor() {
    this.container = document.getElementById("particles-container")
    this.particles = []
    this.particleCount = 50

    this.init()
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle()
    }

    this.animate()
  }

  createParticle() {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random initial position
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight

    particle.style.left = x + "px"
    particle.style.top = y + "px"

    // Random properties
    const speed = Math.random() * 2 + 0.5
    const angle = Math.random() * Math.PI * 2
    const life = Math.random() * 3 + 2

    particle.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    }

    particle.life = life
    particle.maxLife = life

    this.container.appendChild(particle)
    this.particles.push(particle)

    // Animate particle appearance
    gsap.to(particle, {
      opacity: Math.random() * 0.6 + 0.2,
      duration: 1,
      ease: "power2.out",
    })
  }

  animate() {
    this.particles.forEach((particle, index) => {
      // Update position
      const currentX = Number.parseFloat(particle.style.left)
      const currentY = Number.parseFloat(particle.style.top)

      particle.style.left = currentX + particle.velocity.x + "px"
      particle.style.top = currentY + particle.velocity.y + "px"

      // Update life
      particle.life -= 0.016

      // Update opacity based on life
      const opacity = particle.life / particle.maxLife
      particle.style.opacity = opacity * 0.6

      // Remove and recreate if dead or out of bounds
      if (
        particle.life <= 0 ||
        currentX < -10 ||
        currentX > window.innerWidth + 10 ||
        currentY < -10 ||
        currentY > window.innerHeight + 10
      ) {
        particle.remove()
        this.particles.splice(index, 1)
        this.createParticle()
      }
    })

    requestAnimationFrame(() => this.animate())
  }
}

// Enhanced Navigation Controller
class NavigationController {
  constructor() {
    this.nav = document.querySelector(".navigation")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.sections = document.querySelectorAll("section[id]")
    this.currentSection = ""

    this.init()
  }

  init() {
    // Scroll-based navigation background
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === 1) {
          this.nav.classList.add("scrolled")
        } else {
          this.nav.classList.remove("scrolled")
        }
      },
    })

    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
          // Add active state immediately
          this.setActiveLink(link)

          // Smooth scroll with enhanced easing
          gsap.to(window, {
            duration: 1.8,
            scrollTo: {
              y: targetSection,
              offsetY: 100,
              autoKill: false,
            },
            ease: "power3.inOut",
            onComplete: () => {
              // Ensure the section is properly highlighted after scroll
              this.updateActiveSection()
            },
          })
        }
      })
    })

    this.initSectionHighlighting()

    this.initCTAButton()
  }

  initSectionHighlighting() {
    // Create scroll triggers for each section
    this.sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 20%",
        end: "bottom 20%",
        onEnter: () => this.updateActiveSection(section.id),
        onEnterBack: () => this.updateActiveSection(section.id),
      })
    })
  }

  initCTAButton() {
    const ctaButton = document.querySelector(".cta-button")
    if (ctaButton) {
      ctaButton.addEventListener("click", (e) => {
        e.preventDefault()
        const downloadSection = document.querySelector("#download")

        if (downloadSection) {
          gsap.to(window, {
            duration: 2,
            scrollTo: {
              y: downloadSection,
              offsetY: 100,
              autoKill: false,
            },
            ease: "power3.inOut",
          })
        }
      })
    }
  }

  updateActiveSection(sectionId = null) {
    if (!sectionId) {
      // Determine current section based on scroll position
      const scrollY = window.scrollY + 150

      this.sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          sectionId = section.id
        }
      })
    }

    if (sectionId && sectionId !== this.currentSection) {
      this.currentSection = sectionId

      // Update navigation links
      this.navLinks.forEach((link) => {
        const href = link.getAttribute("href")
        if (href === `#${sectionId}`) {
          this.setActiveLink(link)
        } else {
          link.classList.remove("active")
        }
      })
    }
  }

  setActiveLink(activeLink) {
    this.navLinks.forEach((link) => {
      link.classList.remove("active")
    })
    activeLink.classList.add("active")

    // Add a subtle animation to the active link
    gsap.fromTo(
      activeLink,
      { scale: 1 },
      {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      },
    )
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.form = document.querySelector(".contact-form")
    this.init()
  }

  init() {
    if (!this.form) return

    this.form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.submitForm()
    })

    // Input focus animations
    const inputs = this.form.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        gsap.to(input, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        })
      })

      input.addEventListener("blur", () => {
        gsap.to(input, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })
  }

  submitForm() {
    const submitButton = this.form.querySelector("button")
    const originalText = submitButton.querySelector(".btn-text").textContent

    // Button loading animation
    gsap.to(submitButton, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    })

    submitButton.querySelector(".btn-text").textContent = "Sending..."
    submitButton.disabled = true

    // Simulate form submission
    setTimeout(() => {
      submitButton.querySelector(".btn-text").textContent = "Message Sent!"

      setTimeout(() => {
        submitButton.querySelector(".btn-text").textContent = originalText
        submitButton.disabled = false
        this.form.reset()
      }, 2000)
    }, 1500)
  }
}

// Scroll Progress Bar
class ScrollProgressBar {
  constructor() {
    this.progressBar = document.querySelector(".progress-bar")
    this.init()
  }

  init() {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const progress = self.progress * 100
        this.progressBar.style.width = progress + "%"
      },
    })
  }
}

// Enhanced WebGL Water Effect
class WaterDistortionEffect {
  constructor() {
    this.canvas = document.getElementById("distortion-canvas")

    if (!this.canvas) return

    this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl")

    if (!this.gl) {
      console.warn("WebGL not supported")
      return
    }

    this.mouse = { x: 0, y: 0 }
    this.targetMouse = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.time = 0

    this.init()
  }

  init() {
    this.setupCanvas()
    this.createShaders()
    this.createGeometry()
    this.setupUniforms()
    this.bindEvents()

    this.render()
  }

  setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    }

    resize()
    window.addEventListener("resize", resize)
  }

  createShaders() {
    this.vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `

    this.fragmentShaderSource = `
            precision highp float;
            
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform vec2 u_velocity;
            uniform float u_time;
            
            varying vec2 v_texCoord;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float smoothNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                
                float a = noise(i);
                float b = noise(i + vec2(1.0, 0.0));
                float c = noise(i + vec2(0.0, 1.0));
                float d = noise(i + vec2(1.0, 1.0));
                
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 mouse = u_mouse / u_resolution.xy;
                
                float dist = distance(uv, mouse);
                float radius = 0.15;
                
                if (dist < radius) {
                    float factor = smoothstep(radius, 0.0, dist);
                    
                    vec2 direction = normalize(uv - mouse);
                    float ripple = sin(dist * 30.0 - u_time * 8.0) * 0.02 * factor;
                    
                    vec3 color = vec3(0.5, 0.8, 1.0) * factor * 0.3;
                    gl_FragColor = vec4(color, factor * 0.5);
                } else {
                    gl_FragColor = vec4(0.0);
                }
            }
        `

    this.program = this.createProgram(this.vertexShaderSource, this.fragmentShaderSource)
  }

  createProgram(vertexSource, fragmentSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource)

    const program = this.gl.createProgram()
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program linking error:", this.gl.getProgramInfoLog(program))
    }

    return program
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", this.gl.getShaderInfoLog(shader))
    }

    return shader
  }

  createGeometry() {
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])

    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

    this.positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW)

    this.texCoordBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW)
  }

  setupUniforms() {
    this.uniforms = {
      resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
      mouse: this.gl.getUniformLocation(this.program, "u_mouse"),
      velocity: this.gl.getUniformLocation(this.program, "u_velocity"),
      time: this.gl.getUniformLocation(this.program, "u_time"),
    }

    this.attributes = {
      position: this.gl.getAttribLocation(this.program, "a_position"),
      texCoord: this.gl.getAttribLocation(this.program, "a_texCoord"),
    }
  }

  bindEvents() {
    document.addEventListener("mousemove", (e) => {
      this.targetMouse.x = e.clientX
      this.targetMouse.y = window.innerHeight - e.clientY
    })
  }

  render() {
    if (!this.gl || !this.program) return

    this.time += 0.016

    // Smooth mouse following
    this.mouse.x = lerp(this.mouse.x, this.targetMouse.x, 0.1)
    this.mouse.y = lerp(this.mouse.y, this.targetMouse.y, 0.1)

    // Calculate velocity
    this.velocity.x = this.targetMouse.x - this.mouse.x
    this.velocity.y = this.targetMouse.y - this.mouse.y

    // Setup WebGL
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

    // Set uniforms
    this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height)
    this.gl.uniform2f(this.uniforms.mouse, this.mouse.x, this.mouse.y)
    this.gl.uniform2f(this.uniforms.velocity, this.velocity.x, this.velocity.y)
    this.gl.uniform1f(this.uniforms.time, this.time)

    // Set attributes
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.enableVertexAttribArray(this.attributes.position)
    this.gl.vertexAttribPointer(this.attributes.position, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    this.gl.enableVertexAttribArray(this.attributes.texCoord)
    this.gl.vertexAttribPointer(this.attributes.texCoord, 2, this.gl.FLOAT, false, 0, 0)

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)

    requestAnimationFrame(() => this.render())
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM loaded, starting loading screen")
  document.body.style.overflow = "hidden"

  // Start with loading screen
  new LoadingScreen()
})

// Handle window resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh()
})
