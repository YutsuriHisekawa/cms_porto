import DOMPurify from 'dompurify'
export default defineNuxtPlugin(() => {
  return {
    provide: {
      sanitize: (dirty: string) => DOMPurify.sanitize(dirty)
    }
  }
})
