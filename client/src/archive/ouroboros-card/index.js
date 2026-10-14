// features/ouroboros-card
// The ouroboros quote card from the homepage's old list of cards: the image
// fills the card, with the quote along the bottom. It filled the
// "home-quotes-middle" slot, which went away when the homepage switched to
// swatches that open into cards (Pages/HomePageV2/homev2.js); to bring it
// back, add it to that page's WALLPAPERS list instead. The card styles it
// used (.quote-card) went with the old list; the full-image layout is in
// ouroboros.css.
import oroborus from "../../assets/oroborus.jpg";
import "./ouroboros.css";

function OuroborosCard() {
  return (
    <div className="quote-card full">
      <img className="quote-image" src={oroborus} alt="Ouroboros" />
      <div className="quote-text">
        <span className="subquote">
          The snake that eats its own tail is a symbol of eternity, the cycle
          of life, the interconnectedness of all things.
        </span>
      </div>
    </div>
  );
}

const feature = {
  name: "ouroboros-card",
  slots: {
    "home-quotes-middle": OuroborosCard,
  },
};

export default feature;
