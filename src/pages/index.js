import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Cardcomponent from "../components/Card";
import { Button, Card } from "@material-ui/core";
import "./styles.css";

const GET_BOOKMARKS = gql`
  {
    bookmarks {
      id
      url
      title
    }
  }
`;

const ADD_BOOKMARK = gql`
  mutation addBookmar($url: String!, $title: String!) {
    addBookmark(url: $url, title: $title) {
      id
    }
  }
`;

export default function Home() {
  let titleField;
  let urlField;

  const { loading, error, data } = useQuery(GET_BOOKMARKS);

  console.log(data);

  const [addBookmark] = useMutation(ADD_BOOKMARK);

  const handleSubmit = () => {
    addBookmark({
      variables: {
        url: urlField.value,
        title: titleField.value,
      },
      refetchQueries: [{ query: GET_BOOKMARKS }],
    });

    titleField.value = "";
    urlField.value = "";
  };

  if (loading) return <h2 className="Loding_contain">Loading..</h2>;

  if (error) {
    return <h2>Error</h2>;
  }

  return (
    <div className="main_div">
      <Card width={"100%"} borderRadius={24} height={160}>
        <div className="header">
          <h2>Add New Bookmark</h2>
        </div>
        <div className="content_body">
          Enter Bookmark Tite: <br />
          <input
            type="text"
            className="input-text"
            ref={(node) => (titleField = node)}
            placeholder="Title name"
          />
          Enter Bookmark Url: <br />
          <input
            type="text"
            className="input-text"
            ref={(node) => (urlField = node)}
            placeholder="Site Url"
          />
        </div>
        <div className="btn">
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Add Bookmark
          </Button>
        </div>

        <div className="footer">
          <h2>My Bookmark List</h2>

          <div>
            {data.bookmarks.map((list) => {
              return (
                <div key={list.id}>
                  <Cardcomponent url={list.url} title={list.title} />
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
