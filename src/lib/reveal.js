// Aparición suave de bloques al hacer scroll. Uso: <div use:reveal> y data-reveal en los hijos.
// Sin JS o con movimiento reducido, el contenido se muestra normal.
export function reveal(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target) }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  const observe = () => root.querySelectorAll('[data-reveal]:not(.reveal)').forEach(item => { item.classList.add('reveal'); io.observe(item) })
  observe()
  // Observa bloques que aparecen después (filtros, cambios de página).
  const mo = new MutationObserver(observe)
  mo.observe(root, { childList: true, subtree: true })
  return { destroy() { io.disconnect(); mo.disconnect() } }
}
