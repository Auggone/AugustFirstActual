
import Piano1 from "../../../../../../assets/Soyoucanseestrings.mp3";
import Piano2 from "../../../../../../assets/PianoDrums.wav";
import AudioPlayer from '../../../../../../components/audioplayer/audioplayer';
import augbencam from '../../../../../../assets/augbencam.jpg';
import './jan06.css';


export default function Jan06() {

  return (

  <>
    < >
    
    <div style = {{paddingTop: '3%'}}> Check these samples out and check out my  <br></br>youtube: </div><a href = "https://www.youtube.com/@AugustDiStefano" target = "_blank" rel = "noopener noreferrer">
      https://www.youtube.com/@AugustDiStefano 
    </a>
    
    <div  style = {{paddingTop: '5%'}}>
      <AudioPlayer src = {Piano1} title = {'Noir Piano Sample'} />
      <AudioPlayer src = {Piano2} title = {'Piano Strings Sample'}/>
      </div>
    </>
      <div>

        <img src = {augbencam} alt = 'Photo here'
        className = {'image'}
      />
      <div><br></br>
        <br></br>
        
        
      
      
      </div>
      </div>

    </>

  )

  

  


}
