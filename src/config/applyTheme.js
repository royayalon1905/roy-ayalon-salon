function toKebabCase(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function applyTheme(theme) {
  const root = document.documentElement.style
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.setProperty(`--color-${toKebabCase(key)}`, value)
  })
  root.setProperty('--font-display', theme.fonts.display)
  root.setProperty('--font-body', theme.fonts.body)
}
