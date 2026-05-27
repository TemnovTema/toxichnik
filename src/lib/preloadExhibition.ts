const MODEL_PATH = "/models/toxoc-1.glb";
const AUDIO_PATH = "/audio/hollow-white-silence.mp3";

export type PreloadStage = {
  progress: number;
  label: string;
};

export async function preloadExhibition(
  onStage: (stage: PreloadStage) => void,
): Promise<void> {
  const stage = (progress: number, label: string) =>
    onStage({ progress, label });

  stage(4, "инициализация");

  await import("@react-three/fiber");
  stage(22, "инициализация");

  const { useGLTF } = await import("@react-three/drei");
  stage(36, "загрузка объекта");

  await preloadModel(useGLTF.preload, (ratio) => {
    stage(36 + ratio * 48, "загрузка объекта");
  });

  stage(88, "подготовка пространства");

  await import("@/components/exhibition/ExhibitionCanvas");
  stage(94, "подготовка пространства");

  await import("@/components/exhibition/ExhibitionPostFX");
  stage(96, "подготовка пространства");

  await preloadAudio();
  stage(99, "подготовка пространства");

  await pause(420);
  stage(100, "вход");
}

function preloadAudio(): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(AUDIO_PATH);
    audio.preload = "auto";

    const finish = () => resolve();
    const fail = () => reject(new Error("Audio preload failed"));

    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("error", fail, { once: true });
    audio.load();
  });
}

function pause(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function preloadModel(
  preload: (
    path: string,
    useDraco?: boolean,
    useMeshopt?: boolean,
  ) => unknown,
  onRatio: (ratio: number) => void,
): Promise<void> {
  onRatio(0.04);

  const startedAt = performance.now();
  let frame = 0;

  const tick = () => {
    const elapsed = performance.now() - startedAt;
    const estimated = Math.min(0.9, elapsed / 5200);
    onRatio(Math.max(estimated, 0.04));
    frame = window.requestAnimationFrame(tick);
  };

  frame = window.requestAnimationFrame(tick);

  try {
    await preload(MODEL_PATH, false, true);
    onRatio(1);
  } finally {
    window.cancelAnimationFrame(frame);
  }
}
