import React, { Component } from 'react';
import './App.css';

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
				<img />
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
		setTimeout(() => {
			this.setState({serverData: fakeServerData});
		}, 1000);
	}
  render() {
		let playlistToRender = this.state.serverData.user ? this.state.serverData.user.playlists
			.filter(playlist => 
						 playlist.name.toLowerCase().includes(
								this.state.filterString.toLowerCase())
						 ) : []
    return (
      <div style={{background: bg}} className="App">
				{this.state.serverData.user ? 
					<div>
						<h1 style={defaultStyle}>
						{this.state.serverData.user.name}'s Playlist</h1>
							<PlaylistCounter playlists={playlistToRender}/>
							<HoursCounter playlists={playlistToRender}/>
						}
						<Filter onTextChange={text => this.setState({filterString: text})}/>
						{playlistToRender.map((playlist) =>
							<Playlist playlist={playlist}/>
						)}
					</div> : <h1 style={defaultStyle}>Loading...</h1>
				}
      </div>
    );
  }
}
 
export default App;
