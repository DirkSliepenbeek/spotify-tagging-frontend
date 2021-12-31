import $store from "@/store";

export const namespaced = true;


export const state = {
    clientId: "2aa99d4e3f9d491f86043aaa41f43000",
    clientSecret: "414244e090d9468d99aea9c7ea9ac4a6",
    spotifyAuthUrl: "https://accounts.spotify.com/authorize",
    spotifyTokenUrl: "https://accounts.spotify.com/api/token",
    spotifyApi: null,
    redirectUri: "http://localhost:8080/",
    loggedIn: false,
    accessToken: null,
    refreshToken: null,
    userId: null,
}
export const mutations = {
    SET_ACCESS_TOKEN(state, accessToken) {
        console.log('accessToken :', accessToken)
        state.accessToken = accessToken
        localStorage.setItem("access_token", accessToken)
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
        console.log('refreshToken :', refreshToken)
        state.refreshToken = refreshToken
        localStorage.setItem("refresh_token", refreshToken)

    },
    SET_LOG_IN(state, loggedIn) {
        console.log('loggedIn :', loggedIn)
        state.loggedIn = loggedIn
    },
    SET_USER_ID(state, userId) {
        state.userId = userId
        console.log('userId :', userId)
    },

}
export const actions = {
    async fetchUser({commit}, payload) {
        let baseURI = `https://api.spotify.com/v1/me`
        let response = await this._vm.$api.get(baseURI, {
            headers: {
                "Authorization": 'Bearer ' + payload['accessToken'],
            }
        })
        commit('SET_USER_ID', response.data.id)
    },
    async handleRedirect(context) {
        let code = await context.dispatch('getCode')
        await context.dispatch('fetchAccessToken', code)
    },
    async fetchAccessToken(context, code) {
        let body = 'grant_type=authorization_code';
        body += "&code=" + code;
        body += "&redirect_uri=" + encodeURI(context.state.redirectUri);
        body += "&client_id=" + context.state.clientId;
        body += "&client_secret=" + context.state.clientSecret;
        await context.dispatch('callAuthorizationApi', body)
    },
    async refreshToken(context) {
        let body = 'grant_type=refresh_token';
        body += `&refresh_token=${context.state.refreshToken}`
        await context.dispatch('callAuthorizationApi', body)
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

    async submitApp(context) {
        let url = context.state.spotifyAuthUrl;
        url += "?client_id=" + context.state.clientId;
        url += "&response_type=code";
        url += "&scope=streaming app-remote-control";
        url += "&redirect_uri=" + encodeURI(context.state.redirectUri)
        url += "&show_dialog=true";
        window.location.href = url
    },
    async callAuthorizationApi(context, body) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", context.state.spotifyTokenUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(context.state.clientId + ":" + context.state.clientSecret));
        xhr.send(body);
        xhr.onload = async function () {
            if (this.status === 200) {
                var data = JSON.parse(this.responseText);
                console.log(data)
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




