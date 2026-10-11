'use client'
import { useRef, useState } from 'react';
import coverImage2 from '../../assets/coverImage2.jpg';

export default function ArticlePage3() {
  

  return (
    <div>
      <img className="fullscreenImage" src={coverImage2} alt="Cover" />
      <h1>
        Purple is made of Red and Blue<br/>
        <div style={{ fontSize: "20px", fontWeight: 'normal' }}>
          September 21st, 2025  <br/>
          9:00 pm <br/>
          <div style={{ fontSize: "10px"}}>Written by August</div>
        </div>
      </h1>

    

      <p className="postContent">
        No man can ignore or forget his past because his past is what made him into the person he is today. <br/><br/>
        I know all of the bad things about me, but I cannot neglect them, hoping that they will starve to death. <br/><br/>
        I cannot flaunt my strengths without expecting others to realize the underlying adversity that they were built on. <br/><br/>
        What I can do is welcome all of it with open arms, and accept the parts of me I’d rather not. I can show them compassion and understanding, not giving them love, but not needlessly starving them. <br/><br/>
        And so exactly like everything else, it will all crumble and fall while it is being built to the sky. But those cracks and holes are more than just parts of the foundation, they are the characteristics that give life, that show you your own greatness despite the odds. <br/><br/>
        Only in the dust and ashes of what has fallen can we see what perceived awesomeness is truly made of.<br/><br/>
        For those who have lived and nearly died, those who have fought to stay alive, there is a resounding, almost unrelenting passion for the chaos of pain, and the love that it insinuates. <br/><br/>
        The protected will never understand, their resting place will be absent of those who know hell and how to defeat him. <br/><br/>
        Rest in peace to dead souls with living bodies.
      </p>
    </div>
  );
}
