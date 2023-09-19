import { useEffect, useState } from "react"

interface MediaBackgroundProps{
  backdrop: string;
}

export default function MediaBackground({backdrop}:MediaBackgroundProps){
  const [opactiy, setOpacity] = useState<number>(1);

  function onScroll(e:Event){
    if(window.scrollY > 140){
      return;
    }

    if(window.scrollY < 10){
      setOpacity(1);
      return;
    }

    let nOpacity = 100 - (window.scrollY / 2);

    if(nOpacity < 50){
      nOpacity = 50;
    }

    setOpacity(nOpacity / 100);
  }

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    }
  }, []);

  return (
    <div className="media-back">
      <div className="media-backdrop" style={{backgroundImage: `url('${backdrop}')`, opacity: opactiy}}></div>
    </div>
  )
}