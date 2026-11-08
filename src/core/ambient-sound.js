const VOLUME = 0.18;
const FILTER_HZ = 520;
const SWELL_SECONDS = 7;
const FADE_SECONDS = 1.2;

let audio = null;

function createWaterNoise(context) {
  const seconds = 4;
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function build() {
  const context = new AudioContext();
  const source = createWaterNoise(context);
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = FILTER_HZ;

  const swell = context.createOscillator();
  const swellDepth = context.createGain();
  swell.frequency.value = 1 / SWELL_SECONDS;
  swellDepth.gain.value = 180;
  swell.connect(swellDepth).connect(filter.frequency);

  const volume = context.createGain();
  volume.gain.value = 0;
  source.connect(filter).connect(volume).connect(context.destination);
  source.start();
  swell.start();
  return { context, volume };
}

export function setSound(on) {
  if (!audio && on) audio = build();
  if (!audio) return;
  const now = audio.context.currentTime;
  audio.volume.gain.cancelScheduledValues(now);
  audio.volume.gain.setTargetAtTime(on ? VOLUME : 0, now, FADE_SECONDS / 3);
  if (on) audio.context.resume();
}

export function createSoundToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toggle toggle--sound';
  button.innerHTML = '<span class="toggle__dot" aria-hidden="true"></span>Suara';
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    setSound(on);
  });
  return button;
}
