import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom";

import conf from "../../config";

export default function NavBar(){
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobiOpen, setMobiOpen] = useState<boolean>(false);

  const mobiWrap = useRef<HTMLDivElement|null>(null);

  function mobiClick(){
    if(mobiOpen) setMobiOpen(false);
  }

  useEffect(() => {
    function click(e:Event){
      if(mobiWrap.current && !mobiWrap.current.contains(e.target as any)){
        setMobiOpen(false);
      }
    }

    function scroll(e:Event){
      window.scrollY > 10 ? setScrolled(true) : setScrolled(false);
    }

    window.addEventListener("click", click);
    window.addEventListener("scroll", scroll);

    return () => {
      window.removeEventListener("click", click);
      window.removeEventListener("scroll", scroll);
    }
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <Link to="/">
        <img className="logo" src="/assets/logo.png" alt={conf.SITE_TITLE} />
      </Link>

      <div className="links">
        <Link to="/">
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>

        <Link to="/search">
          <i className="fa-solid fa-search"></i>
          <span>Search</span>
        </Link>

        <Link to="/list">
          <i className="fa-solid fa-plus"></i>
          <span>List</span>
        </Link>

        <div className="mobile-wrap" ref={mobiWrap}>
          <i className="fa-solid fa-bars mobile-button" onClick={() => setMobiOpen(!mobiOpen)}></i>
          
          <div className={"mobile"+(mobiOpen ? " visible" : "")}>
            <Link to="/movies" onClick={() => mobiClick()}>
              <i className="fa-solid fa-film"></i>
              <span>Movies</span>
            </Link>

            <Link to="/series" onClick={() => mobiClick()}>
              <i className="fa-solid fa-tv-retro"></i>
              <span>Series</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}