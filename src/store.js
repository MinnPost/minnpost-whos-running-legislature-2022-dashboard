import { writable, derived } from 'svelte/store';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const candidates = writable([]);
export const districts = writable([]);
export const parties = writable([]);
export const regions = writable([]);

export const isLoading = writable(true)
export const searchTerm = writable('')
export const district = writable([]);
export const region = writable([]);
export const party = writable([]);

//export const params = writable('')
//export const remoteOnly = writable(false)

export const filteredCandidates = derived(
    [candidates, searchTerm, district, region, party],
    ([$candidates, $searchTerm, $district, $region, $party]) => {
        return (
            filterBySearchTerm(
                $candidates,
                $searchTerm
            )
        )
    }
);

function searchResults(searchTerm, data) {
    var lowSearch = searchTerm.toLowerCase();
    let skipKeys = ['blurb'];
    let searchInDesiredKeys = data.filter(
        item => Object.entries(item).some(
            ([key, val]) => ! skipKeys.includes(key) ? String(val).toLowerCase().includes(lowSearch) : false
        )
    );
    return searchInDesiredKeys;
}

function matchResults(key, value, data) {
    let result = data.filter(item => item[key] === value);
    return result;
}

function filterBySearchTerm(data, searchTerm) {
    if (!searchTerm) {
        return data;
    }

    data = searchResults(searchTerm, data);
    return data;

}

function filterByParams(data, params) {
    if (!params) {
        return data;
    }
    if (params.region) {
        data = data.filter(
            item => item["region"] == params.region
        );
    }
  }
  


/** Data transformation.
For our use case, we only care about the drink names, not the other information.
Here, we'll create a derived store to hold the drink names.
**/
/*export const items = derived(apiData, ($apiData) => {
  if ($apiData.candidates) {
      let items = [];
      items.candidates = $apiData.candidates;
      console.log(items);
      return items;
    return $apiData.candidates;
  }
  return [];
});
*/

/*export const items = derived( [apiData], 
    ([$apiData]) => ({
       candidates: []
    })
 );*/