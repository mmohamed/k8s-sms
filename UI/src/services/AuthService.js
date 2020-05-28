import axios from 'axios';

const USER_API_BASE_URL = process.env.REACT_APP_URL_BASE + '/token/';

class AuthService {

    login(credentials){
        return axios.post(USER_API_BASE_URL + "generate", credentials);
    }

    getUserInfo(){
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    getAuthHeader() {
       return {headers: {Authorization: 'Bearer ' + this.getUserInfo().token }};
    }

    logOut() {
        let header = this.getAuthHeader();
        let token = this.getUserInfo();
        localStorage.removeItem('userInfo');
        return axios.post(USER_API_BASE_URL + 'revoke', token, header);
    }
}

export default new AuthService();