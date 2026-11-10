export const STEP_SECONDS = 2.2;
export const STEP_COUNT = 6;
const NA_PER_CYCLE = 3;
const K_PER_CYCLE = 2;
const BAR_START = 0.35;
const BAR_PER_CYCLE = 0.06;

export function createPumpState() {
  const state = { step: 0, progress: 0, naOut: 0, kIn: 0, atp: 0, cycles: 0 };

  function finishStep() {
    if (state.step === 1) state.atp += 1;
    if (state.step === 2) state.naOut += NA_PER_CYCLE;
    if (state.step === 5) {
      state.kIn += K_PER_CYCLE;
      state.cycles += 1;
    }
    state.step = (state.step + 1) % STEP_COUNT;
    state.progress = 0;
  }

  function advance(seconds) {
    state.progress += seconds / STEP_SECONDS;
    while (state.progress >= 1) finishStep();
  }

  function nextStep() {
    finishStep();
  }

  function reset() {
    Object.assign(state, { step: 0, progress: 0, naOut: 0, kIn: 0, atp: 0, cycles: 0 });
  }

  function bars() {
    const level = Math.min(1, BAR_START + state.cycles * BAR_PER_CYCLE);
    return { naOutside: level, kInside: level };
  }

  return { state, advance, nextStep, reset, bars };
}
