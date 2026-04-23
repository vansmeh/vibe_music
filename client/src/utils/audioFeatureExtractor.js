// audioFeatureExtractor.js
// Computes simple audio features from a raw Float32Array buffer:
// - RMS energy
// - Spectral centroid (Hz)
// - Zero Crossing Rate (per sample)

function nextPow2(v) {
  return 1 << Math.ceil(Math.log2(v));
}

function hannWindow(N) {
  const w = new Float32Array(N);
  for (let n = 0; n < N; n++) w[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
  return w;
}

// In-place radix-2 Cooley-Tukey FFT on real/imag arrays
function fft(real, imag) {
  const n = real.length;
  if (n <= 1) return;
  const levels = Math.log2(n) | 0;
  if (1 << levels !== n) throw new Error('FFT length must be power of 2');

  // bit-reversed addressing permutation
  for (let i = 0; i < n; i++) {
    let j = 0;
    for (let k = 0; k < levels; k++) j = (j << 1) | ((i >>> k) & 1);
    if (j > i) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }

  for (let size = 2; size <= n; size <<= 1) {
    const halfSize = size >> 1;
    const tableStep = (2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let j = 0; j < halfSize; j++) {
        const k = i + j;
        const l = k + halfSize;
        const angle = -j * tableStep;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const tre = cos * real[l] - sin * imag[l];
        const tim = sin * real[l] + cos * imag[l];
        real[l] = real[k] - tre;
        imag[l] = imag[k] - tim;
        real[k] += tre;
        imag[k] += tim;
      }
    }
  }
}

export function computeFeatures(buffer, sampleRate = 44100) {
  // buffer: Float32Array (mono)
  if (!buffer || buffer.length === 0) return { energy: 0, centroid: 0, zcr: 0 };

  const N = buffer.length;

  // Energy (RMS)
  let sumSq = 0;
  for (let i = 0; i < N; i++) {
    const v = buffer[i];
    sumSq += v * v;
  }
  const rms = Math.sqrt(sumSq / N);

  // Zero Crossing Rate
  let crossings = 0;
  let prev = buffer[0];
  for (let i = 1; i < N; i++) {
    const cur = buffer[i];
    if ((prev >= 0 && cur < 0) || (prev < 0 && cur >= 0)) crossings++;
    prev = cur;
  }
  const zcr = crossings / (N - 1);

  // Spectral Centroid: use FFT magnitude
  // Window the signal
  const fftSize = nextPow2(N);
  const window = hannWindow(N);
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  for (let i = 0; i < N; i++) real[i] = buffer[i] * window[i];
  for (let i = N; i < fftSize; i++) real[i] = 0;

  fft(real, imag);

  // compute magnitudes for first half
  const half = fftSize / 2;
  let magSum = 0;
  let centroidNumer = 0;
  for (let k = 0; k < half; k++) {
    const re = real[k];
    const im = imag[k];
    const mag = Math.sqrt(re * re + im * im);
    const freq = k * (sampleRate / fftSize);
    magSum += mag;
    centroidNumer += freq * mag;
  }
  const centroid = magSum > 0 ? centroidNumer / magSum : 0;

  return { energy: rms, centroid, zcr };
}

export default { computeFeatures };
