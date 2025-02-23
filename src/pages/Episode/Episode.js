import React, { Component } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import * as routes from "../../constants/routes";

import Layout from "../../components/Layout";
import EpisodeCard from "../../components/EpisodeCard";
import CharacterCard from "../../components/CharacterCard";

class Episode extends Component {
  constructor(props) {
    super(props);
    const {id} = props.match.params
    this.state = {
      episode: id,
      characters: [],
      hasLoaded: false,
      // hasError: false,
      // errorMessage: null,
    };
  }

async componentDidMount() {
  this.loadCharacters();
}

loadCharacters () {

  const {episode} = this.state;

  const EPISODE_URL = `https://rickandmortyapi.com/api/episode/${episode}`;

     axios
       .get(EPISODE_URL)
       .then((result) => {
         const newCharacters = result.data.characters;
         const newEpisode = result.data;

         axios.all(newCharacters.map((url) => axios.get(url))).then((data) => {
           const res = data.map((i) => i.data);
          this.setState({
            episode: newEpisode,
            characters: res,
            hasLoaded: true,
          });
        });
      })
      .catch((error) => console.log(error));
   }

  render() {
    const { characters, episode, hasLoaded } = this.state;
    return (
      <Layout>
        <EpisodeCard
           id={episode.id}
           name={episode.name}
           airDate={episode.air_date}
           episode={episode.episode}
         />
        <section className="row">
        {hasLoaded &&
             characters.map((character) => (
               <CharacterCard
                 key={character.id}
                 id={character.id}
                 name={character.name}
                 image={character.image}
                 species={character.species}
                 status={character.status}
                 origin={character.origin}
                 location={character.location}
               />
             ))}
        </section>
      </Layout>
    );
  }
}

export default withRouter(Episode);
