import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faVolumeUp,
  faVolumeDown,
  faBackward,
  faForward,
} from "@fortawesome/free-solid-svg-icons";

const AudioPlayer = ({
  url,
  onNextEpisode,
  onBackwardEpisode,
  titleEpisode,
  podcastImage,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Store as number
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    // Handler for when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Handler for time updates
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    // Handler for when audio ends
    const handleEnded = () => {
      if (onNextEpisode) {
        onNextEpisode();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
      }
    };

    // Attach event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onNextEpisode]);

  useEffect(() => {
    if (url) {
      const audio = audioRef.current;
      audio.src = url;
      audio.volume = volume;

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error auto-playing the audio:", error);
        });
    }
  }, [url]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing the audio:", error);
        });
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(newProgress);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleBackward5Seconds = () => {
    const audio = audioRef.current;
    const newTime = Math.max(audio.currentTime - 5, 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / audio.duration) * 100);
  };

  const handleForward5Seconds = () => {
    const audio = audioRef.current;
    const newTime = Math.min(audio.currentTime + 5, audio.duration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / audio.duration) * 100);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-primary text-white rounded-lg shadow-lg p-4">
      <h3 className="text-xl font-bold pb-4">{titleEpisode}</h3>
      <div className="flex items-center mb-4 justify-center">
        <img
          src={podcastImage}
          alt="Podcast Cover"
          className="rounded-md bg-center bg-cover w-auto h-auto"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        {onBackwardEpisode && (
          <button
            onClick={onBackwardEpisode}
            className="text-white hover:text-contrast"
          >
            <FontAwesomeIcon icon={faBackwardStep} size="lg" />
          </button>
        )}
        <button
          onClick={handleBackward5Seconds}
          className="text-white hover:text-contrast pl-2"
        >
          <FontAwesomeIcon icon={faBackward} size="lg" />
        </button>
        <button
          onClick={togglePlayPause}
          className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
        </button>
        <button
          onClick={handleForward5Seconds}
          className="text-white hover:text-contrast pr-2"
        >
          <FontAwesomeIcon icon={faForward} size="lg" />
        </button>
        {onNextEpisode && (
          <button
            onClick={onNextEpisode}
            className="text-white hover:text-contrast"
          >
            <FontAwesomeIcon icon={faForwardStep} size="lg" />
          </button>
        )}
      </div>

      <div>
        <input
          type="range"
          value={progress}
          onChange={handleProgressChange}
          className="w-full appearance-none bg-contrast rounded-lg h-1 focus:outline-none"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <FontAwesomeIcon
          icon={volume > 0.5 ? faVolumeUp : faVolumeDown}
          className="size-5"
        />
        <input
          type="range"
          value={volume}
          min="0"
          max="1"
          step="0.01"
          onChange={handleVolumeChange}
          className="w-11/12 appearance-none bg-contrast rounded-lg h-1 focus:outline-none"
        />
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

const formatTime = (time) => {
  if (!time || isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default AudioPlayer;
