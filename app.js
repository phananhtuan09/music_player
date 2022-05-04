const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_MUSIC_KEY = "PLAYER_MUSIC_2"
const wrapper = $('.wrapper')
const songName = $('.song-name')
const songArtist = $('.song-artist')
const imgThumb = $('.img-thumb')
const mainAudio = $('#main-audio')
const playPause = $('.play-pause')
const progressBar = $('.progress-bar')
const progressArea = $('.progress-area')
const currentTime = $('.current-time')
const maxDuration = $('.max-duration')
const prevBtn = $('#prev')
const nextBtn = $('#next')
const repeatBtn = $('#repeat-plist')
const moreBtn = $('#more-music')
const musicList = $('.music-list')
const closeBtn = $('#close')
const app = {
  songs: [
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Summertime",
      singer: "K-391",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Monody",
      singer: "TheFatRat",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Reality",
      singer: "Lost Frequencies",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Ngày Khác Lạ",
      singer: "Đen",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Lemon Tree",
      singer: "DJ DESA REMIX",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Sugar",
      singer: "Maroon 5",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "My Love",
      singer: "Westlife",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "Attention",
      singer: "Charlie Puth",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.jpg",
    },
    {
      name: "Monsters",
      singer: "Katie Sky",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.jpg",
    },
  ],
  currentIndex:0,
  isPlaying:false,
  repeatSelection:['repeat','repeat_one','shuffle'],
  repeatElValue:'repeat',
  config: JSON.parse(localStorage.getItem(PLAYER_MUSIC_KEY)) || {},
  setConfig(key,value){
      this.config[key] = value
      localStorage.setItem(PLAYER_MUSIC_KEY,JSON.stringify(this.config))
  },
  currentSong(){
      return this.songs[this.currentIndex]
  },
  loadCurrentSong(){
      this.setConfig('currentIndex',this.currentIndex)
      const currentInfoSong = this.currentSong()
      songName.innerText = currentInfoSong.name
      songArtist.innerText = currentInfoSong.singer
      imgThumb.src = currentInfoSong.image
      mainAudio.src = currentInfoSong.path
      mainAudio.currentTime = this.config.currentTimeSong > 0 ?  this.config.currentTimeSong : 0

  },
  loadConfig(){
    this.currentIndex = this.config.currentIndex ? this.config.currentIndex : 0
    repeatBtn.innerText = this.config.repeatElValue ? this.config.repeatElValue : 'repeat'
    this.repeatElValue = this.config.repeatElValue ? this.config.repeatElValue : 'repeat'
  },
  getTimeSong(time){
      if(time){
          let timeMinute = Math.floor(time / 60)
          let timeSecond = Math.floor(time % 60)
          if(timeSecond < 10){
              timeSecond = `0${timeSecond}`
          }
          if(timeMinute < 10){
              timeMinute = `0${timeMinute}`
          }
          return `${timeMinute}:${timeSecond}`

      }else{
        return '00:00'
      }
  },
  nextSong(){
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
          this.currentIndex = 0
      }
      this.loadCurrentSong()
  },
  prevSong(){
    this.currentIndex--
    if(this.currentIndex < 0 ){
        this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  randomSong(){
    let randomIndex;
    do{
        randomIndex = Math.floor(Math.random() * this.songs.length)
    }while(this.currentIndex === randomIndex)
    this.currentIndex = randomIndex
    this.loadCurrentSong()
  },
  renderMusicList(){
    let ulEl = musicList.querySelector('ul')
    let liEl = this.songs.map((song,index) =>`
          <li data-index="${index}">
            <div class="row">
                <span class="music-list__name">${song.name}</span>
                <p class="music-list__artist">${song.singer}</p>
            </div>
            <audio src="${song.path}" preload="metadata"></audio>
            <span class="audio-duration">3:40</span>
          </li>
    `).join('')
    ulEl.innerHTML = liEl
    const songs = musicList.querySelectorAll('ul li')
    songs.forEach((song) =>{
      const songDuration = song.querySelector('.audio-duration')
      const songAudio = song.querySelector('audio')
      songAudio.onloadedmetadata = function() {
        songDuration.innerText = app.getTimeSong(songAudio.duration)
        };
    })
    
  },
  activeSong(){
      const songs = musicList.querySelectorAll('ul li')
      songs.forEach((song) =>{
         if(song.getAttribute('data-index') ==this.currentIndex){
           song.classList.add('playing')
         }else{
          song.classList.remove('playing')
         }
         
      })
  },
  handleEvent(){
      const _this = this
      const playPauseBtn = playPause.querySelector('i')
      const repeatArr = _this.repeatSelection
      playPause.onclick = function(){
          if(_this.isPlaying){  
              mainAudio.pause()
          }else{ 
              mainAudio.play()
          } 
      }
      mainAudio.onplay = function(){
          playPauseBtn.innerText = 'pause'
          _this.isPlaying = true
      }
      mainAudio.onpause = function(){
          playPauseBtn.innerText = 'play_arrow'
          _this.isPlaying = false
      }
      mainAudio.ontimeupdate = function(){
          const currentTimeSong = mainAudio.currentTime
          const durationSong = mainAudio.duration
          progressBar.style.width = currentTimeSong * 100 / durationSong  + '%'
          currentTime.innerText = _this.getTimeSong(currentTimeSong)
          maxDuration.innerText = _this.getTimeSong(durationSong)
          _this.setConfig('currentTimeSong',currentTimeSong)
      }
      progressArea.onclick = function(e){
          const progressAreaWidth = progressArea.clientWidth
          const clickedOffsetX = e.offsetX
          const seekTime = clickedOffsetX /  progressAreaWidth * mainAudio.duration
          mainAudio.currentTime = seekTime
        }
        nextBtn.onclick = function(){
          _this.setConfig('currentTimeSong',0)
          if(_this.repeatElValue === 'shuffle'){
            _this.randomSong()
          }else{
            _this.nextSong()
          }
          mainAudio.play()
        }
        prevBtn.onclick = function(){
          _this.setConfig('currentTimeSong',0)
          if(_this.repeatElValue === 'shuffle'){
            _this.randomSong()
          }else{
            _this.prevSong()
          }

          mainAudio.play()
        }
        repeatBtn.onclick = function(){
          for(var i = 0;i<repeatArr.length;i++){
             if(_this.repeatElValue === repeatArr[i]){
               if(i === repeatArr.length -1){
                _this.repeatElValue = repeatArr[0]  
                break;
               }else{
                _this.repeatElValue = repeatArr[i+1]
                 break;
               }
             }
          }
          repeatBtn.innerText = _this.repeatElValue
          _this.setConfig('repeatElValue',_this.repeatElValue)
        }
        mainAudio.onended = function(){
          if(_this.repeatElValue === 'repeat_one'){
            mainAudio.play()
          }else{
            nextBtn.click()
          }
        }
        moreBtn.onclick = function(){
          musicList.classList.add('show')
        }
        closeBtn.onclick = function(){
          musicList.classList.remove('show')
        }
        musicList.onclick = function(e){
          const song = e.target.closest('li')
          if(song){
            const songIndex = song.getAttribute('data-index')
            if(song && songIndex != _this.currentIndex){
              _this.currentIndex = parseInt(songIndex)
              _this.setConfig('currentTimeSong',0)
              _this.loadCurrentSong()
              mainAudio.play()
              _this.activeSong()
            }
          }
          
        }
        
      },
  start() {
      this.loadConfig()
      this.loadCurrentSong()
      this.handleEvent()
      this.renderMusicList()
      this.activeSong()
  },
};
app.start();
