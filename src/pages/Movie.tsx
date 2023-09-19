import { Fragment, useEffect, useState } from "react"
import { useNavigate, useParams, Link, Navigate } from "react-router-dom"
import { Helmet } from "react-helmet";

import conf from "../config";

import { MovieProps } from "../types/Media";

import loadImg from "../functions/loadImg";
import toHM from "../functions/toHM";
import toYear from "../functions/toYear";

import MediaBackground from "../components/MediaBackground";
import MediaTabs from "../components/MediaTabs";
import MediaTrailer from "../components/MediaTrailer";
import PosterSection from "../components/PosterSection";

import Loading from "./Loading";

export default function Movie(){
  const nav = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<MovieProps|null>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [trailer, setTrailer] = useState<boolean>(false);
  const [listed, setListed] = useState<boolean>(false);

  function onTrailerClick(){
    setTrailer(true);
  }

  function onTrailerClose(){
    setTrailer(false);
  }

  function onListClick(){
    if(!data) return;

    let storage = localStorage.getItem("list");
    let list = storage ? JSON.parse(storage) : [];

    if(list.length && list.find((v:any) => v.id === data.id)){
      list = list.filter((v:any) => v.id !== data.id);
      localStorage.setItem("list", JSON.stringify(list));

      setListed(false);

      return;
    }

    let poster = {
      id: data.id,
      title: data.title,
      image: data.images.poster,
      type: "movie"
    }

    localStorage.setItem("list", JSON.stringify([poster, ...list]));
    
    setListed(true);
  }

  function loadList(){
    setListed(false);

    if(!id) return;

    let storage = localStorage.getItem("list");
    let list = storage ? JSON.parse(storage) : [];

    if(list.length && list.find((v:any) => v.id === parseInt(id))){
      setListed(true);
    }
  }

  async function loadData(){
    setData(null);
    setLoaded(false);

    const req = await fetch(`${conf.SHUTTLE_API}/v3/movie/${id}`);
    const res = await req.json();

    if(!("success" in res)){
      nav("/unavailable");
      return;
    }

    const nData:MovieProps = res.data;

    await loadImg(nData.images.backdrop);
    await loadImg(nData.images.logo);

    setData(res.data);
    setLoaded(true);
  }

  useEffect(() => {
    loadData();

    loadList();
  }, [id]);

  if(!loaded){
    return <Loading />;
  }

  if(!data){
    return <Navigate to="/unavailable" />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>{data.title} - {conf.SITE_TITLE}</title>
      </Helmet>

      <MediaTrailer visible={trailer} onClose={() => onTrailerClose()} url={data.trailer} />
      
      <MediaBackground backdrop={data.images.backdrop} />
    
      <div className="media-content">
        <div className="media-logo">
          <img src={data.images.logo} title={data.title} alt={data.title} draggable="false" />
        </div>

        <div className="media-main">
          {
            data.tagline &&
            <p className="media-tagline">{data.tagline}</p>
          }

          <div className="media-meta">
            <div className="media-genres">
              {
                data.genres.length ?
                data.genres.map((v, i) => <span key={i}>{v}</span>) :
                <span>Movie</span>
              }
            </div>

            <div className="media-details">
              <p>{toYear(data.date)}</p>
              <p>{toHM(data.runtime)}</p>
            </div>
          </div>

          <div className="media-actions">
            <Link to={`/player/${data.id}`}>
              <button className="primary">
                <i className="fa-solid fa-play"></i>
                <p>Play</p>
              </button>
            </Link>

            <button className="secondary" onClick={() => onTrailerClick()}>
              <i className="fa-solid fa-camera-movie"></i>
              <p>Trailer</p>
            </button>
            
            <button className={`icon ${listed ? "secondary" : "primary"}`} onClick={() => onListClick()}>
              {
                listed ?
                <i className="fa-solid fa-check"></i> :
                <i className="fa-solid fa-plus"></i>
              }
            </button>
          </div>

          <p className="media-description">{data.description}</p>
        </div>
      </div>

      <MediaTabs
      tabs={[
        {
          title: "Suggested",
          element: <PosterSection posters={data.suggested} />
        }
      ]} />
    </Fragment>
  )
}