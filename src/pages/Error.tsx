import { Fragment } from "react";
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet";
import conf from "../config";

interface ErrorProps{
  message: string;
}

export default function Error({message}:ErrorProps){
  return (
    <Fragment>
      <Helmet>
        <title>Error - {conf.SITE_TITLE}</title>
      </Helmet>

      <div className="error-container">
        <i className="fa-solid fa-exclamation-circle"></i>
        
        <p>{message}</p>
        
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
    </Fragment>
  )
}