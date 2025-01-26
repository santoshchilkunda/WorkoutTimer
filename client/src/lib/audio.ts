class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private youtubeGainNode: GainNode | null = null;
  private muted: boolean = false;
  private youtubePlayer: any = null;
  private baseYoutubeVolume: number = 1;

  constructor() {}

  setYoutubePlayer(player: any) {
    this.youtubePlayer = player;
    if (player) {
      player.setVolume(100);
      this.baseYoutubeVolume = 1;
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = this.muted ? 0 : Math.max(0, Math.min(1, volume));
    }
  }

  setYoutubeVolume(volume: number) {
    if (this.youtubeGainNode) {
      // Use exponential ramping for smoother volume transitions
      const now = this.audioContext?.currentTime || 0;
      this.youtubeGainNode.gain.setTargetAtTime(
        Math.max(0, Math.min(1, volume)),
        now,
        0.1 // Time constant for smooth transition
      );
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    this.setVolume(this.gainNode?.gain.value || 0.3);
  }

  async initializeAudio() {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.youtubeGainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.youtubeGainNode.connect(this.audioContext.destination);
        this.setVolume(0.3);
        this.setYoutubeVolume(1);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }

    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playTone(frequency: number = 800, duration: number = 0.1, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.gainNode || this.muted) return;

    // Temporarily reduce YouTube volume during sound effects
    if (this.youtubePlayer) {
      const currentVolume = this.baseYoutubeVolume;
      // Reduce to 40% of current volume (less dramatic reduction)
      this.setYoutubeVolume(currentVolume * 0.4);

      // Restore volume gradually
      setTimeout(() => {
        this.setYoutubeVolume(currentVolume);
      }, duration * 1000 + 100);
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Create a separate gain node for envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playPhaseChange() {
    // Higher pitch for workout, lower for rest
    await this.playTone(880, 0.15, 'triangle');
    setTimeout(() => this.playTone(660, 0.15, 'triangle'), 200);
  }

  async playCountdown() {
    await this.playTone(440, 0.1, 'sine');
  }

  async playComplete() {
    // Play a success sound when workout is complete
    await this.playTone(880, 0.15, 'sine');
    setTimeout(() => this.playTone(1100, 0.2, 'sine'), 200);
  }
}

export const audioManager = new AudioManager();