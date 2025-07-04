import { useColorMode } from '@vueuse/core'

export const useTheme = () => {
  const colorMode = useColorMode({
    attribute: 'class',
    modes: {
      light: 'light',
      dark: 'dark'
    }
  })

  const isDark = computed(() => colorMode.value === 'dark')

  const toggleTheme = () => {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    colorMode,
    isDark,
    toggleTheme
  }
}