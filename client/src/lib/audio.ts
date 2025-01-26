class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private youtubePlayer: any = null;
  private muted: boolean = false;

  setYoutubePlayer(player: any) {
    this.youtubePlayer = player;
    if (player) {
      player.setVolume(100);
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = this.muted ? 0 : volume;
    }
  }

  setYoutubeVolume(volume: number) {
    if (this.youtubePlayer && !this.muted) {
      // YouTube volume is 0-100
      this.youtubePlayer.setVolume(volume * 100);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.youtubePlayer) {
      if (this.muted) {
        this.youtubePlayer.mute();
      } else {
        this.youtubePlayer.unMute();
        this.youtubePlayer.setVolume(100);
      }
    }
    this.setVolume(this.gainNode?.gain.value || 0.3);
  }

  async initializeAudio() {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.setVolume(0.3);
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

    const oscillator = this.audioContext.createOscillator();
    const toneGain = this.audioContext.createGain();

    // Keep notification sounds at a low, fixed volume
    toneGain.gain.value = 0.2;

    oscillator.connect(toneGain);
    toneGain.connect(this.gainNode);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playPhaseChange() {
    await this.playTone(880, 0.15, 'triangle');
    setTimeout(() => this.playTone(660, 0.15, 'triangle'), 200);
  }

  async playCountdown() {
    await this.playTone(440, 0.1, 'sine');
  }

  async playComplete() {
    await this.playTone(880, 0.15, 'sine');
    setTimeout(() => this.playTone(1100, 0.2, 'sine'), 200);
  }
}

export const audioManager = new AudioManager();