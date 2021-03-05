import React, {useState, useEffect} from "react";
import "./App.css";

import {Card, Image, ListGroup} from "react-bootstrap";


//styling 
import "./styles/logo.css";

import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://localhost:3000";
// const server_url = "http://localhost:3000";
const ENDPOINT = "https://musicapp-nodejs-mysql.herokuapp.com";
const server_url = `https://musicapp-nodejs-mysql.herokuapp.com`;

const App = () => {
  const socket = socketIOClient(ENDPOINT);

  const [songs, setSongs] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [playing, setPlaying] = useState({id:1, name:"Hello", singer:"Adele", img:"adele.png", type:"Pop", mp3:"Adele.mp3"});
  const [updatePlayer, setUpdatePlayer] = useState(Math.random);
  const [updateList, setUpdateList] = useState(Math.random);

  useEffect(() => {
    fetch(ENDPOINT)
    .then(res => res.json())
    .then(jsonRes => {
        setPlaying(jsonRes.songs[0]);
        setSongs(jsonRes.songs);
    });

    socket.on("connect", data => {
        socket.emit('getInitialData', {});
    });

    socket.on("likeCount", data => {
      setLikeCount(data);
    });
    return;
  }, []);

  const changeSong = (song) => {
    setPlaying(song)
  }

  const songLiked = (id) => {
    socket.emit('songLiked', id);
  }

  useEffect(() => {
    if(playing){
      setUpdatePlayer(Math.random);
    }
  }, [playing]);
  
  useEffect(() => {
    if(songs.length > 0 && likeCount.length > 0){
      sortList();
    }
  }, [songs, likeCount]);

  const sortList = async() => {
    let consolidatedList = likeCount.map(({songId,likeCount}) => {
      let song = songs.find(({id}) => id == songId);
      song.likeCount = likeCount;
      return {...song}
    });
    let filteredList = consolidatedList.sort((a,b) => {return b.likeCount - a.likeCount})
    setSortedList(filteredList);
  }
  
  useEffect(() => {  
    setUpdateList(Math.random);
  }, [sortedList]);

  if(sortedList.length <= 0) return <><h1 style={{ textAlign: 'center'}}>Loading</h1></>;

  return (
    <div className="container">
      <div className="logo centercontent" >
      <Image className="App-logo" id="logo" src="./logo.svg" />
      </div>
      <div className="centercontent" >
        <Card style={{ width: '20rem', }} key={updatePlayer}>
          <Image className="img" width="300" height="300" src={`${server_url}/music/imgs/${playing.img}`} roundedCircle />
          <Card.Body>
            <audio controls autoPlay>
              <source src={`${server_url}/music/mp3/${playing.mp3}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Card.Body>
        </Card>
      </div>
      <div className="centercontent" >
        <ListGroup className="list" key={updateList}> 
        {
          sortedList.map(song => {
            let clsName = (song.id == playing.id) ? 'active' : ''; 
            return (
              <div key={`item_${song.id}`}>
                <ListGroup.Item className={clsName} key={`song_${song.id}`} onClick={() =>  changeSong(song)}><span>{song.name}</span>{song.singer}</ListGroup.Item>
                <ListGroup.Item className="like" key={`like_${song.id}`} onClick={() => songLiked(song.id)}>&#9825;</ListGroup.Item>
              </div>
            )
          })
        } 
        </ListGroup>
      </div>
    </div>
  );
}

export default App;

