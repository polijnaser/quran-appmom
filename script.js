// Récupérer les éléments du DOM
const surahSelect = document.getElementById('surah-select');
const versesContainer = document.getElementById('verses-container');

// Charger la liste des sourates
async function loadSurahs() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();

    // Ajouter les options au sélecteur
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
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/fr.asad`);
    const data = await response.json();

    // Afficher les versets
    versesContainer.innerHTML = '';
    data.data.ayahs.forEach(ayah => {
      const verseDiv = document.createElement('div');
      verseDiv.className = 'verse';

      // Texte du verset
      const verseText = document.createElement('p');
      verseText.textContent = ayah.text;
      verseDiv.appendChild(verseText);

      // Audio du verset
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${ayah.number}`;
      verseDiv.appendChild(audio);

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