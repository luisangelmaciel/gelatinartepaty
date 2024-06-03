// Importa Fuse.js
import Fuse from 'fuse.js';

// Espera a que el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Obtiene los datos de búsqueda desde el archivo JSON generado por Eleventy
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      // Crea el índice de búsqueda
      const fuse = new Fuse(data, {
        keys: ['title', 'content'],
        threshold: 0.3,
      });

      // Obtiene la referencia al input de búsqueda y a los resultados
      const searchInput = document.querySelector('#search-input');
      const searchResults = document.querySelector('#search-results');

      // Agrega un evento al input de búsqueda
      searchInput.addEventListener('input', () => {
        // Realiza la búsqueda
        const results = fuse.search(searchInput.value);

        // Muestra los resultados
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
      });
    });
});
