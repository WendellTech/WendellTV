import { Fragment } from "react";
import { Helmet } from "react-helmet";
import conf from "../config";

export default function Loading(){
  return (
    <Fragment>
      <Helmet>
        <title>Loading - {conf.SITE_TITLE}</title>
      </Helmet>

      <div className="loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner-third"></i>
        </div>
      </div>
    </Fragment>
  )
}