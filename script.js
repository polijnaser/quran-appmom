// Récupérer les éléments du DOM
const surahSelect = document.getElementById('surah-select');
const versesContainer = document.getElementById('verses-container');

// Variable pour stocker l'audio en cours
let currentAudio = null;

// Charger la liste des sourates
async function loadSurahs() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();

    // Ajouter les options au menu déroulant
    data.data.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
      surahSelect.appendChild(option);
    });

    // Charger la première sourate par défaut
    loadVerses(data.data[0].number);
  } catch (error) {
    console.error('Erreur lors du chargement des sourates :', error);
  }
}

// Charger les versets d'une sourate
async function loadVerses(surahNumber) {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
    const data = await response.json();

    // Vider le conteneur des versets
    versesContainer.innerHTML = '';

    // Afficher les versets
    data.data.ayahs.forEach((ayah, index) => {
      const verseDiv = document.createElement('div');
      verseDiv.className = 'verse';
      verseDiv.innerHTML = `
        <span class="verse-number">${index + 1}.</span>
        ${ayah.text}
      `;

      // Ajouter un écouteur d'événement pour le clic
      verseDiv.addEventListener('click', () => {
        // Arrêter l'audio précédent
        if (currentAudio) {
          currentAudio.pause();
        }

        // Changer la couleur du verset touché
        document.querySelectorAll('.verse.highlight').forEach(verse => {
          verse.classList.remove('highlight');
        });
        verseDiv.classList.add('highlight');

        // Jouer l'audio du verset
        currentAudio = new Audio(ayah.audio);
        currentAudio.play();
      });

      versesContainer.appendChild(verseDiv);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des versets :', error);
  }
}

// Écouter les changements de sélection
surahSelect.addEventListener('change', (event) => {
  loadVerses(event.target.value);
});

// Charger les sourates au démarrage
loadSurahs();
