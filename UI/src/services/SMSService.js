import axios from 'axios';
import AuthService from './AuthService'

const USER_API_BASE_URL = process.env.REACT_APP_URL_BASE + '/sms/';

class SMSService {

    get(){
        return axios.post(USER_API_BASE_URL + 'get', AuthService.getAuthHeader());
    }
}

export default new SMSService();