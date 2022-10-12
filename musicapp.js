const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const cdThumb = $('.cd-thumb')
const cd = $('.cd')
const nowPlaying = $('.currentSongName')
const playbtn = $('.btn-toggle-play')
const nextbtn = $('.btn-next')
const prebtn = $('.btn-prev')
const repeatbtn = $('.btn-repeat')
const randombtn = $('.btn-random')
const song = $('.song')
const currentAudio = $('#audio')
const volume = $('.volume')
const progressBar = $('.progress')
const player = $(".player");
    const app =  {
    currentIndex : 0,
    isplaying : false,
    isrepeat : false,
    israndom : false,
    volume : 50,
    arrayrandom : [],
    songs : [
        {
            name : "Tình khúc vàng",
            singer: "Jaykill",
            id : 0
        },
        {
            name : "Tình nhạc phai",
            singer: "Crayons",
            id : 1
        },
        {
            name : "Nụ hồng mong manh",
            singer: "Tôn cafe",
            id : 2
        },
        {
            name : "Phai dấu cuộc tình",
            singer: "Quang Vinh",
            id : 3
        },
        {
            name : "Người tình mùa đông",
            singer: "Lưu Tuấn Phong",
            id : 4
        },
        {
            name : "Hoa bằng lăng",
            singer: "Thành Nghiệp",
            id : 5
        },
        {
            name : "Người tình mùa đông",
            singer: "Vương Phi",
            id : 6
        },
        {
            name : "999 đóa hoa hồng",
            singer: "Chung Sở Hồng",
            id : 7
        },
    ],

    genarrayrandom :  function (){
        increArr = [...Array(this.songs.length).keys()].filter((num,index) => num != this.currentIndex)
        this.arrayrandom = increArr.sort((a,b)=> Math.random() - 0.5)
    },
    // listening to events that occurring 
    handleEventClick : function(){
        _this = this;
        const cdWidth = cd.offsetWidth;
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
          });
        cdThumbAnimate.pause();
        
        playbtn.onclick = function(){
            console.log(_this.isplaying)
            if (_this.isplaying){
                currentAudio.pause()
            }
            else{
            currentAudio.play()
        }
        };
        // handle zoom in zoom out cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
          };
        // click any play on playlist 
        playlist.onclick = function(e){
            console.log(e.target)
            songnode = e.target.closest('.song:not(.active)')
            console.log(songnode)
            if(songnode || e.target.closest(".option")){
                _this.currentIndex = Number(songnode.id)
                _this.loadfirstsong()
                currentAudio.play()
                _this.render()
            }
        }
        // play next song when next button is click 
        nextbtn.onclick = function(){
            console.log(_this.arrayrandom)
            if(_this.israndom) {
            if(_this.arrayrandom.length == 0) {
                _this.genarrayrandom()
            }
            _this.currentIndex = _this.arrayrandom.shift()
            }
            else {
            _this.currentIndex = (_this.currentIndex + 1)%(_this.songs.length)
        }
            _this.loadfirstsong()
            currentAudio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // play previous song when the prev button is click
        prebtn.onclick = function(){
            _this.currentIndex = _this.currentIndex == 0 ? _this.songs.length-1 : _this.currentIndex -1
            _this.loadfirstsong()
            currentAudio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // toggle state when repeat is click
        repeatbtn.onclick = function(){
        repeatbtn.classList.toggle('active')
        _this.isrepeat = !_this.isrepeat
        }
        //toggle state when random is click
        randombtn.onclick = function(){

        if (_this.israndom )
        {
           _this.arrayrandom = []
        }
        else {
            _this.genarrayrandom()
        }
        randombtn.classList.toggle('active')
        _this.israndom = !_this.israndom       
        }
    // set state when the audio is playing
        currentAudio.onplay = function(){
        _this.isplaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
        }

    // reset state when the audio is pausing
        currentAudio.onpause = function(){
        _this.isplaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
        };
      // change progressbar when audip is playing
      currentAudio.ontimeupdate = function(){
      if(currentAudio.duration) {
      progressBar.value = (currentAudio.currentTime/currentAudio.duration)*100
      }
      };
      // replay when audio is end 
      currentAudio.onended = function(){
        if(_this.isrepeat){
            currentAudio.play()
        }
        else {
            nextbtn.click()
        }

      }
      
      
    // user change progress bar
     progressBar.onchange = function(){
        currentAudio.currentTime = progressBar.value*currentAudio.duration/100;
     }
     
     //change volume of volume bar
     volume.onchange = function(){
        console.log(volume.value)
        console.log(currentAudio.volume)
        currentAudio.volume = volume.value/100
     }


    },


    //render danh sách bài hát ra view
    render : function(){
    var songhtml = this.songs.map((song,index) => {
        return `    <div class="song ${
            index === this.currentIndex ? "active" : ""
          }" id = ${index}>
        <div class="thumb" style="background-image: url(assets/image/${index}.jpg)">
        </div>
        <div class="body">
          <h3 class="title">${this.songs[index].name}</h3>
          <p class="author">${this.songs[index].singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div></div>`
    }).join('  ');
    playlist.innerHTML = songhtml;
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 300);
      },
    // load the first song to audio
    loadfirstsong : function(){
    nowPlaying.textContent = this.songs[this.currentIndex].name
    cdThumb.style.backgroundImage = `url('assets/image/${this.currentIndex}.jpg')` ;
    currentAudio.src = `assets/music/${this.currentIndex}.mp3`;
    currentAudio.volume = this.volume/100;
    volume.value = this.volume;
    },
    
    start : function(){
    // render playlist song
    this.handleEventClick()
    this.render()
    // play the first song when just open
    this.loadfirstsong()
    }
 
    };
    app.start()