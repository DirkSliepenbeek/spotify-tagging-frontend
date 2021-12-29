<script>
import $store from "@/store";
import {mapState} from "vuex";

export default {
  name: "SpotifyApiMixin",
  computed: {

    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
      accessToken: state => state.accessToken,
      refreshToken: state => state.refreshToken,
      userId: state => state.userId,
      clientId: state => state.clientId,
      clientSecret: state => state.clientSecret,
      spotifyAuthUrl: state => state.spotifyAuthUrl,
      spotifyTokenUrl: state => state.spotifyTokenUrl,
      redirectUri: state => state.redirectUri,
    }),
    ...mapState('tracks', {
      tags: state => state.tags,
      playlists: state => state.playlists,
      tracks: state => state.tracks,
    }),
  },
  methods: {
    async submitApp() {
      let url = this.spotifyAuthUrl;
      url += "?client_id=" + this.clientId;
      url += "&response_type=code";
      url += "&scopes=web-playback";
      url += "&redirect_uri=" + encodeURI(this.redirectUri)
      url += "&show_dialog=True";
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
      console.log(this.clientId, this.clientSecret)
      await this.callAuthorizationApi(body)
    },
    async callAuthorizationApi(body) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", this.spotifyTokenUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.clientId + ":" + this.clientSecret));
      console.log(this.spotifyTokenUrl)
      xhr.send(body);
      xhr.onload = async function () {
        if (this.status === 200) {
          var data = JSON.parse(this.responseText);
          if (data.access_token !== undefined) {
            $store.commit('auth/SET_ACCESS_TOKEN', data.access_token)
          }
          if (data.refresh_token !== undefined) {
            $store.commit('auth/SET_REFRESH_TOKEN', data.refresh_token)
          }
          await $store.dispatch('auth/fetchUser', {'accessToken': data.access_token})

          $store.commit('auth/SET_LOG_IN', true)
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