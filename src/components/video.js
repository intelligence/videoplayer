import React from 'react';
import styled from '@emotion/styled';
import ReactPlayer from 'react-player';


/* Emotion Styled Components Styling */
const VideoContainer = styled('div')`
  position: relative;
  // max-width: 790px;


  cursor: ${props =>
    props.idle ? 'none' : 'initial'};
`;

const VideoControls = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 500;
`;

const ButtonPlayPause = styled('button')`
  /* Remove default styling of button element */
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  text-align: inherit;
  outline: none;

  /* Additional styling */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;

  transition: opacity 0.25s ease-in-out;

  opacity: ${props =>
    props.idle ? 0 : 1 };

  cursor: ${props =>
    props.idle ? 'none' : 'pointer' };
`;

const VideoWrapper = styled('div')`
  position: relative;
  padding-top: 56.25%;
`;

const VideoPreview = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 400;

  display: ${props =>
    props.playing ? 'none' : 'block'};

  display: ${props =>
    props.preview ? 'block' : 'none'};
`;

const VideoMain = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const PlayPauseIcon = styled('svg')`
  width: 30px;
`;

export default class Video extends React.Component  {

  constructor(props) {
    super(props);
    this.resetTimer = this.resetTimer.bind(this); //bind function once
  }

  state = {
    playing: false,
    timer: null,
    idle: false,
    preview: true,
  }

  componentWillUnmount() {
    this.unWatchMovement();
  }

  ref = player => {
    this.player = player
  }

  onReady = () => {
    const hlsPlayer = this.player.getInternalPlayer('hls');
    console.log(hlsPlayer);
  }

  onPlay = () => {
    // console.log('started playing');
    this.watchMovement();
  }

  onPause = () => {
    // console.log('paused');
    this.unWatchMovement();
  }

  onEnd = () => {
    // console.log('ended');
    this.setState({ playing: false });
    this.unWatchMovement();
  }

  onError = () => {
    console.log('error!');
  }

  unWatchMovement() {
    // console.log('unwatch');
    this.setState({idle: false });
    clearTimeout(this.state.timer);
    window.removeEventListener('click', this.resetTimer);
    window.removeEventListener('mousemove', this.resetTimer);
    window.removeEventListener('touchstart', this.resetTimer);
  }

  watchMovement() {
    // console.log('watching');
    this.resetTimer();
    window.addEventListener('click', this.resetTimer);
    window.addEventListener('mousemove', this.resetTimer);
    window.addEventListener('touchstart', this.resetTimer);
  }

  resetTimer() {
    this.revealPause();
    clearTimeout(this.state.timer);
    let timer = setTimeout(this.hidePause, 1750);
    this.setState({timer});
  }

  hidePause = () => {
    // console.log('hide pause');
    this.setState({idle: true });
  }

  revealPause = () => {
    // console.log('reveal pause');
    this.setState({idle: false });
  }

  playPause = () => {
    console.log('play/pause was pressed');

    this.setState({ playing: !this.state.playing });

    if(this.state.preview === true) {
      this.setState({ preview: false });
    }
  }

  render() {
    // const { playing } = this.state

    return (
      <VideoContainer idle={this.state.idle}>
        <VideoControls>
          <ButtonPlayPause onClick={this.playPause} idle={this.state.idle}>
            { 
              this.state.playing ? 
              <PlayPauseIcon viewBox="0 0 78 92" preserveAspectRatio="xMinYMin meet"><path d="M0 91.5h26V.5H0v91zm52-91v91h26V.5H52z" fill="#FFF"/></PlayPauseIcon>
              : 
              <PlayPauseIcon viewBox="0 0 72 92" preserveAspectRatio="xMinYMin meet"><path d="M0 .5v91L71.5 46z" fill="#FFF"/></PlayPauseIcon>
            }
          </ButtonPlayPause>
        </VideoControls>
        <VideoWrapper>
          <VideoPreview playing={this.state.playing} preview={this.state.preview}>
            <ReactPlayer 
              url={'preview.mp4'} 
              width='100%'
              height='100%'
              muted
              playing
              loop
              playsinline={true}
            />
          </VideoPreview>
          <VideoMain>
            <ReactPlayer 
              ref={this.ref}
              url='https://player.vimeo.com/external/345514336.m3u8?s=4994964fa8d97f3b93542f1e69442f80dce134df'
              width='100%'
              height='100%'
              playing={this.state.playing}
              onReady={this.onReady}
              onEnded={this.onEnd}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onError={(e) => console.log('onError', e)}
              playsinline={true}
              config={{
                file: { 
                  attributes: { 
                    preload: 'none',
                    //forceHLS: true,
                  },
                  hlsOptions: {
                    //autoStartLoad: false,
                    startLevel: 3
                  }
                } 
              }}
            />
          </VideoMain>
        </VideoWrapper>
      </VideoContainer>
    )
  }
}