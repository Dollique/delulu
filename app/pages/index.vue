<template>
  <section>
    <h1>Home</h1>

    <p>The goal of this project is to focus on positive news.</p>
    <p>
      Sadly, for the moment I have not found a free or cheap api where I can filter for good news...
    </p>

    <h2>Scoring System</h2>
    <p>
      The title and description of each news is analyzed and a score is given to it. It is a simple
      keyword matching and currently no AI is used to analyze the content.
    </p>
    <p>
      The scoring system works by analyzing keywords in the content and assigning weights to them.
      Positive keywords increase the score while negative keywords decrease it. Scores range from
      0-100, where 0 is very negative, 50 is neutral, and 100 is very positive.
    </p>

    <h2>Available Filters</h2>
    <p>Users can customize several filters:</p>

    <ul>
      <li>
        <strong>Sort by Media Score</strong>: Toggle whether items are sorted by their calculated
        score
      </li>
      <li>
        <strong>Show Color Grade Label</strong>: Display the color grade label (like "Positive",
        "Neutral")
      </li>
      <li><strong>Show Score in Label</strong>: Show the numerical score within labels</li>
      <li>
        <strong>Hide Items with Score ≤</strong>: A slider to hide media items below a certain score
        threshold
      </li>
      <li>
        <strong>Keyword Scoring Configuration</strong>: Adjust weights for specific keywords to
        influence how they affect scores
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup></script>

<style></style>
