// Récupérer l'élément du DOM
const surahsContainer = document.getElementById('surahs-container');

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

    // Afficher uniquement les versets courts (moins de 10 mots par exemple)
    data.data.ayahs.forEach(ayah => {
      const words = ayah.text.split(' ').length;
      if (words <= 10) { // Afficher uniquement les versets courts
        const verseDiv = document.createElement('div');
        verseDiv.className = 'verse';
        verseDiv.textContent = ayah.text;

        // Ajouter un écouteur d'événement pour le clic
        verseDiv.addEventListener('click', () => {
          playAudio(ayah.audio);
        });

        surahDiv.appendChild(verseDiv);
      }
    });
  } catch (error) {
    console.error('Erreur lors du chargement des versets :', error);
  }
}

// Jouer l'audio d'un verset
function playAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.play();
}

// Charger les sourates au démarrage
loadSurahs();
