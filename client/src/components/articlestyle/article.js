import './article.css'
import Header from '../header/header'
import { Outlet } from 'react-router-dom';



export default function ArticleStyle(){

  return (
    <>
      <Header/>
      
      <div style = {{paddingTop: '50px'}}></div>
    <main> <Outlet />  
      </main> 
      
      
    </>
  );
}



