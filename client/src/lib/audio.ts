class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private youtubePlayer: any = null;
  private muted: boolean = false;
  private isInitialized: boolean = false;
  private hasUserInteraction: boolean = false;

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

  private async resumeAudioContext() {
    if (this.audioContext?.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('AudioContext resumed successfully');
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        throw new Error('Failed to resume audio playback');
      }
    }
  }

  async initializeAudio() {
    // Set user interaction flag
    this.hasUserInteraction = true;

    if (this.isInitialized) {
      await this.resumeAudioContext();
      return;
    }

    try {
      // Use standard AudioContext for modern browsers
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error('Audio is not supported in this browser');
      }

      this.audioContext = new AudioContextClass();
      console.log('AudioContext created successfully');

      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.setVolume(0.3);

      // Immediately resume the context if possible
      await this.resumeAudioContext();

      this.isInitialized = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio system:', error);
      // Throw error to be handled by the UI
      throw new Error(error instanceof Error ? error.message : 'Failed to initialize audio system');
    }
  }

  async playTone(frequency: number = 800, duration: number = 0.1, type: OscillatorType = 'sine') {
    if (!this.hasUserInteraction) {
      console.log('Waiting for user interaction before playing audio');
      return;
    }

    if (!this.audioContext || !this.gainNode || this.muted || !this.isInitialized) {
      console.log('Cannot play tone:', {
        hasContext: !!this.audioContext,
        hasGainNode: !!this.gainNode,
        isMuted: this.muted,
        isInitialized: this.isInitialized
      });
      return;
    }

    try {
      // Try to resume the context before playing
      await this.resumeAudioContext();

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
      console.log('Tone played successfully:', { frequency, duration, type });
    } catch (error) {
      console.error('Failed to play tone:', error);
      throw new Error('Failed to play audio tone');
    }
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