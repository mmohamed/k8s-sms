import AuthService from './AuthService'

class SMSService {

    get(onSuccess, onError, onAuthRequired){
        AuthService.getWithAuth('get', null, onSuccess, onError, onAuthRequired);
    }
}

export default new SMSService();