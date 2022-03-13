/**
 * 1. Render songs ==> OK
 * 2. Scrool top ==> OK
 * 3. Play / Pause / Seek - Chạy / Dừng / Tua  ==> OK
 * 4. CD rotare ==> OK
 * 5. Next / prev ==> OK
 * 6. Random ==> OK
 * 7. Next / Repeat when ended  ==> OK
 * 8. Active song ==> OK
 * 9. Scroll active song into view ==> OK
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'QUOC-DAT'

const player = $('.player');
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
// const time_start = $('.controls_time--left');
// const time_count = $('.controls_time--right');

const time_start = $('.controls_time--left');
time_start.textContent = '00:00'
const time_count = $('.controls_time--right');
time_count.textContent = '00:00'





const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // (1/2) Uncomment the line below to use localStorage
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Lemon Tree",
            singer: "Gustixa",
            path: "https://tainhac123.com/listen/lemon-tree-gustixa.murrBc1lfMi8.html",
            image: "./assets/img/song5.jpg"
        },
        {
            name: "Có Hẹn Với Thanh Xuân",
            singer: "Monstar",
            path: "https://tainhac123.com/listen/co-hen-voi-thanh-xuan-monstar.B1Q3wlGhldTr.html",
            image: "./assets/img/song6.jpg"
        },
        {
            name: "Phố Đã Lên Đèn (Masew Remix) ",
            singer: "Huyền Tâm Môn",
            path: "https://tainhac123.com/listen/pho-da-len-den-cukak-remix-huyen-tam-mon.iUwvfrQEM92M.html",
            image: "./assets/img/song7.jpg"
        },
        {
            name: "Gác Lại Âu lo",
            singer: "Da LAB,Miu Lêm Zang",
            path: "https://tainhac123.com/listen/gac-lai-au-lo-zang-remix-da-lab-ft-miu-lem-zang.Y8QG9DPHDL8Q.html",
            image: "./assets/img/song6.jpg"
        },
        {
            name: "Là Bạn Không Thể Yêu",
            singer: "Lou Hoàng",
            path: "https://tainhac123.com/listen/la-ban-khong-the-yeu-cover-orin.EYbtlpcSonNe.html",
            image: "./assets/img/song7.jpg"
        },
        {
            name: "Sài gòn hôm nay mưa",
            singer: "JSOL - Hoàng Duyên",
            path: "https://tainhac123.com/listen/sai-gon-hom-nay-mua-jsol-ft-hoang-duyen.EZwfyBx9IT1N.html",
            image: "./assets/img/song8.jpg"
        },
        {
            name: "Người lạ thoáng qua",
            singer: "Đinh Tùng Huy",
            path: "https://tainhac123.com/listen/nguoi-la-thoang-qua-lofi-version-dinh-tung-huy-ft-vux.DzYrNFPqNFdk.html",
            image: "./assets/img/song9.jpg"
        },
        {
            name: "Sài gòn đau lòng quá",
            singer: "Hứa Kim Tuyền - Hoàng Duyên",
            path: "https://tainhac123.com/listen/sai-gon-dau-long-qua-hua-kim-tuyen-ft-hoang-duyen.2hI4xFTa2lxJ.html",
            image: "./assets/img/song10.jpg"
        }

    ],
    setconfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // Render songs
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div> 
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    //scroll Top
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth;

        //xử lý quay đĩa cd
        const cdThumAnimate = cdThumb.animate([
            // keyframes
            { transform: 'rotate(360deg)' }
        ], {
            // timing options
            duration: 20000, // 20 second - thời gian quay hết 1 vòng
            iterations: Infinity
        });
        cdThumAnimate.pause();

        //xử lý phóng to / thu nhỏ CD
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;

        }

        //xử lý khi click play 
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        //khi bài hát được play
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumAnimate.play();
        }

        //khi bài hát được pause
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

                // Xử lý tính thời gian của bài hát
                // Time Start
                var time_start_loading = Math.floor(audio.currentTime); // thời gian hiện tại bài hát đang chạy
                var time_start_seconds = time_start_loading % 60; // số giây
                var time_start_minutes = Math.floor(time_start_loading / 60); // số phút
                if (time_start_seconds < 10) {
                    var time_start_seconds_tent = 0; // số chục giây
                } else {
                    time_start_seconds_tent = "";
                }
                time_start.textContent = '0' + time_start_minutes + ":" + time_start_seconds_tent + time_start_seconds;

                // Time Count
                // Time Count
                var time_count_loading = Math.floor( audio.duration) ; // Tổng số thời gian bài hát
                var time_count_seconds =  time_count_loading % 60; //số giây
                var time_count_minutes =  Math.floor( time_count_loading / 60); //số phút
                if(time_count_seconds < 10){
                   var time_count_seconds_ten = 0; // số chục giây
                }else{
                    time_count_seconds_ten = "";
                }

                time_count.textContent =  '0' + time_count_minutes +  ":" + time_count_seconds_ten + time_count_seconds;
            }
        }

        //xử lý khi tua song
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //xử lý next song 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //xử lý prev song 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý random bài hát
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setconfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lý lặp lại song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setconfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //XỬ lý khi kết thúc song thì chuyển bài
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //xử lý khi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if (songNode || optionNode) {
                //xử lý khi click vào song
                if (songNode) {
                    // console.log(songNode.getAttribute('data-index'));
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    //scroll into view
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 300);
    },
    nextSong: function () {
        this.currentIndex++; //Tăng vị trí song thêm 1
        //kiểm tra nếu tới bài cuối cùng thì quay lại ban đầu
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    loadconfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    prevSong: function () {
        this.currentIndex--; //Tăng vị trí song thêm 1
        //kiểm tra nếu tới bài cuối cùng thì quay lại ban đầu
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        this.loadconfig();

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // lắng nge - xử lý các sự kiện (DOM Events)
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI 
        this.loadCurrentSong();

        //render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
};

app.start();

