// Audio engine removed per user request

class SilentAudioEngine {
  public toggleTick(_onStateChange?: (active: boolean) => void) {}
  public isTickActive(): boolean { return false; }
  public playSingleTick() {}
  public playHapticClick() {}
  public playWindingRotor() {}
}

export const audioEngine = new SilentAudioEngine();
