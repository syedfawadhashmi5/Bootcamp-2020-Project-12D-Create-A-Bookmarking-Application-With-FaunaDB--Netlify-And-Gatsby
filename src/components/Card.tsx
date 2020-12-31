import React from "react";
import { Card, Grid } from "@material-ui/core";

function CardComponent(props) {
  console.log("sadasdd", props);

  return (
        <div className='card-container'>
          <h1>{props.title}</h1>
          <h3>{props.url}</h3>
        </div>

  );
}

export default CardComponent;
