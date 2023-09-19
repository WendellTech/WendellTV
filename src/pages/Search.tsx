import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import conf from "../config";

import PosterOptions from "../types/PosterOptions";

export default function Search(){
  const [query, setQuery] = useState<string|null>();
  const [error, setError] = useState<string|null>();
  const [results, setResults] = useState<PosterOptions[]|null>();
  const [inputClicked, setInputClicked] = useState(false);

  async function loadResults(){
    if(!query || !query.length){
      setError(null);
      setResults(null);
      return;
    }

    if(query.length < 3){
      setError(null);
      setResults(null);
      return;
    }

    const req = await fetch(`${conf.SHUTTLE_API}/v3/search?query=${query}`);
    const res = await req.json();

    if("error" in res){
      setResults(null);
      setError(res.error);
      return;
    }

    if(!("data" in res)){
      setResults(null);
      setError("Unexpected search error, please try again.");
      return;
    }

    setError(null);
    setResults(res.data);
  }

  useEffect(() => {
    loadResults();
  }, [query]);

  return (
    <Fragment>
      <Helmet>
        <title>{query ? query : "Search"} - {conf.SITE_TITLE}</title>
      </Helmet>

      <div className={`search-input ${inputClicked ? "input-clicked" : ""}`}>
        {/* Apply the 'fade-placeholder' class when input is clicked */}
        <input
          type="text"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => setInputClicked(true)} // Update the state when the input is clicked
          placeholder="Search for movies and series"
        />

        {query && (
          <i className="fa-regular fa-xmark" onClick={() => setQuery(null)}></i>
        )}
      </div>

      {
        error ?
        <div className="search-center">
          <i className="fa-solid fa-warning warning"></i>
          <p>{error}</p>
        </div>
        :
        (
          (results && results.length)
          ?
          <Fragment>
            <p className="search-title">Results</p>

            <div className="search-results">
              {
                results.map((v, i) => {
                  return <Link className='poster' key={i} title={v.title} to={`/${v.type}/${v.id}`} style={{backgroundImage: `url('${v.image}')`}}></Link>
                })
              }
            </div>
          </Fragment>
          :
          <div className="search-center">
            <i className="fa-solid fa-camera-movie"></i>
            <p>Search for movies & series</p>
          </div>
        )
      }
      
    </Fragment>
  );
}