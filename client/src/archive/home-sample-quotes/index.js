// features/home-sample-quotes
// The quote cards on the sample homepage (/home-sample): each photo with its
// quote beside it. Fills the "home-sample-quotes" slot, under the wallpaper
// swatches (Pages/HomeSample/homesample.js); styles in quotes.css.
import fishing from "../../assets/fishingstars.jpeg";
import pinkTree from "../../assets/pinktree.jpg";
import mollyBloom from "../../assets/mollybloom.jpg";
import museumCeiling from "../../assets/museumceiling.jpg";
import "./quotes.css";

function SampleQuotes() {
  return (
    <section className="hs-quotes">

      {/* PORTRAIT RIGHT — image on the left, text on the right */}
      <div className="hs-card portrait right">
        <img className="hs-image" src={fishing} alt="Fishing for Stars" />
        <div className="hs-text">
          <span className="hs-subquote">
            When he sacrifices himself, man for a moment is greater than God,{" "}
            <br /> for how can God, infinite and omnipotent, sacrifice himself?
          </span>
        </div>
      </div>

      {/* PORTRAIT — text on the left, image on the right */}
      <div className="hs-card portrait">
        <img className="hs-image" src={pinkTree} alt="Pink Tree" />
        <div className="hs-text">
          <span className="hs-subquote">
            But man is not made for defeat. A man can be destroyed, but never
            defeated. <br /><br /> Beautiful pink trees stand tall beside dead people.
          </span>
        </div>
      </div>

      {/* PORTRAIT — text on the left, image on the right */}
      <div className="hs-card portrait">
        <img className="hs-image" src={mollyBloom} alt="Molly Bloom" />
        <div className="hs-text">
          <span className="hs-subquote">
            To see, we must forget the name of the thing we are looking at.
          </span>
        </div>
      </div>

      {/* LANDSCAPE — text on top, image underneath */}
      <div className="hs-card landscape">
        <img className="hs-image" src={museumCeiling} alt="Museum Ceiling" />
        <div className="hs-text">
          <span className="hs-subquote">
            Everyday that we don't look up at the sky, we are partaking in a
            punishment previously reserved for prisoners.
          </span>
        </div>
      </div>

    </section>
  );
}

const feature = {
  name: "home-sample-quotes",
  slots: {
    "home-sample-quotes": SampleQuotes,
  },
};

export default feature;
