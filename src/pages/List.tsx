import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import conf from "../config";

import Error from "./Error";
import Loading from "./Loading";
import PosterOptions from "../types/PosterOptions";

export default function List(){
  const [list, setList] = useState<PosterOptions[]>();

  function loadList(){
    let storage = localStorage.getItem("list");
    let list = storage ? JSON.parse(storage) : [];

    setList(list);
  }

  useEffect(() => {
    loadList();
  }, []);

  if(!list){
    return <Loading />;
  }

  if(!list.length){
    return <Error message="Your list is empty" />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>List | {conf.SITE_TITLE}</title>
      </Helmet>

      <div className="list">
        <h1 className="list-title">Your Watchlist</h1>

        <div className="list-grid">
          {
            list.map((v:any, i:number) => {
              return <Link
              key={i}
              className='poster'
              to={`/${v.type}/${v.id}`}
              style={{backgroundImage:`url('${v.image}')`}}></Link>
            })
          }
        </div>
      </div>
    </Fragment>
  )
}