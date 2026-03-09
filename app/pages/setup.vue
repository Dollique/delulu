<template>
  <section>
    <h1>Setup</h1>
    <h2>Get Your API Keys</h2>
    <p>
      To use the API key injector, you need to use your own API keys. You can create accounts and
      get API keys for free from the following APIs:
    </p>

    <ul>
      <li>
        <a href="https://serpapi.com/" target="_blank">SerpAPI</a>
      </li>
      <li>
        <a href="https://newsdata.io/" target="_blank">NewsData API</a>
      </li>
    </ul>

    <h2>Store API Keys</h2>
    Delulu needs access to your API keys. To do this securely, there are two simple methods.

    <h3>Using Tampermonkey (Recommended)</h3>
    <ul>
      <li>
        1. Install Tampermonkey from the
        <a href="https://www.tampermonkey.net/" target="_blank">official website</a>.
      </li>
      <li>
        2. Click on the Tampermonkey icon in your browser toolbar and select "Create a new script".
      </li>
      <li>
        3. Replace the default code with
        <a href="/api_key_injector.userscript.js" target="_blank">this code</a>.
      </li>
      <li>4. Add your own API keys when prompted and save the script.</li>
      <li>5. Refresh the page where you want to use the API key injector.</li>
    </ul>

    <h3>Using my Browser Extension</h3>
    <ul>
      <li>
        1. Install the API key injector browser extension from the
        <a href="/api-key-injector-browser-extensions/" target="_blank"
          >API key injector browser extensions page</a
        >.
      </li>
      <li>2. Open the extension and add your API keys.</li>
      <li>3. Refresh the page where you want to use the API key injector.</li>
    </ul>
  </section>
</template>

<script lang="ts" setup></script>

<style></style>
