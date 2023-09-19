import { useEffect, useState, Fragment } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { Helmet } from "react-helmet";
import conf from "../config";

import { EpisodeProps, TvData, TvProps } from "../types/Media";

import loadImg from "../functions/loadImg";
import toYear from "../functions/toYear";

import MediaEpisodes from "../components/MediaEpisodes";
import MediaBackground from "../components/MediaBackground";
import MediaTabs from "../components/MediaTabs";
import MediaTrailer from "../components/MediaTrailer";
import PosterSection from "../components/PosterSection";

import Loading from "./Loading";

export default function Tv(){
  const nav = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<TvProps|null>();
  const [season, setSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<EpisodeProps[]|null>();
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
      type: "tv"
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
    setSeason(1);
    setEpisodes(null);
    setLoaded(false);

    const req = await fetch(`${conf.SHUTTLE_API}/v3/tv/${id}`);
    const res = await req.json();

    if(!("success" in res)){
      nav("/unavailable");
      return;
    }

    const nData:TvData = res.data;

    await loadImg(nData.images.backdrop);
    await loadImg(nData.images.logo);

    setEpisodes(nData.episodes);
    setData(res.data);
    setLoaded(true);
  }

  async function newSeason(nSeason:number){
    setEpisodes(null);
    setSeason(nSeason);

    const req = await fetch(`${conf.SHUTTLE_API}/v3/tv/${id}/episodes?s=${nSeason}`);
    const res = await req.json();

    if(!("success" in res)){
      nav("/unavailable");
      return;
    }

    setEpisodes(res.data);
  }

  useEffect(() => {
    loadData();

    loadList();
  }, [id]);

  if(!loaded){
    return <Loading />;
  }

  if(!data){
    return <Navigate to="/unavailable" />
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
          <img src={data.images.logo} alt={data.title} draggable="false" />
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
                <span>Series</span>
              }
            </div>

            <div className="media-details">
              <p>{toYear(data.date)}</p>
              <p>{data.seasons} Season{data.seasons > 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="media-actions">
            <Link to={`/player/${id}?s=${season}&e=1${data.seasons ? "&ms="+data.seasons : ""}${episodes ? "&me="+episodes.length : ""}`}>
              <button className="primary">
                <i className="fa-solid fa-play"></i>
                <p>S{season} E1</p>
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
          title: "Episodes",
          element: <MediaEpisodes id={data.id} season={season} setSeason={newSeason} seasons={data.seasons} episodes={episodes!} />
        },
        {
          title: "Suggested",
          element: <PosterSection posters={data.suggested} />
        }
      ]} />
    </Fragment>
  )
}