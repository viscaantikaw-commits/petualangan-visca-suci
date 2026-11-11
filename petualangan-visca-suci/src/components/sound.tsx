// Efek suara bertema "game retro 8-bit": gelombang pulsa, bass segitiga, dan derau ala konsol jadul.
// Semuanya dibuat langsung dengan Web Audio API, jadi tidak butuh file audio tambahan.
// Pengaturan volume disimpan di perangkat supaya tetap sama saat game dibuka lagi.

type Settings = { volume: number; muted: boolean }
type ToneOptions = { type?: OscillatorType; gain?: number; endFreq?: number }
type ChipOptions = { duty?: number; gain?: number; endFreq?: number; vibrato?: boolean; sustain?: number }
type NoiseOptions = { filter?: number; q?: number; gain?: number; kind?: BiquadFilterType }

const STORAGE_KEY = 'petualangan-bangun-datar:sound'
// Gelombang pulsa terdengar lebih pelan dari efek lain pada gain yang sama, jadi dinaikkan agar seimbang.
const CHIP_BOOST = 1.8

const N = {
  G3: 196, C4: 261.63, E4: 329.63, G4: 392, C5: 523.25, E5: 659.25, G5: 783.99,
  B5: 987.77, C6: 1046.5, E6: 1318.51, G6: 1567.98,
}

function clamp(value: number) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.7
}

function loadSettings(): Settings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>
      return { volume: clamp(Number(parsed.volume)), muted: Boolean(parsed.muted) }
    }
  } catch {
    // penyimpanan tidak tersedia: pakai nilai bawaan
  }
  return { volume: 0.7, muted: false }
}

let settings = loadSettings()
let ctx: AudioContext | null = null
let master: GainNode | null = null
let bus: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
const pulseWaves = new Map<number, PeriodicWave>()

function saveSettings() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // abaikan jika tidak bisa menyimpan
  }
}

function level() {
  return settings.muted ? 0 : settings.volume * settings.volume
}

function ensureContext() {
  if (!ctx) {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtor) return null
    ctx = new AudioCtor()
    master = ctx.createGain()
    master.gain.value = level()
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -14
    limiter.ratio.value = 4
    master.connect(limiter)
    limiter.connect(ctx.destination)
    bus = ctx.createGain()
    bus.connect(master)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// Gelombang pulsa dengan lebar tertentu (duty): 12,5% = tipis/nyaring, 25% = hidung, 50% = kotak penuh.
function pulseWave(context: AudioContext, duty: number) {
  let wave = pulseWaves.get(duty)
  if (!wave) {
    const size = 48
    const real = new Float32Array(size)
    const imag = new Float32Array(size)
    for (let n = 1; n < size; n += 1) real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty)
    wave = context.createPeriodicWave(real, imag)
    pulseWaves.set(duty, wave)
  }
  return wave
}

// Satu "kanal" suara 8-bit: nada pulsa dengan volume turun linear seperti chip jadul.
function chip(freq: number, start: number, duration: number, { duty = 0.5, gain = 0.14, endFreq, vibrato = false, sustain = 0.6 }: ChipOptions = {}) {
  const context = ensureContext()
  if (!context || !bus) return
  const t = context.currentTime + start
  const osc = context.createOscillator()
  const env = context.createGain()
  osc.setPeriodicWave(pulseWave(context, duty))
  osc.frequency.setValueAtTime(freq, t)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration)
  env.gain.setValueAtTime(0.0001, t)
  const peak = gain * CHIP_BOOST
  env.gain.linearRampToValueAtTime(peak, t + 0.004)
  env.gain.linearRampToValueAtTime(peak * sustain, t + duration * 0.8)
  env.gain.linearRampToValueAtTime(0.0001, t + duration)
  osc.connect(env)
  env.connect(bus)
  if (vibrato) {
    const lfo = context.createOscillator()
    const depth = context.createGain()
    lfo.frequency.value = 6.5
    depth.gain.value = freq * 0.012
    lfo.connect(depth)
    depth.connect(osc.frequency)
    lfo.start(t + 0.12)
    lfo.stop(t + duration + 0.05)
  }
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

// Bass segitiga ala konsol jadul.
function tone(freq: number, start: number, duration: number, { type = 'triangle', gain = 0.22, endFreq }: ToneOptions = {}) {
  const context = ensureContext()
  if (!context || !bus) return
  const t = context.currentTime + start
  const osc = context.createOscillator()
  const env = context.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.01)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(env)
  env.connect(bus)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

// Derau "kasar" (nilainya bertahan beberapa sampel) seperti kanal drum konsol 8-bit.
function noise(start: number, duration: number, { filter = 1200, q = 1, gain = 0.2, kind = 'bandpass' }: NoiseOptions = {}) {
  const context = ensureContext()
  if (!context || !bus) return
  if (!noiseBuffer) {
    noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    let value = 0
    for (let i = 0; i < data.length; i += 1) {
      if (i % 6 === 0) value = Math.random() * 2 - 1
      data[i] = value
    }
  }
  const t = context.currentTime + start
  const source = context.createBufferSource()
  const shaper = context.createBiquadFilter()
  const env = context.createGain()
  source.buffer = noiseBuffer
  shaper.type = kind
  shaper.frequency.value = filter
  shaper.Q.value = q
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  source.connect(shaper)
  shaper.connect(env)
  env.connect(bus)
  source.start(t)
  source.stop(t + duration + 0.05)
}

export function getVolume() {
  return settings.volume
}

export function isMuted() {
  return settings.muted
}

export function setVolume(volume: number) {
  settings = { volume: clamp(volume), muted: false }
  saveSettings()
  if (master && ctx) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.02)
}

export function setMuted(muted: boolean) {
  settings = { ...settings, muted }
  saveSettings()
  if (master && ctx) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.02)
}

// Langkah kaki "bip-bip-bip-bip" ala game konsol jadul.
export function playWalk() {
  ;[330, 392, 330, 392].forEach((freq, i) => {
    chip(freq, i * 0.17, 0.07, { duty: 0.25, gain: 0.11, sustain: 0.3 })
    tone(110, i * 0.17, 0.07, { gain: 0.18 })
  })
}

// Lompat: sapuan nada naik yang cepat seperti game platform klasik.
export function playJump() {
  chip(260, 0, 0.2, { gain: 0.14, endFreq: 820, sustain: 0.8 })
  chip(520, 0, 0.2, { duty: 0.125, gain: 0.05, endFreq: 1640, sustain: 0.8 })
}

// Bentuk target terkumpul: "ba-ding!" seperti koin.
export function playCollect() {
  chip(N.B5, 0, 0.07, { gain: 0.14, sustain: 1 })
  chip(N.E6, 0.07, 0.42, { gain: 0.14, sustain: 0.4 })
  chip(N.E6, 0.16, 0.33, { duty: 0.125, gain: 0.04, sustain: 0.4 })
}

// Sampai di bendera: fanfare pendek dengan arpeggio, trill, dan bass.
export function playFlag() {
  tone(N.C4, 0, 1.25, { gain: 0.22 })
  ;[N.C5, N.E5, N.G5, N.C6].forEach((freq, i) => chip(freq, i * 0.075, 0.075, { gain: 0.13, sustain: 1 }))
  ;[N.G5, N.C6, N.G5, N.C6, N.G5, N.C6].forEach((freq, i) => chip(freq, 0.32 + i * 0.06, 0.06, { duty: 0.25, gain: 0.12, sustain: 1 }))
  chip(N.C6, 0.7, 0.6, { duty: 0.25, gain: 0.13, vibrato: true })
}

// Jawaban benar: arpeggio naik cepat lalu nada tinggi berkilau.
export function playCorrect() {
  ;[N.C5, N.E5, N.G5, N.C6, N.E6].forEach((freq, i) => chip(freq, i * 0.055, 0.06, { gain: 0.13, sustain: 1 }))
  chip(N.G6, 0.3, 0.4, { duty: 0.25, gain: 0.13, vibrato: true })
  noise(0.3, 0.12, { filter: 7000, gain: 0.04, kind: 'highpass' })
}

// Jawaban salah: tiga nada turun ala "game over" yang singkat.
export function playWrong() {
  chip(196, 0, 0.13, { duty: 0.25, gain: 0.15, sustain: 1 })
  chip(156, 0.14, 0.13, { duty: 0.25, gain: 0.15, sustain: 1 })
  chip(131, 0.28, 0.4, { duty: 0.25, gain: 0.15, endFreq: 82, sustain: 0.9 })
  noise(0.28, 0.3, { filter: 300, gain: 0.12, kind: 'lowpass' })
}

// Level selesai: arpeggio naik, "ta-ta-ta-TAA!" dan benturan simbal.
export function playComplete() {
  ;[N.C5, N.E5, N.G5, N.C6, N.E6, N.G6].forEach((freq, i) => chip(freq, i * 0.07, 0.08, { gain: 0.12, sustain: 1 }))
  tone(N.G3, 0.55, 0.45, { gain: 0.22 })
  ;[0.55, 0.7, 0.85].forEach((t) => chip(N.G5, t, 0.12, { gain: 0.13, sustain: 0.8 }))
  tone(N.C4, 1, 1.1, { gain: 0.22 })
  chip(N.C6, 1, 0.9, { duty: 0.25, gain: 0.14, vibrato: true })
  chip(N.E6, 1, 0.9, { duty: 0.125, gain: 0.07, vibrato: true })
  chip(N.G5, 1, 0.9, { duty: 0.5, gain: 0.07, vibrato: true })
  noise(1, 0.5, { filter: 6000, gain: 0.08, kind: 'highpass' })
}

// Bunyi singkat saat slider volume dilepas.
export function playPreview() {
  chip(N.E6, 0, 0.14, { gain: 0.14, sustain: 0.4 })
}