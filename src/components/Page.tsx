import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Page({children}:any){
  const loc = useLocation();

  useEffect(() => {
    if(window.scrollY > 0){
      window.scrollTo(0, 0);
    }
  }, [loc]);

  return (
    <div className="page">{children}</div>
  )
}