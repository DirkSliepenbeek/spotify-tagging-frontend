// eslint-disable-next-line no-unused-vars
import $store from "@/store";
import Vue from "vue";
import axios from "axios";

export const namespaced = true;


export const state = {
    password: "dirk",
    username: "dirksliepenbeek",
    url: "http://localhost:8000/",
    authToken: null,
}


Vue.prototype.$appApi = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        Authorization: `Basic ${state.authToken}`
    }
});


export const mutations = {
    SET_AUTH_TOKEN(state, authToken) {
        console.log('authToken :', authToken)
        state.authToken = authToken
        localStorage.setItem("auth_token", authToken)
    },
}
export const actions = {
    async fetchAuthToken(context) {
        let url = context.state.url + 'api-token-auth/'
        let response = await this._vm.$api.post(url,
            {
                "username": context.state.username,
                "password": context.state.password,
            },)
        context.commit('SET_AUTH_TOKEN', response.data.token)
    },
    async createTrack(context, payload) {
        let url = "http://localhost:8000/tracks/"

        let response = await this._vm.$api.post(url,
            payload, {headers:{
                'Authorization': `Token ${context.state.authToken}`}
            })
        console.log(response.data)
    }
}




