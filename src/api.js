import { isLoading } from './store.js'

export async function getCandidates() {
  const response = await fetch('https://s3.amazonaws.com/data.minnpost/projects/spreadsheets/1dQxzfWG1a97zRzKN3QJQnGG4H3M4KhOGoi30_E62-2o-Categories|House|Senate-custom.json')
  return response.json()
}
