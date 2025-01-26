class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private youtubeGainNode: GainNode | null = null;
  private muted: boolean = false;
  private youtubePlayer: any = null;

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.youtubeGainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.youtubeGainNode.connect(this.audioContext.destination);
      this.setVolume(0.3);
      this.setYoutubeVolume(1);
    }
  }

  setYoutubePlayer(player: any) {
    this.youtubePlayer = player;
    if (player) {
      // Set initial YouTube player volume to 100%
      player.setVolume(100);
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = this.muted ? 0 : Math.max(0, Math.min(1, volume));
    }
  }

  setYoutubeVolume(volume: number) {
    if (this.youtubePlayer) {
      // YouTube's volume is 0-100
      this.youtubePlayer.setVolume(volume * 100);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    this.setVolume(this.gainNode?.gain.value || 0.3);
  }

  private async temporarilyReduceYoutubeVolume() {
    if (!this.youtubePlayer) return;

    try {
      const currentVolume = this.youtubePlayer.getVolume() / 100;
      // Reduce to 10% of current volume
      this.setYoutubeVolume(currentVolume * 0.1);
      // Return to original volume after delay
      await new Promise(resolve => setTimeout(resolve, 300));
      this.setYoutubeVolume(currentVolume);
    } catch (error) {
      console.error('Error adjusting YouTube volume:', error);
    }
  }

  playTone(frequency: number = 800, duration: number = 0.1, type: OscillatorType = 'sine') {
    this.initAudioContext();
    if (!this.audioContext || !this.gainNode || this.muted) return;

    // Temporarily reduce YouTube volume during sound effects
    this.temporarilyReduceYoutubeVolume();

    const oscillator = this.audioContext.createOscillator();
    oscillator.connect(this.gainNode);
    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playPhaseChange() {
    // Higher pitch for workout, lower for rest
    this.playTone(880, 0.15, 'triangle');
    setTimeout(() => this.playTone(660, 0.15, 'triangle'), 200);
  }

  playCountdown() {
    this.playTone(440, 0.1, 'sine');
  }

  playComplete() {
    // Play a success sound when workout is complete
    this.playTone(880, 0.15, 'sine');
    setTimeout(() => this.playTone(1100, 0.2, 'sine'), 200);
  }
}

export const audioManager = new AudioManager();