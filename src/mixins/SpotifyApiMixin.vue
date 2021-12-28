<script>
import $store from "@/store";
import {mapState} from "vuex";

export default {
  name: "SpotifyApiMixin",
  computed: mapState({
    spotifyAuthUrl: state => state.spotifyAuthUrl,
    spotifyTokenUrl: state => state.spotifyTokenUrl,
    redirectUri: state => state.redirectUri,
    clientId: state => state.clientId,
    clientSecret: state => state.clientSecret,
    loggedIn: state => state.loggedIn,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken,
    userId: state => state.userId,
    playlists: state => state.playlists,
    tracks: state => state.tracks
  }),
  methods: {
    async submitApp() {
      let url = this.spotifyAuthUrl;
      url += "?client_id=" + this.clientId;
      url += "&response_type=code";
      url += "&redirect_uri=" + encodeURI(this.redirectUri)
      url += "&show_dialog=False";
      window.location.href = url
    },

    async handleRedirect() {
      let code = await this.getCode();
      await this.fetchAccessToken(code);
      return 'done'
    },

    async getCode() {
      let code = null;
      const querystring = window.location.search;
      if (querystring.length > 0) {
        const urlParams = new URLSearchParams(querystring);
        code = urlParams.get('code')
      }
      return code;
    },

    async fetchAccessToken(code) {
      let body = 'grant_type=authorization_code';
      body += "&code=" + code;
      body += "&redirect_uri=" + encodeURI(this.redirectUri);
      body += "&client_id=" + this.clientId;
      body += "&client_secret=" + this.clientSecret;
      await this.callAuthorizationApi(body)
    },

    async callAuthorizationApi(body) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", this.spotifyTokenUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.clientId + ":" + this.clientSecret));
      xhr.send(body);
      xhr.onload = function () {
        if (this.status === 200) {
          var data = JSON.parse(this.responseText);
          if (data.access_token !== undefined) {
            $store.commit('SET_ACCESS_TOKEN', data.access_token)
          }
          if (data.refresh_token !== undefined) {
            $store.commit('SET_REFRESH_TOKEN', data.refresh_token)
          }
          $store.commit('SET_LOG_IN', true)
        } else {
          console.log(this.responseText)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>