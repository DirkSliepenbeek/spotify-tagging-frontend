import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        playlists: null,
        tracks: null,
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
        }
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
            console.log(allTracks)
            return allTracks
        }
    },
    // getters: {
    //     loggedIn: state => {
    //         return state.loggedIn
    //     },
    //     accessToken: state => {
    //         return state.accessToken
    //     },
    //     refreshToken: state => {
    //         return state.refreshToken
    //     },
    //     userId: state => {
    //         return state.userId
    //     },
    //     playlists: state => {
    //         return state.playlists
    //     },
    // },

})
