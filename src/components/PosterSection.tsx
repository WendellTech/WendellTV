import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import PosterOptions from "../types/PosterOptions";

interface PosterProps extends PosterOptions{
  Ref?: any;
}

interface SectionProps{
  title?: string;
  posters: PosterOptions[]
}

function Poster({id, image, type, Ref}:PosterProps){
  return (
    <Link
    ref={Ref}
    className='poster'
    to={`/${type}/${id}`}
    style={{backgroundImage:`url('${image}')`}}></Link>
  );
}

export default function PosterSection({title, posters}:SectionProps){
  const swiper = useRef(null);
  const poster = useRef(null);

  const [index, setIndex] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [viewable, setViewable] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const [transform, setTransform] = useState<number>(0);

  function onBack(){
    const newIndex = index - 2;
    const newTransform = (width + 20) * newIndex;

    if(newTransform < 0){
      setIndex(0);
      setTransform(0);  
      return
    };

    setIndex(newIndex);
    setTransform(newTransform);
  }

  function onNext(){
    let newIndex = index + 2;
  
    if(newIndex > count - viewable){
      newIndex = count - viewable
    }

    setIndex(newIndex);
    setTransform(newIndex * (width + 20));
  }

  //On resize set poster width and number of VIEWABLE children
  function onResize(){
    if(poster.current){
      const p = poster.current as HTMLDivElement;

      const w = p.clientWidth;

      if(w){
        const v = Math.floor((window.innerWidth * 0.9)  / w);

        setWidth(w);
        setViewable(v > 6 ? 6 : v);
      }
    }
  }

  //When swiper has ref, set number of children
  function onLoad(){
    if(swiper.current){
      const sw = swiper.current as HTMLDivElement;

      if(sw.children.length){
        setCount(sw.children.length);
      }
    }
  }

  useEffect(() => onLoad(), [swiper]);

  useEffect(() => {
    if(!poster.current) return;

    onResize();

    window.addEventListener("resize", onResize);  
    return () => window.removeEventListener("resize", onResize);
  }, [poster]);

  return (
    <div className='poster-section'>
    {title && (
      <div className="head">
        <p className='title'>{title}</p>
      </div>
    )}
    
    {title && <div className="white-line"></div>}

      <div className='row'>
        <div
        ref={swiper}
        className="swiper"
        style={{
          transform: `translateX(-${transform}px)`
        }}>
          {
            posters.map((v, i) => {
              return (
                <Poster key={i} Ref={i === 0 ? poster : undefined} {...v} />
              )
            })
          }
        </div>

        <div className={"row-back"+(index > 0 ? " visible" : "")} onClick={() => onBack()}>
          <i className="fa-regular fa-angle-left"></i>
        </div>
        
        <div className={"row-next"+(index < count - viewable  ? " visible" : "")} onClick={() => onNext()}>
          <i className="fa-regular fa-angle-right"></i>
        </div>
      </div>
    </div>
  )
}