import PosterOptions from "./PosterOptions"

interface MediaProps{
  id: string,
  title: string,
  description: string,
  tagline?: string,
  genres: string[],
  date: string,
  suggested: PosterOptions[],
  trailer: string,
  images: {
    backdrop: string,
    logo: string,
    poster: string
  }
}

export interface MovieProps extends MediaProps{
  runtime: number
}

export interface TvData extends MediaProps{
  seasons: number,
  episodes: EpisodeProps[]
}

export interface TvProps extends MediaProps{
  seasons: number
}

export interface EpisodeProps{
  number: string|number,
  image: string,
  title: string,
  runtime: number
}