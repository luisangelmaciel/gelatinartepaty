document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#search-input');
  const searchResults = document.querySelector('#search-results');

  async function displaySearchResults(query) {
    const response = await fetch('/search.json');
    const data = await response.json();
    const fuse = new Fuse(data, { keys: ['title', 'content'], threshold: 0.3 });

    const results = fuse.search(query);

    if (results.length > 0) {
      const resultsHtml = results.map(result => {
        return `
          <a href="${result.item.url}" class="search-result">
            <h3>${result.item.title}</h3>
            <p>${result.item.excerpt}</p>
          </a>
        `;
      }).join('');

      searchResults.innerHTML = resultsHtml;
    } else {
      searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
    }
  }

  searchInput.addEventListener('input', () => {
    displaySearchResults(searchInput.value);
  });
});
