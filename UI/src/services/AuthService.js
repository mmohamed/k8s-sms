import axios from 'axios';

const USER_API_BASE_URL = process.env.REACT_APP_URL_BASE + 'auth';

class AuthService {

    login(credentials){
        return axios.post(USER_API_BASE_URL , credentials);
    }

    getUserInfo(){
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    getAuthHeader() {
       return {headers: {Authorization: 'JWT ' + this.getUserInfo().token }};
    }

    logOut() {
        localStorage.removeItem('userInfo');
    }
}

export default new AuthService();