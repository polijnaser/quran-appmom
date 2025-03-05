// Récupérer l'élément du DOM
const surahsContainer = document.getElementById('surahs-container');

// Variable pour stocker l'audio en cours
let currentAudio = null;

// Charger toutes les sourates
async function loadSurahs() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();

    // Afficher les sourates
    data.data.forEach(surah => {
      const surahDiv = document.createElement('div');
      surahDiv.className = 'surah';
      surahDiv.innerHTML = `<h2>${surah.englishName} (${surah.name})</h2>`;

      // Charger les versets de la sourate
      loadVerses(surah.number, surahDiv);

      surahsContainer.appendChild(surahDiv);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des sourates :', error);
  }
}

// Charger les versets d'une sourate
async function loadVerses(surahNumber, surahDiv) {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
    const data = await response.json();

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

      surahDiv.appendChild(verseDiv);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des versets :', error);
  }
}

// Charger les sourates au démarrage
loadSurahs();
