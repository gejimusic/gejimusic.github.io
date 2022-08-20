/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
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
      song_src: "",
      isPlaySongsInfo: true,
      hotComments: [],
      isHotComments: true,
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
          that.hotComments = [];
          that.isHotComments = false;
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
        that.isPlaying = true;
        this.comment(id);
        document.getElementsByTagName('video')[0].volume = 0.45;
      }, err=>{})
    },

    playSongsInfo() {
      this.isPlaySongsInfo = !this.isPlaySongsInfo;
    },

    DisplayHotComments() {
      this.isHotComments = !this.isHotComments
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