const pokeApi = {}

function convertPokemonDetailToPokemon(pokeDetail){
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name
  pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default
  const pokemonTypes = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = pokemonTypes;

  pokemon.types = pokemonTypes;
  pokemon.type = type;
  
  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokemonDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) =>{
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  
  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
}