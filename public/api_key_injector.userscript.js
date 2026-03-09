// ==UserScript==
// @name         Delulu - API Key Injector
// @namespace    http://localhost:3000/
// @version      0.1
// @description  Inject your API keys for the Delulu application
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration - Replace these with your actual API keys
  const DEFAULT_API_KEYS = {
    CURRENTS: 'YOUR_API_KEY',
    NEWSDATA: 'YOUR_API_KEY',
    SERP: 'YOUR_API_KEY'
  }

  // Function to store API keys in browser storage
  function storeAPIKeys() {
    const apiKeys = {
      CURRENTS: prompt('Enter your Currents API Key:', DEFAULT_API_KEYS.CURRENTS),
      NEWSDATA: prompt('Enter your NewsData API Key:', DEFAULT_API_KEYS.NEWSDATA),
      SERP: prompt('Enter your SerpAPI Key:', DEFAULT_API_KEYS.SERP)
    }

    // Store keys in browser storage
    GM_setValue('delulu_api_keys', JSON.stringify(apiKeys))

    console.log('API keys stored successfully')
    return apiKeys
  }

  // Function to get API keys from browser storage
  function getStoredAPIKeys() {
    const stored = GM_getValue('delulu_api_keys', null)
    if (stored) {
      return JSON.parse(stored)
    }
    return null
  }

  // Function to inject API keys into the page
  function injectAPIKeys() {
    const apiKeys = getStoredAPIKeys()

    if (!apiKeys) {
      console.log('No stored API keys found. Storing default keys...')
      storeAPIKeys()
      return
    }

    // Inject keys into window object for your app to access
    window.deluluApiKeys = apiKeys

    console.log('API keys injected:', apiKeys)

    // Also store in localStorage for persistence across page refreshes
    localStorage.setItem('delulu_api_keys', JSON.stringify(apiKeys))
  }

  // Run when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAPIKeys)
  } else {
    injectAPIKeys()
  }

  // Also run on page load for SPA applications
  window.addEventListener('load', injectAPIKeys)
})()
