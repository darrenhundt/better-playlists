import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
	color: '#fff'
};
let bg = '#bbb';
let fakeServerData = {
	user: {
		name: 'Darren',
		playlists: [
			{
				name: '2010 Favorites',
				songs: [
					{name: 'Beat It', duration: 240},
					{name: 'Some Nights', duration: 300},
					{name: 'Pumped Up Kicks', duration: 240}]
			},
			{
				name: '2011 Favorites',
				songs: [
					{name: 'Lonely Boy', duration: 440},
					{name: 'Gold on the Ceiling', duration: 240},
					{name: 'Next Girl', duration: 240}]
			},
			{
				name: '2012 Favorites',
				songs: [
					{name: 'Shook Me', duration: 340},
					{name: 'All Night', duration: 240},
					{name: 'Long', duration: 240}]
			},
			{
				name: '2013 Favorites',
				songs: [
					{name: 'Gone', duration: 140},
					{name: 'Golddigga', duration: 240},
					{name: 'Power', duration: 240}]
			}
		]
	}
};

class PlaylistCounter extends Component {
	render () {
		return (
			<div style={{...defaultStyle, width: "40%", display: "inline-block"}} className="aggregate">
				<h2>{this.props.playlists.length} playlists</h2>
			</div>
		);
	}
}

class HoursCounter extends Component {
	render () {
		let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
			return songs.concat(eachPlaylist.songs)
		}, []);
		let totalDuration = allSongs.reduce((sum, eachSong) => {
			return sum + eachSong.duration;
		}, 0)
		return (
			<div style={{...defaultStyle, width: "40%", display: "inline-block"}} className="aggregate">
				<h2>{Math.round(totalDuration/60)} hours</h2>
			</div>
		);
	}
}

class Filter extends Component {
	render() {
		return (
			<div style={defaultStyle}>
				<img/>
				<input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
				Filter
			</div>
		);
	}
}

class Playlist extends Component {
	render() {
		let playlist = this.props.playlist
		return (
			<div style={{...defaultStyle, width: "24%", display: "inline-block"}}>
				<img src={playlist.imageUrl} style={{width: '160px'}}/>
				<h3>{playlist.name}</h3>
				<ul>
					{playlist.songs.map(song => 
						<li>{song.name}</li>
					)}
				</ul>
			</div>
		);
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			serverData: {},
			filterString: ''
		}
	}
	componentDidMount() {
//		setTimeout(() => {
//			this.setState({serverData: fakeServerData});
//		}, 1000);
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;
		if(!accessToken)
			return;
		fetch('https://api.spotify.com/v1/me', {
			headers: {'Authorization': 'Bearer ' + accessToken}
		}).then(response => response.json())
			.then(data => this.setState({
				user: {
					name: data.display_name
				}
		}))
		
		
		
		
		fetch('https://api.spotify.com/v1/me/playlists', {
			headers: {'Authorization': 'Bearer ' + accessToken}
		}).then(response => response.json())
			.then(playlistData => {
				let playlists = playlistData.items
				let trackDataPromises = playlists.map(playlist => {
					let responsePromise = fetch(playlist.tracks.href, {
						headers: {'Authorization': 'Bearer ' + accessToken}
					})
					let trackDataPromise = responsePromise
						.then(response => response.json())
					return trackDataPromise
				})
				let allTracksDataPromises = 
				Promise.all(trackDataPromises)
				let playlistsPromise = allTracksDataPromises.then(trackDatas => {
					
					trackDatas.forEach((trackData, i) => {
						playlists[i].trackDatas = trackData.items
							.map(item => item.track)
							.map(trackData => ({
								name: trackData.name,
								duration: trackData.duration_ms / 60000
							}))
					})
					return playlists
				})
				return playlistsPromise
			})
			.then(playlists => this.setState({
				playlists: playlists.map(item => {
					let smartUrl =  'https://www.fillmurray.com/g/160/160'
					if (item.images[0]) {
						smartUrl = item.images[0].url
					}
					return {
						name: item.name,
						imageUrl: smartUrl,
						songs: item.trackDatas.slice(0,3)
					}
				})
		}))
	}
  render() {
		let playlistToRender = 
				this.state.user && 
				this.state.playlists 
					? this.state.playlists.filter(playlist => 
						 playlist.name.toLowerCase().includes(
								this.state.filterString.toLowerCase()))
					: []
    return (
      <div style={{background: bg}} className="App">
				{this.state.user ? 
					<div>
						<h1 style={defaultStyle}>
						{this.state.user.name}s Playlist</h1>
							<PlaylistCounter playlists={playlistToRender}/>
							<HoursCounter playlists={playlistToRender}/>
						
						<Filter onTextChange={text => this.setState({filterString: text})}/>
						{playlistToRender.map((playlist) =>
							<Playlist playlist={playlist}/>
						)}
					</div> : <button onClick={() => window.location='http://localhost:8888/login'}
										style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
				}
      </div>
    );
  }
}
 
export default App;
