import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        clientId: "2aa99d4e3f9d491f86043aaa41f43000",
        clientSecret: "414244e090d9468d99aea9c7ea9ac4a6",
        spotifyAuthUrl: "https://accounts.spotify.com/authorize",
        spotifyTokenUrl: "https://accounts.spotify.com/api/token",
        redirectUri: "http://localhost:8080/",
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        playlists: null,
        tracks: null,
        tags: null,
    },
    mutations: {
        SET_ACCESS_TOKEN(state, accessToken) {
            console.log('accessToken :', accessToken)
            state.accessToken = accessToken
        },

        SET_REFRESH_TOKEN(state, refreshToken) {
            console.log('refreshToken :', refreshToken)
            state.refreshToken = refreshToken
        },
        SET_LOG_IN(state, loggedIn) {
            console.log('loggedIn :', loggedIn)
            state.loggedIn = loggedIn
        },
        SET_USER_ID(state, userId) {
            state.userId = userId
            console.log('userId :', userId)
        },
        SET_PLAYLISTS(state, playlists) {
            console.log('playlists: ', playlists)
            state.playlists = playlists.items
        },
        SET_TRACKS(state, tracks) {
            console.log('tracks: ', tracks)
            state.tracks = tracks
        },
        SET_TAGS_PLAYLIST(state) {
            state.tags = []
            state.playlists.forEach(playlist => state.tags.push(playlist.name))
        },
    },
    actions: {
        async fetchUser(context, payload) {
            let baseURI = `https://api.spotify.com/v1/me`
            let response = await this._vm.$api.get(baseURI, {
                headers: {
                    "Authorization": 'Bearer ' + payload['accessToken'],
                }
            });
            return response.data
        },
        async fetchPlaylists({commit}, payload) {
            let baseURI = `https://api.spotify.com/v1/me`
            let response = await this._vm.$api.get(baseURI, {
                headers: {
                    "Authorization": 'Bearer ' + payload['accessToken'],
                }
            });
            commit('SET_USER_ID', response.data.id)
            baseURI = `https://api.spotify.com/v1/users/${response.data.id}/playlists`
            this._vm.$api.get(baseURI, {
                headers: {
                    "Authorization": 'Bearer ' + payload['accessToken'],
                }
            })
                .then(async response => {
                    commit('SET_PLAYLISTS', response.data)
                    payload['playlists'] = response.data.items
                    let tracks = await this.dispatch('fetchTracks', payload)
                    commit('SET_TRACKS', tracks)
                    commit('SET_TAGS_PLAYLIST')

                })
        },

        async fetchTracks(context, payload) {
            let allTracks = []
            let offsetAdd = 100
            for (const playlist of payload['playlists']) {
                let numberOfCallsRequired = Math.floor(playlist.tracks.total / offsetAdd)
                numberOfCallsRequired = (numberOfCallsRequired === 0) ? 1 : numberOfCallsRequired;
                console.log(numberOfCallsRequired)
                let offset = 0
                for (let step = 0; step < numberOfCallsRequired - 1; step++) {
                    console.log(offset)
                    let baseURI = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?offset=${offset}`
                    let response = await this._vm.$api.get(baseURI, {
                        headers: {
                            "Authorization": 'Bearer ' + payload['accessToken'],
                        }
                    })
                    response.data.items.forEach(track => {
                        track['tags'] = []
                        track['tags'].push(playlist.name)
                        allTracks.push(track)

                    })

                    allTracks.push(response.data.items)
                    offset += offsetAdd
                }
            }
            return allTracks
        }
    },

})
