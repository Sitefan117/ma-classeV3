// -----------------------------------------------------------------------------
// GESTIONNAIRE AUDIO
// Gère la synthèse vocale (TTS) pour l'accessibilité.
// Utilise l'API Web Speech native du navigateur.
// -----------------------------------------------------------------------------

export class AudioManager {
	private static voice: SpeechSynthesisVoice | null = null;

	/**
	 * Initialise la meilleure voix disponible.
	 * Cherche une voix "Naturelle" ou "Premium" pour éviter l'effet robotique.
	 */
	static async init() {
		return new Promise<void>((resolve) => {
			const loadVoices = () => {
				const voices = window.speechSynthesis.getVoices();
				
				// Priorité aux voix "Google", "Natural" ou "Apple"
				const preferred = voices.find(v => 
					v.name.includes('Google') || 
					v.name.includes('Natural') || 
					v.name.includes('Premium')
				) || voices[0];

				this.voice = preferred;
				resolve();
			};

			if (window.speechSynthesis.onvoiceschanged !== undefined) {
				window.speechSynthesis.onvoiceschanged = loadVoices;
			}
			loadVoices();
		});
	}

	/**
	 * Lit un texte à haute voix.
	 * @param text Le texte à lire.
	 * @param lang Le code langue (ex: 'fr-FR', 'ru-RU').
	 */
	static speak(text: string, lang: string = 'fr-FR') {
		// FIX: On annule tout audio en cours avant de parler.
		// Cela évite les superpositions et les bruits de "clics" ou "pops" à la fin.
		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = lang;
		
		if (this.voice) {
			utterance.voice = this.voice;
		}

		// Réglages pour une voix plus humaine
		utterance.pitch = 1.0;
		utterance.rate = 0.9; // Légèrement plus lent pour une meilleure compréhension pédagogique

		window.speechSynthesis.speak(utterance);
	}

	/**
	 * Arrête immédiatement toute lecture.
	 */
	static stop() {
		window.speechSynthesis.cancel();
	}
}
