// features/music-button
// The "Let It All Work Out" player: fixed in the top-right corner on desktop,
// collapsed to a play button in the mobile nav stack.
import AudioPlayer from "../../components/audioplayer/audioplayer";
import song from "../../assets/letitallworkout.mp3";
import "./musicButton.css";

function CornerPlayer() {
  return (
    <div className="audio-corner">
      <AudioPlayer src={song} title="Let It All Work Out" />
    </div>
  );
}

function MobilePlayer() {
  return <AudioPlayer src={song} title="Let It All Work Out" />;
}

const feature = {
  name: "music-button",
  slots: {
    "home-corner": CornerPlayer,
    "home-mobile-nav": MobilePlayer,
  },
};

export default feature;
