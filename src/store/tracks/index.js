
export const namespaced = true;

export const state = {
    playlists: null,
    tracks: null,
    tags: null,
    selectedTags: null
}
export const mutations = {
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
    SET_SELECTED_TAGS(state, indices) {
        state.selectedTags = []
        indices.forEach(index => state.selectedTags.push(state.tags[index]))
    }
}
export const actions = {
    async fetchPlaylists(context, payload) {
        let baseURI = `https://api.spotify.com/v1/users/${payload['userId']}/playlists`
        this._vm.$api.get(baseURI, {
            headers: {
                "Authorization": 'Bearer ' + payload['accessToken'],
            }
        })
            .then(async response => {
                context.commit('SET_PLAYLISTS', response.data)
                payload['playlists'] = response.data.items
                await context.dispatch('fetchTracks', payload)

                context.commit('SET_TAGS_PLAYLIST')
            })
    },
    async fetchTracks({commit}, payload) {
        let allTracks = []
        let offsetAdd = 100
        for (const playlist of payload['playlists']) {
            let playlistTracks = []
            let numberOfCallsRequired = Math.floor(playlist.tracks.total / offsetAdd)
            numberOfCallsRequired = (numberOfCallsRequired === 0) ? 1 : numberOfCallsRequired;
            let offset = 0

            // // TODO temporary to test easily
            // if (numberOfCallsRequired > 1) {
            //     continue
            // }
            for (let step = 0; step < numberOfCallsRequired; step++) {
                let baseURI = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?offset=${offset}`
                let response = await this._vm.$api.get(baseURI, {
                    headers: {
                        "Authorization": 'Bearer ' + payload['accessToken'],
                    }
                })
                response.data.items.forEach(track => {
                    track['tags'] = []
                    track['tags'].push(playlist.name)
                    playlistTracks.push(track)
                })
                offset += offsetAdd
            }
            playlistTracks.forEach(track => allTracks.push(track))
        }
        commit('SET_TRACKS', allTracks)
    },
    selectTags({commit}, payload) {
        commit('SET_SELECTED_TAGS', payload)
    }


}




