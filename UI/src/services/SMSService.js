import AuthService from './AuthService'

class SMSService {

    get(data, onSuccess, onError, onAuthRequired){
        AuthService.getWithAuth('get', data, null, onSuccess, onError, onAuthRequired);
    }
}

export default new SMSService();