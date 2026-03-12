// ==UserScript==
// @name         Delulu - API Key Injector
// @namespace    http://localhost:3000/
// @version      2.0
// @match        *://localhost:3000/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

;(function () {
  'use strict'

  console.log('%c[Delulu] INITIALIZING...', 'color: yellow; font-weight: bold; font-size: 14px;')

  // ---- Load keys from Tampermonkey storage ----
  let keys
  try {
    keys = JSON.parse(GM_getValue('delulu_api_keys', '{}'))
  } catch {
    keys = {}
  }

  // Prompt only for missing keys, and save empty string if user cancels
  if (keys.SERP === undefined)
    keys.SERP = prompt('Enter your SerpAPI Key (leave blank to skip):') || ''
  if (keys.NEWSDATA === undefined)
    keys.NEWSDATA = prompt('Enter your NewsData API Key (leave blank to skip):') || ''
  if (keys.CURRENTS === undefined)
    keys.CURRENTS = prompt('Enter your Currents API Key (leave blank to skip):') || ''

  GM_setValue('delulu_api_keys', JSON.stringify(keys))
  console.log('[Delulu] Loaded persistent API keys:', keys)

  // ---- Inject into page context ----
  function inject(fn, arg) {
    const el = document.createElement('script')
    el.textContent = `;(${fn})(${JSON.stringify(arg)});`
    document.documentElement.appendChild(el)
    el.remove()
  }

  inject(pageLogic, { keys })
})()

// ---- PAGE CONTEXT CODE (this runs in Nuxt/Vite environment) ----
function pageLogic({ keys }) {
  const debug = (...x) => console.log('%c[Delulu]', 'color:#0ff;', ...x)

  debug('Patcher injected into page context.')

  // ----- Helpers -----
  function extractURL(input) {
    if (typeof input === 'string') return input
    if (input instanceof URL) return input.toString()
    if (input instanceof Request) return input.url
    return ''
  }

  function mergeHeaders(existing, extra) {
    const h = new Headers(existing || {})
    for (const [k, v] of Object.entries(extra)) if (v) h.set(k, v)
    return h
  }

  function withInjectedHeaders(input, init) {
    const url = extractURL(input)
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
    const shouldInject = method === 'POST' || method === 'GET'

    if (!shouldInject) return { input, init }

    // Default to SERP if no source is specified
    let apiKeySource = 'SERP'
    let apiKey = keys.SERP

    // Extract api_key_query_param from query (GET) or body (POST)
    if (method === 'GET') {
      const urlObj = new URL(url)
      apiKeySource = urlObj.searchParams.get('api_key_query_param') || apiKeySource
    } else if (method === 'POST' && init?.body) {
      // Handle both JSON and FormData
      if (typeof init.body === 'string') {
        try {
          const body = JSON.parse(init.body)
          apiKeySource = body.api_key_query_param || apiKeySource
        } catch (e) {
          // Not JSON, try FormData or URL-encoded
          const params = new URLSearchParams(init.body)
          apiKeySource = params.get('api_key_query_param') || apiKeySource
        }
      } else if (init.body instanceof FormData) {
        apiKeySource = init.body.get('api_key_query_param') || apiKeySource
      }
    }

    // Select the key based on apiKeySource
    apiKey = keys[apiKeySource.toUpperCase()] || keys.SERP

    const extra = {
      'x-api-key': apiKey
    }

    debug('Injecting header for', apiKeySource, '→', method, url)

    // Clone Request or merge headers as before
    if (input instanceof Request) {
      const cloned = new Request(input, {
        method: input.method,
        headers: mergeHeaders(input.headers, extra),
        body: input.body
      })
      return { input: cloned, init }
    }

    return {
      input,
      init: {
        ...(init || {}),
        headers: mergeHeaders(init?.headers, extra)
      }
    }
  }

  // ----- FETCH PATCH -----
  function patchFetch() {
    const orig = globalThis.fetch
    if (!orig || orig.__delulu) return

    globalThis.fetch = new Proxy(orig, {
      apply(target, thisArg, args) {
        const [input, init] = args
        debug('FETCH →', extractURL(input))

        const patched = withInjectedHeaders(input, init)
        return Reflect.apply(target, thisArg, [patched.input, patched.init])
      }
    })

    globalThis.fetch.__delulu = true
    debug('fetch patched')
  }

  // ----- $fetch.raw PATCH -----
  function patchOfetch() {
    const f = window.$fetch
    if (!f || !f.raw || f.raw.__delulu) return

    const orig = f.raw

    f.raw = new Proxy(orig, {
      apply(target, thisArg, args) {
        const [input, init] = args
        debug('$fetch.raw →', extractURL(input))

        const patched = withInjectedHeaders(input, init)
        return Reflect.apply(target, thisArg, [patched.input, patched.init])
      }
    })

    f.raw.__delulu = true
    debug('$fetch.raw patched')
  }

  // ----- XHR PATCH -----
  function patchXHR() {
    const X = XMLHttpRequest
    if (!X || X.__delulu) return

    const open = X.prototype.open
    const send = X.prototype.send

    X.prototype.open = function (method, url, ...rest) {
      this.__deluluURL = url
      this.__deluluMETHOD = method.toUpperCase()
      return open.call(this, method, url, ...rest)
    }

    X.prototype.send = function (body) {
      if (this.__deluluMETHOD === 'POST' || this.__deluluMETHOD === 'GET') {
        this.setRequestHeader('x-api-key', keys.SERP)
        debug('XHR header injected →', this.__deluluMETHOD, this.__deluluURL)
      }
      return send.call(this, body)
    }

    X.__delulu = true
    debug('XHR patched')
  }

  // Patch everything
  function apply() {
    patchFetch()
    patchOfetch()
    patchXHR()
  }

  apply()

  // Nuxt hydration patch loop
  let tries = 0
  const interval = setInterval(() => {
    apply()
    if (++tries > 25) clearInterval(interval)
  }, 300)

  debug('Delulu patcher active.')
}
