import AllCandidates from './AllCandidates.svelte'
import ByDistrict from './ByDistrict.svelte'
import ByParty from './ByParty.svelte'
import ByRegion from './ByRegion.svelte'
//import Error from './Error.svelte'

export default [
  {
    path: '/',
    component: AllCandidates
  }/*,
  {
    path: '/by-district',
    component: ByDistrict
  },
  {
    path: '/by-district/:district',
    component: ByDistrict
  },
  {
    path: '/by-party',
    component: ByParty,
  },
  {
    path: '/by-party/:party',
    component: ByParty
  },
  {
    path: '/by-region',
    component: ByRegion,
  },
  {
    path: '/by-region/:region',
    component: ByRegion
  }*/
]
