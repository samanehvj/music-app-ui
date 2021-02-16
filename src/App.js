import React, {useState, useEffect} from "react";
import styles from "./App.css";

import {Card, Image, ListGroup} from "react-bootstrap";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState({});
  const server_url = `http://localhost:8765`;

  useEffect(() => {
    fetch(server_url)
    .then(res => res.json())
    .then(jsonRes => {
      
      setPlaying(jsonRes.songs[0]);
      setSongs(jsonRes.songs);
      // jsonRes.songs.map(song => setSongs([...song]))
      // console.log('Songs are: ', jsonRes.songs);
    });
    
  }, []);
  // console.log('songs:', songs)
  // console.log('playing:', playing)
  return (
    <div  >
      <div className="logo centercontent" >
      <Image src="./logo.svg" width="100" />
      </div>
      <div className="centercontent" >
        <Card style={{ width: '18rem' }}>
          <Image width="200" height="200" src={`${server_url}/music/imgs/${playing.img}`} roundedCircle />
          <Card.Body>
            <Card.Title>{playing.name}</Card.Title>
            <Card.Text>
              Singer: {playing.singer}
            </Card.Text>
            <audio controls>
              <source src={`${server_url}/music/mp3/${playing.mp3}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Card.Body>
        </Card>
        {/* <img src={`${server_url}/music/imgs/${playing.img}`} width="200" height="200" />
        <audio controls>
          <source src={`${server_url}/music/mp3/${playing.mp3}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio> */}
      </div>
      <div className="centercontent" >
        <ListGroup>
        {
        songs.map(song => {
          return (
            <ListGroup.Item key={song.id} onClick={() => setPlaying(song)}>{song.name}</ListGroup.Item>
          )
        })
        }
        </ListGroup>
      </div>
    </div>
  );
}

export default App;
