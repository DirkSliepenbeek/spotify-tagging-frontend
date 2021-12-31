export const namespaced = true;
import SpotifyWebApi from "spotify-web-api-js";

export const state = {
    player: null,
    deviceId: null,
    currentTrack: null,
    pause: false,
}
export const mutations = {
    SET_PLAYER(state, player) {
        console.log('player: ', player)
        state.player = player
    },
    SET_DEVICE_ID(state, deviceId) {
        console.log('deviceId: ', deviceId)
        state.deviceId = deviceId
    },
    SET_CURRENT_TRACK(state, currentTrack) {
        console.log('currentTrack: ', currentTrack)
        state.currentTrack = currentTrack
    },
    SET_PAUSE(state, boolean) {
        state.pause = boolean
    },

}
export const actions = {
    async fetchWebPlaybackSDKPlayer(context) {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = context.rootState.auth.accessToken;
            // eslint-disable-next-line no-undef
            const player = new Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => {
                    cb(token);
                },
                volume: 0.5
            });

            player.addListener('ready', ({device_id}) => {
                context.commit('SET_DEVICE_ID', device_id)
                console.log('Ready with Device ID', device_id);
            });
            player.addListener('not_ready', ({device_id}) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('initialization_error', ({message}) => {
                console.log('initialization_error')
                console.error(message);
            });
            player.setName("Spotify tagging").then(() => {
                console.log('Player name updated!');
            });
            player.connect()
            context.commit('SET_PLAYER', player)

        }
    },
    playSong(context, payload) {
        let playParameterObj = {
            'device_id': context.state.deviceId,
            'uris': [payload.track.uri]
        };
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(context.rootState.auth.accessToken);
        spotifyApi.play(playParameterObj)
        context.commit('SET_CURRENT_TRACK', payload['track'])
        context.commit('SET_PAUSE', false)
    },
    togglePlay(context) {
        context.state.player.togglePlay()
        context.commit('SET_PAUSE', !context.state.pause)
    }
}




