import { Link } from "react-router-dom";
import { EpisodeProps } from "../types/Media"

interface EpisodeCardProps{
  id: string;
  number: string|number;
  season: number;
  maxSeasons: number;
  maxEpisodes: number;
  image: string;
  title: string;
  runtime: number;
}

interface EpisodesSectionProps{
  id: string;
  season: number;
  setSeason: (value:number) => void;
  seasons: number;
  episodes: EpisodeProps[]|null
}

function EpisodeHolder(){
  return (
    <div className="card">
      <div className="image">
        <img style={{border: 0}} />
      </div>
    </div>
  )
}

function EpisodeCard({id, number, season, maxSeasons, maxEpisodes, image, title, runtime}:EpisodeCardProps){
  return (
    <Link className="card" to={`/player/${id}?s=${season}&e=${number}&ms=${maxSeasons}&me=${maxEpisodes}`}>
      <div className="image">
        <img src={image} alt="" />
        
        <button>
          <i className="fa-solid fa-play"></i>
        </button>
      </div>

      <p className="title">{number}. {title} ({runtime}m)</p>
    </Link>
  )
}

export default function EpisodesSection({id, season, setSeason, seasons, episodes}:EpisodesSectionProps){
  return (
    <div className="media-episodes">
      <div className="row">
        {
          [...Array(seasons)].map((v, i) => {
            return (
              <button
              key={i}
              onClick={i+1 === season ? undefined : () => setSeason(i+1)}
              className={"selector"+(i+1 === season ? " active" : "")}>Season {i+1}</button>
            )
          })
        }
      </div>

      <div className="row cards">
        {
          episodes ?
          episodes.map((v, i) => {
            return (
              <EpisodeCard
              key={i}
              id={id}
              number={v.number}
              season={season}
              maxSeasons={seasons}
              maxEpisodes={episodes.length}
              runtime={v.runtime}
              title={v.title}
              image={v.image} />
            )
          }) :
          <EpisodeHolder />
        }
      </div>
    </div>
  )
}