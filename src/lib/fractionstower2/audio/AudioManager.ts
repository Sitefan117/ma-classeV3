// -----------------------------------------------------------------------------
// GESTIONNAIRE AUDIO
// Gère la lecture des effets sonores et de la musique de fond.
// -----------------------------------------------------------------------------

export class AudioManager {
	private static sounds: Record<string, HTMLAudioElement> = {};
	private static bgm: HTMLAudioElement | null = null;

	/**
	 * Charge un effet sonore.
	 */
	static loadSound(id: string, path: string) {
		this.sounds[id] = new Audio(path);
	}

	/**
	 * Joue un effet sonore.
	 */
	static playSound(id: string, volume = 1.0) {
		const sound = this.sounds[id];
		if (sound) {
			sound.currentTime = 0;
			sound.volume = volume;
			sound.play().catch(e => console.warn(`Audio playback failed: ${e}`));
		}
	}

	/**
	 * Gère la musique de fond (BGM).
	 */
	static playBGM(path: string, volume = 0.5, loop = true) {
		if (this.bgm) {
			this.bgm.pause();
		}
		this.bgm = new Audio(path);
		this.bgm.volume = volume;
		this.bgm.loop = loop;
		this.bgm.play().catch(e => console.warn(`BGM playback failed: ${e}`));
	}

	static stopBGM() {
		if (this.bgm) {
			this.bgm.pause();
			this.bgm = null;
		}
	}

	/** Compatibilité avec les écrans de combat : joue une musique déjà chargée. */
	static playMusic(id: string, volume = 0.5) {
		this.playSound(id, volume);
	}

	/** Compatibilité avec les écrans de combat. */
	static stopMusic() {
		this.stopBGM();
	}

	/** Lit une consigne avec la synthèse vocale du navigateur, si elle existe. */
	static speak(text: string, lang = 'fr-FR') {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

		try {
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = lang;
			window.speechSynthesis.speak(utterance);
		} catch (error) {
			console.warn('La synthèse vocale est indisponible dans ce navigateur.', error);
		}
	}
}
