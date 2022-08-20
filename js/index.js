/*
index.js
*/

var app = new Vue({
  el: "#app",

  data() {
    return {
      kw: "",
      searchReturned: "",
      isSearched: false,
      songs_list: [],
      isPlaying: false,
      isMvPlaying:false,
      song_src: "",
      isPlaySongsInfo: true,
      hotComments: [],
      isHotComments: false,
      isHideHotComments:false,
      mvGot:false,
      mvMsg:"",
      mvUrl:""
    }
  },

  methods: {  
    search() {
      //console.log(this.kw);
      that = this;

      if (this.kw == "") {
        return;
      }

      axios.get(`https://autumnfish.cn/search?keywords=${this.kw}`)
        .then(resp => {
          if (resp.data.code != 200) {
            that.searchReturned = "搜索失败！"
            return;
          }

          that.searchReturned = "搜索成功！"
          that.songs_list = resp.data.result.songs;
          that.isSearched = true;
          that.isPlaySongsInfo = true;
        }, err => {

        })
      

    },

    play(id) {
      that = this;

      axios.get(`https://autumnfish.cn/song/url?id=${id}`)
        .then(resp => {
          if (resp.data.code != 200) {
            return;
          }

          that.song_src = resp.data.data[0].url;
          console.log(that.song_src)
          that.isPlaying = true;
          this.comment(id);
          that.isHotComments = true;
          that.mvGot = false;
          that.mvMsg = "";
          that.mvUrl = "";

          document.getElementsByTagName('video')[0].pause();
          document.getElementsByTagName('audio')[0].volume = 0.5;

        })

    },

    playMV(mvid,id){
      this.mvMsg = "";
      that = this;

      axios.get(`https://autumnfish.cn/mv/url?id=${mvid}`)
      .then(resp =>{
        if(resp.data.data.code != 200){
          that.mvMsg = "无法获取MV，请检查网络是否联通";
          return;
        }

        that.mvUrl = resp.data.data.url;
        that.mvGot = true;
        that.isHotComments = true;
        that.isPlaying = false;
        that.isMvPlaying = true;
        this.comment(id);

        document.getElementsByTagName("audio")[0].pause();
        document.getElementsByTagName('video')[0].volume = 0.45;
      }, err=>{})
    },

    playSongsInfo() {
      this.isPlaySongsInfo = !this.isPlaySongsInfo;
    },

    DisplayHotComments() {
      this.isHideHotComments = !this.isHideHotComments
    },

    comment(id) {
      that = this;

      axios.get(`https://autumnfish.cn/comment/hot?type=0&id=${id}`)
        .then(resp => {
          if (resp.data.code != 200) {
            return;
          }

          that.hotComments = resp.data.hotComments;
        })
    }
  }
});