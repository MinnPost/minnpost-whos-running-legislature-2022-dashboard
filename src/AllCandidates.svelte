<script>

    import { searchTerm, filteredCandidates } from './store.js';

    import Candidate from "./Candidate.svelte";


</script>
{#each $filteredCandidates as candidate (candidate["candidate-id"])}
    <li>
        <Candidate candidate = {candidate} />
    </li>
    {:else}
    <li class="job-list-no-results">No Results Found</li>
{/each}