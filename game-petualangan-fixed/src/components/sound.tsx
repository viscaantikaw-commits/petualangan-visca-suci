// Efek suara bertema "petualangan ajaib": harpa, lonceng kristal, dan pad lembut dengan gema (reverb).
// Semuanya dibuat langsung dengan Web Audio API, jadi tidak butuh file audio tambahan.
// Pengaturan volume disimpan di perangkat supaya tetap sama saat game dibuka lagi.

type Settings = { volume: number; muted: boolean }
type ToneOptions = { type?: OscillatorType; gain?: number; endFreq?: number }
type NoiseOptions = { filter?: number; filterEnd?: number; q?: number; gain?: number; kind?: BiquadFilterType }

const STORAGE_KEY = 'petualangan-bangun-datar:sound'

// Nada-nada tangga pentatonik C mayor: enak didengar dan tidak pernah "fals" jika bertumpuk.
const N = {
  C4: 261.63, E4: 329.63, G4: 392, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98, A6: 1760, C7: 2093,
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

// Gema ruangan: derau yang meredup pelan, dibuat sendiri sebagai "impulse response".
function createReverb(context: AudioContext) {
  const length = Math.floor(context.sampleRate * 1.7)
  const impulse = context.createBuffer(2, length, context.sampleRate)
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6)
  }
  const convolver = context.createConvolver()
  convolver.buffer = impulse
  return convolver
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
    const send = ctx.createGain()
    send.gain.value = 0.32
    bus.connect(send)
    const reverb = createReverb(ctx)
    send.connect(reverb)
    reverb.connect(master)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, { type = 'sine', gain = 0.3, endFreq }: ToneOptions = {}) {
  const context = ensureContext()
  if (!context || !bus) return
  const t = context.currentTime + start
  const osc = context.createOscillator()
  const env = context.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(env)
  env.connect(bus)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

// Derau yang disaring (bisa menyapu naik): dipakai untuk "whoosh", ketukan, dan kilau.
function noise(start: number, duration: number, { filter = 1200, filterEnd, q = 1, gain = 0.3, kind = 'bandpass' }: NoiseOptions = {}) {
  const context = ensureContext()
  if (!context || !bus) return
  if (!noiseBuffer) {
    noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1
  }
  const t = context.currentTime + start
  const source = context.createBufferSource()
  const shaper = context.createBiquadFilter()
  const env = context.createGain()
  source.buffer = noiseBuffer
  shaper.type = kind
  shaper.Q.value = q
  shaper.frequency.setValueAtTime(filter, t)
  if (filterEnd) shaper.frequency.exponentialRampToValueAtTime(filterEnd, t + duration)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.03, duration / 3))
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  source.connect(shaper)
  shaper.connect(env)
  env.connect(bus)
  source.start(t)
  source.stop(t + duration + 0.05)
}

// Lonceng kristal (sintesis FM): bunyi "ting" berkilau seperti kotak musik/celesta.
function bell(freq: number, start: number, duration: number, gain = 0.25) {
  const context = ensureContext()
  if (!context || !bus) return
  const t = context.currentTime + start
  const carrier = context.createOscillator()
  const modulator = context.createOscillator()
  const depth = context.createGain()
  const env = context.createGain()
  carrier.type = 'sine'
  modulator.type = 'sine'
  carrier.frequency.value = freq
  modulator.frequency.value = freq * 3.5
  depth.gain.setValueAtTime(freq * 2.2, t)
  depth.gain.exponentialRampToValueAtTime(freq * 0.05, t + duration * 0.7)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  modulator.connect(depth)
  depth.connect(carrier.frequency)
  carrier.connect(env)
  env.connect(bus)
  carrier.start(t)
  modulator.start(t)
  carrier.stop(t + duration + 0.05)
  modulator.stop(t + duration + 0.05)
}

// Petikan harpa: nada lembut yang cerah di awal lalu meredup.
function harp(freq: number, start: number, duration = 0.6, gain = 0.2) {
  const context = ensureContext()
  if (!context || !bus) return
  const t = context.currentTime + start
  const body = context.createOscillator()
  const overtone = context.createOscillator()
  const shaper = context.createBiquadFilter()
  const env = context.createGain()
  body.type = 'triangle'
  overtone.type = 'sine'
  body.frequency.value = freq
  overtone.frequency.value = freq * 2
  shaper.type = 'lowpass'
  shaper.frequency.setValueAtTime(freq * 7, t)
  shaper.frequency.exponentialRampToValueAtTime(freq * 1.8, t + duration)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.004)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  body.connect(shaper)
  overtone.connect(shaper)
  shaper.connect(env)
  env.connect(bus)
  body.start(t)
  overtone.start(t)
  body.stop(t + duration + 0.05)
  overtone.stop(t + duration + 0.05)
}

// Pad lembut yang "mengembang": akord hangat di latar belakang.
function pad(freqs: number[], start: number, duration: number, gain = 0.07) {
  const context = ensureContext()
  if (!context || !bus) return
  const t = context.currentTime + start
  const shaper = context.createBiquadFilter()
  const env = context.createGain()
  shaper.type = 'lowpass'
  shaper.frequency.setValueAtTime(300, t)
  shaper.frequency.exponentialRampToValueAtTime(2600, t + duration * 0.55)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + duration * 0.4)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  shaper.connect(env)
  env.connect(bus)
  freqs.forEach((freq) => {
    ;[-7, 7].forEach((detune) => {
      const osc = context.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      osc.detune.value = detune
      osc.connect(shaper)
      osc.start(t)
      osc.stop(t + duration + 0.05)
    })
  })
}

// Ketukan kayu yang imut (dipakai untuk langkah kaki).
function woodTap(freq: number, start: number) {
  tone(freq * 1.5, start, 0.06, { gain: 0.38, endFreq: freq })
  noise(start, 0.03, { filter: 2400, q: 3, gain: 0.07 })
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

// Langkah kaki kecil "tuk-tuk-tuk-tuk" saat hero berjalan menuju target.
export function playWalk() {
  ;[700, 620, 740, 640].forEach((freq, i) => woodTap(freq, i * 0.17))
}

// Lompat: "wuuush" naik dengan petikan harpa berkilau.
export function playJump() {
  noise(0, 0.3, { filter: 500, filterEnd: 3600, q: 1.2, gain: 0.2 })
  ;[N.C5, N.E5, N.G5, N.C6, N.E6].forEach((freq, i) => harp(freq, i * 0.045, 0.4, 0.17))
}

// Bentuk target terkumpul: "pling-ling!" lonceng kristal.
export function playCollect() {
  bell(N.E6, 0, 0.55, 0.32)
  bell(N.A6, 0.09, 0.8, 0.32)
  noise(0.08, 0.15, { filter: 7000, gain: 0.05, kind: 'highpass' })
}

// Sampai di bendera: gerbang ajaib terbuka dengan pad yang mengembang dan glissando harpa.
export function playFlag() {
  pad([N.C4, N.E4, N.G4], 0, 1.5, 0.08)
  noise(0, 0.8, { filter: 300, filterEnd: 5000, q: 0.8, gain: 0.1 })
  ;[N.C4, N.E4, N.G4, N.C5, N.E5, N.G5, N.C6].forEach((freq, i) => harp(freq, 0.35 + i * 0.06, 0.7, 0.2))
  bell(N.C6, 0.85, 1.1, 0.24)
  bell(N.G6, 0.9, 1.1, 0.16)
}

// Jawaban benar: harpa naik, akord hangat, dan lonceng penutup.
export function playCorrect() {
  ;[N.C5, N.E5, N.G5, N.C6, N.E6].forEach((freq, i) => harp(freq, i * 0.06, 0.7, 0.22))
  pad([N.C5, N.E5, N.G5], 0.1, 0.9, 0.04)
  bell(N.C7, 0.32, 0.9, 0.15)
}

// Jawaban salah: "uh-oh" yang lembut dan ramah (tidak menakutkan untuk anak).
export function playWrong() {
  woodTap(300, 0)
  tone(392, 0.04, 0.24, { type: 'triangle', gain: 0.36, endFreq: 360 })
  tone(311, 0.26, 0.45, { type: 'triangle', gain: 0.36, endFreq: 255 })
  tone(155, 0.26, 0.45, { gain: 0.14, endFreq: 128 })
}

// Level selesai: glissando harpa, akord megah, melodi lonceng, dan confetti berkilau.
export function playComplete() {
  ;[N.C5, N.D5, N.E5, N.G5, N.A5, N.C6, N.D6, N.E6, N.G6, N.A6, N.C7].forEach((freq, i) => harp(freq, i * 0.05, 0.6, 0.18))
  pad([N.C4, N.E4, N.G4, N.C5], 0.1, 2.3, 0.075)
  ;[N.C6, N.E6, N.G6, N.C7].forEach((freq, i) => bell(freq, 0.65 + i * 0.13, i === 3 ? 1.5 : 0.6, 0.22))
  noise(0.65, 0.3, { filter: 4000, gain: 0.12, kind: 'highpass' })
  const sparkles = [N.C7, N.G6, N.E6, N.A6]
  for (let i = 0; i < 14; i += 1) bell(sparkles[i % sparkles.length], 0.9 + Math.random() * 1.4, 0.35, 0.07)
}

// Bunyi singkat saat slider volume dilepas.
export function playPreview() {
  bell(N.C6, 0, 0.5, 0.24)
}