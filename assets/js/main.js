const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const generationSelector = document.getElementById('generationSelector');
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

const generationRanges = ["1-151", "152-251", "252-386", "387-493", "494-649", "650-721", "722-809", "810-898"]; // Faixas de cada geração
let offset = 0;
let limit = 5; // Limite fixo para carregar 5 Pokémon de cada vez
let selectedGeneration = "1-151";
let end = 151; // Defina o valor final padrão inicialmente

function loadPokemonItens(offset, limit) {
  const [start, end] = selectedGeneration.split('-').map(Number);
  pokeApi.getPokemons(start - 1 + offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map((pokemon) => `
        <li class="pokemon ${pokemon.type}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
            <ol class="types">
              ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img  src="${pokemon.photo}" alt="${pokemon.name}" id="detalhePoke">
          </div>
        </li>
      `).join('');
    pokemonList.innerHTML += newHtml; // Adiciona os novos Pokémon à lista existente
    if (start + offset + limit - 1 < end) {
      loadMoreButton.style.display = 'block'; // Exibe o botão "load more" se houver mais pokémons a serem carregados
    } else {
      loadMoreButton.style.display = 'none'; // Oculta o botão "load more" se todos os pokémons da geração foram carregados
    }
  });
}

function loadMorePokemons() {
  offset += limit;
  const remainingPokemons = end - offset;
  if (remainingPokemons > 0) {
    loadPokemonItens(offset, Math.min(limit, remainingPokemons));
  } else {
    loadMoreButton.style.display = 'none';
  }
}

function loadSelectedGeneration() {
  selectedGeneration = generationRanges[generationSelector.selectedIndex];
  const [start, end] = selectedGeneration.split('-').map(Number);
  offset = 0;
  limit = 5; // Reinicia o limite ao mudar a geração
  pokemonList.innerHTML = ''; // Limpa a lista ao mudar a geração
  loadMoreButton.style.display = 'block'; // Exibe o botão "load more" ao carregar uma nova geração
  loadPokemonItens(offset, limit);
}

// Carrega a geração selecionada ao carregar a página
window.onload = loadSelectedGeneration;

loadMoreButton.addEventListener('click', loadMorePokemons);

generationSelector.addEventListener('change', loadSelectedGeneration);

scrollToTopBtn.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth" // Rola suavemente
  });
});
