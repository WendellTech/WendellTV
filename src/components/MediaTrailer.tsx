import { useEffect, useRef, useState } from "react";

interface MediaTrailerProps{
  url: string;
  visible: boolean;
  onClose: () => void;
}

export default function MediaTrailer({ url, visible, onClose }: MediaTrailerProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const embedUrl = getEmbedSource(url);

  function getEmbedSource(url: string){
    try{
      const parsed = new URL(url);
      
      if(parsed.pathname.startsWith("/embed")){
        return url;
      }

      if(parsed.pathname.startsWith("/watch")){
        if(!parsed.searchParams.has("v")){
          return null;
        }

        return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}?autoplay=1`;
      }

      return null;
    }
    catch(e){
      return null;
    }
  };

  useEffect(() => {
    if(!visible){
      return;
    }

    function onMouseDown(event: MouseEvent){
      const target = event.target as Node;

      if (ref.current && !ref.current.contains(target)) {
        onClose && onClose();
      }
    };

    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="trailer">
      <iframe
        src={embedUrl}
        allow="autoplay; encrypted-media; fullscreen;"
        allowFullScreen
        ref={ref}
      ></iframe>
    </div>
  );
}
