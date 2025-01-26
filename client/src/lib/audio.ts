class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3;
    }
  }

  playBeep(frequency: number = 800, duration: number = 0.1) {
    this.initAudioContext();
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    oscillator.connect(this.gainNode);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playPhaseChange() {
    this.playBeep(880, 0.15);
    setTimeout(() => this.playBeep(660, 0.15), 200);
  }

  playCountdown() {
    this.playBeep(440, 0.1);
  }
}

export const audioManager = new AudioManager();
