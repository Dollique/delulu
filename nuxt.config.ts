import fs from 'fs'
import path from 'path'

const theme = 'default'
const themeDir = path.join(process.cwd(), 'app/styles', theme)
let themeCssFiles: string[] = []
try {
  themeCssFiles = fs
    .readdirSync(themeDir)
    .filter((f: string) => f.endsWith('.css'))
    .map((f: string) => `~/styles/${theme}/${f}`)
} catch (e) {
  themeCssFiles = []
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@pinia/nuxt'],
  css: themeCssFiles
})
