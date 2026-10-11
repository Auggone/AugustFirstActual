import React from "react";
import "./newhome.css";
import fishing from "../../../assets/fishingstars.jpeg";
import mollybloom from "../../../assets/mollybloom.jpg";
import museumceiling from "../../../assets/museumceiling.jpg";
import oroborous from "../../../assets/oroborus.jpg";
import NavBarTwo from "./navbartwo.js";
import SocialLinks from "../../../components/links/links.js";
import PinkTree from "../../../assets/pinktree.jpg";
import AudioPlayer from "../../../components/audioplayer/audioplayer.js";
import Wayne from "../../../assets/letitallworkout.mp3";

export default function NewHomePage() {
  return (
    <main className="page-wrapper">

      <div className="audio-corner">
        <AudioPlayer src = {Wayne} title = "Let It All Work Out"/>
        </div>

      {/* Mobile-only nav stack — hidden on desktop via CSS */}
      <div className="mobile-nav-stack">
        <NavBarTwo />
        <SocialLinks />
        <AudioPlayer src = {Wayne} title = "Let It All Work Out"/>
      </div>

      <section className="recent-section">

        <div className="recent-content portrait right">
          <img
            className="content-image"
            src={fishing}
            alt="Fishing for Stars"
          />
          <div className="content-text">
            <span className="subquote"> When he sacrifices himself, man for a moment is greater than God, <br></br> for how can God, infinite and omnipotent, sacrifice himself?  </span>
          </div>
        </div>

        <div className="recent-content portrait">
          <img
            className="content-image"
            src={PinkTree}
            alt="Pink Tree"
          />
          <div className="content-text">
           {/*} <h2>There are cathedrals everywhere for those with the eyes to see them</h2>
            <p>Inspiration is what matters, and people argue that its difficult to find. I disagree.</p>*/}
            <span className="subquote"> But man is not made for defeat. A man can be destroyed, but never defeated. <br></br><br></br> Beautiful pink trees stand tall beside dead people. </span>
           {/* <span className="caption"> <br /> This is a Claude Monet quote. <br /> Monet was cool, he painted a lot of flowers. <br /> Towards the end of his life he started to go blind, his paintings of flower fields began to look like color orgasms. </span> */}
          </div>
        </div>
        
        {/* OVERLAY — full image with centered text on top */}
<div className="recent-content fullportrait">
  <div className="content-text">
    <span className="subquote">The snake that eats its own tail is a symbol of eternity, the cycle of life, the interconnectedness of all things.</span>
  </div>
  <img
    className="content-image"
    src={oroborous}
    alt="Your description here"
  />
  
  
</div>

        {/* PORTRAIT — image on right, text on left */}
        <div className="recent-content portrait">
          <img
            className="content-image"
            src={mollybloom}
            alt="Molly Bloom"
          />
          <div className="content-text">
           {/*} <h2>There are cathedrals everywhere for those with the eyes to see them</h2>
            <p>Inspiration is what matters, and people argue that its difficult to find. I disagree.</p>*/}
            <span className="subquote"> To see, we must forget the name of the thing we are looking at. </span>
           {/* <span className="caption"> <br /> This is a Claude Monet quote. <br /> Monet was cool, he painted a lot of flowers. <br /> Towards the end of his life he started to go blind, his paintings of flower fields began to look like color orgasms. </span> */}
          </div>
        </div>

        {/* LANDSCAPE — image on bottom, text on top */}
        <div className="recent-content landscape">
          <img
            className="content-image"
            src={museumceiling}
            alt="Museum Ceiling"
          />
          <div className="content-text">
            <span className="subquote">Everyday that we don't look up at the sky, we are partaking in a punishment previously reserved for prisoners.</span>
          </div>
        </div>

        

      </section>

    </main>
  );
}