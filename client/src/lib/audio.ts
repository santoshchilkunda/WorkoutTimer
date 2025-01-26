class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private youtubeGainNode: GainNode | null = null;
  private muted: boolean = false;
  private youtubePlayer: any = null;

  constructor() {}

  setYoutubePlayer(player: any) {
    this.youtubePlayer = player;
    if (player) {
      player.setVolume(100);
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = this.muted ? 0 : Math.max(0, Math.min(1, volume));
    }
  }

  setYoutubeVolume(volume: number) {
    if (this.youtubeGainNode) {
      this.youtubeGainNode.gain.value = Math.max(0, Math.min(1, volume));
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
      const currentVolume = this.youtubeGainNode?.gain.value || 1;
      // Reduce to 20% of current volume (more noticeable reduction)
      this.setYoutubeVolume(currentVolume * 0.2);
      setTimeout(() => this.setYoutubeVolume(currentVolume), duration * 1000 + 100);
    }

    const oscillator = this.audioContext.createOscillator();
    oscillator.connect(this.gainNode);
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