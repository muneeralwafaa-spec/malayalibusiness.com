import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'

export default getRequestConfig(async ({ requestLocale }) => {
  return {
    locale: 'en',
    messages: (await import('./messages/en.json')).default,
  }
})
