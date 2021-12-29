export const namespaced = true;


export const state = {
    clientId: "2aa99d4e3f9d491f86043aaa41f43000",
    clientSecret: "414244e090d9468d99aea9c7ea9ac4a6",
    spotifyAuthUrl: "https://accounts.spotify.com/authorize",
    spotifyTokenUrl: "https://accounts.spotify.com/api/token",
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
}
export const actions = {
    async fetchUser({commit}, payload) {
        let baseURI = `https://api.spotify.com/v1/me`
        let response = await this._vm.$api.get(baseURI, {
            headers: {
                "Authorization": 'Bearer ' + payload['accessToken'],
            }
        });
        commit('SET_USER_ID', response.data.id)
    },


}




