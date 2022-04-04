<script>

export let district_region;
export let candidates;

// single candidate template
import Candidate from "./Candidate.svelte";
import Map from "./components/Map.svelte";

let showMap = false;

</script>

<style>
  .map-container {
    height: 200px;
    margin-top: 0.25em;
  }

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

  button {
    background-color: #ffffff;
    border: 1px solid #D6D6DA;
    border-radius: 5px;
    color: #5E6E76;
    font-size: 0.6em;
    vertical-align: middle;
    margin-left: 1em;
  }

</style>

<section class="m-district">
  <h3>{district_region.label}</h3>
  <h5>{district_region.region}</h5>
  {#if showMap}
    <button value="" on:click="{() => showMap = false}">Hide map</button>
    <div class="map-container">
      <Map district={district_region.district}/>
    </div>
  {:else}
  <button value="" on:click="{() => showMap = true}">Show on map</button>
  {/if}
  <div class="candidates-listing">
  {#each candidates as candidate}
    <Candidate candidate = {candidate} />
  {/each}
  </div>
</section>
