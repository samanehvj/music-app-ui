import React, {useState, useEffect} from "react";
import "./App.css";

import {Card, Image, ListGroup} from "react-bootstrap";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState({id:1, name:"Hello", singer:"Adele", img:"adele.png", type:"Pop", mp3:"Adele.mp3"});
  const server_url = `http://localhost:8765`;

  const [updatePlayer, setUpdatePlayer] = useState(Math.random);

  useEffect(() => {
    fetch(server_url)
    .then(res => res.json())
    .then(jsonRes => {
        setPlaying(jsonRes.songs[0]);
        setSongs(jsonRes.songs);
    });
    return;
  }, []);

  const changeSong = (song) => {
    console.log("LOL",song)
    setPlaying(song)
  }


  useEffect(() => {
   if(playing){
     setUpdatePlayer(Math.random);
   }
  }, [playing]);
  
  return (
    <div className="container">
      <div className="logo centercontent" >
      <Image src="./logo.svg" width="300" />
      </div>
      <div className="centercontent" >
        <Card style={{ width: '20rem', }} key={updatePlayer}>
          <Image className="img" width="300" height="300" src={`${server_url}/music/imgs/${playing.img}`} roundedCircle />
          <Card.Body>
            <Card.Title className="title">{playing.name}</Card.Title>
            <Card.Text className="singer">
              Singer: {playing.singer}
            </Card.Text>
            <Card.Text className="type">
              Type: {playing.type}
            </Card.Text>
            <audio controls autoPlay>
              <source src={`${server_url}/music/mp3/${playing.mp3}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Card.Body>
        </Card>
      </div>
      <div className="centercontent" >
        <ListGroup className="list">
        {
        songs.map(song => {
          let clsName = (song.id == playing.id) ? 'active' : ''; 
          return (
            <ListGroup.Item className={clsName} key={song.id} onClick={ () =>  changeSong(song)}>{song.name}</ListGroup.Item>
          )
        })
        }
        </ListGroup>
      </div>
    </div>
  );
}

export default App;
