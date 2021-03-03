import decode from 'jwt-decode'
import router from '../../router'

export default  {
 
    getToken({ commit }, token) {

        const user = decode(token)
        
        commit('SET_TOKEN', token)
        commit('SET_USER', user)

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    },

    autoLogin({ commit }) {
        const user = localStorage.getItem('user')

        if (user) {
            commit('SET_USER', user)
        }
    },
    
    logout({ commit }) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
        router.push({ name: 'Login'})
    }

}