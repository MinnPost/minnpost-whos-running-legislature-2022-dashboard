<script>

export let district_region;
export let candidates;

// single candidate template
import Candidate from "./Candidate.svelte";
import Map from "./components/Map.svelte";

let showMap = false;

</script>

<style>
  .map-container {height: 200px;}

  h3 {
    margin-bottom: 0.25em;
  }

  h5 {
    font-weight: 400;
    font-style: italic;
    color: #5E6E76;
    display: inline;
  }

  .m-district {
    margin-bottom: .75em;
  }

  .candidates-listing {
    padding: .5em 0;
  }
</style>

<article class="m-district">
  <h3>{district_region.label}</h3>
  <h5>{district_region.region}</h5>
  &mdash;
  {#if showMap}
    <small><a href="{null}" on:click="{() => showMap = false}">Hide map</a></small>
    <div class="map-container">
      <Map district={district_region.district}/>
    </div>
  {:else}
    <small><a href="{null}" on:click="{() => showMap = true}">Show map</a></small>
  {/if}
  <div class="candidates-listing">
  {#each candidates as candidate}
    <Candidate candidate = {candidate} />
  {/each}
  </div>
</article>
