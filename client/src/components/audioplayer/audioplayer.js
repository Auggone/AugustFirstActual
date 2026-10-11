import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({src, title}) {

  const audioRef = useRef(new Audio(src));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (e) => {
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const percent = clickX / bar.offsetWidth;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (t) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPercent = duration
    ? (currentTime / duration) * 100
    : 0;

  return (
    <div className="audio-player" style={{ width: 300 }}>
      <h1>{title}</h1>
      {/* Play / Pause */}
      <button onClick={togglePlay}>
        {isPlaying ? "❚❚ " : "▶︎"}
      </button>

      {/* Progress Bar */}
      <div
        onClick={seek}
        style={{
          marginTop: 10,
          height: 8,
          background: "#ddd",
          borderRadius: 4,
          cursor: "pointer",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "#4caf50",
            borderRadius: 4,
          }}
        />
      </div>

      {/* Time */}
      <div style={{ marginTop: 6, fontSize: 14 }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
