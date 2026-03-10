// ==UserScript==
// @name         Delulu - Secure API Key Injector
// @namespace    http://localhost:3000/
// @version      0.3
// @match        *://localhost:3000/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

;(function () {
  'use strict'

  function getOrStoreAPIKeys() {
    let stored = GM_getValue('delulu_api_keys', null)
    let apiKeys = null

    try {
      apiKeys = stored ? JSON.parse(stored) : null
    } catch (e) {
      apiKeys = null
    }

    // Trigger prompt if keys are missing or the object is empty
    if (!apiKeys || Object.keys(apiKeys).length === 0) {
      apiKeys = {
        CURRENTS: prompt('Enter your Currents API Key:'),
        NEWSDATA: prompt('Enter your NewsData API Key:'),
        SERP: prompt('Enter your SerpAPI Key:')
      }
      GM_setValue('delulu_api_keys', JSON.stringify(apiKeys))
    }
    return apiKeys
  }

  // Initialize keys immediately
  const keys = getOrStoreAPIKeys()

  // Override fetch
  const originalFetch = window.fetch
  window.fetch = async function (input, init = {}) {
    // Determine the URL regardless of if 'input' is a string or Request object
    const url = typeof input === 'string' ? input : input.url

    // Clone headers or start fresh
    const headers = new Headers(init.headers || {})

    if (url.includes('currentsapi')) {
      headers.set('x-api-key', keys.CURRENTS)
    } else if (url.includes('newsdata')) {
      headers.set('x-api-key', keys.NEWSDATA)
    } else if (url.includes('serpapi')) {
      headers.set('x-api-key', keys.SERP)
    }

    return originalFetch.call(this, input, { ...init, headers })
  }
})()
