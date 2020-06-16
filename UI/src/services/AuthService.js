import axios from 'axios';

const USER_API_BASE_URL = window._env && window._env.REACT_APP_URL_BASE ? window._env.REACT_APP_URL_BASE : process.env.REACT_APP_URL_BASE;

class AuthService {

    getWithAuth(path, data, options, onSuccess, onError, onAuthRequired, dontRetry){
        this.withAuth(null, path, data, options, onSuccess, onError, onAuthRequired, dontRetry);
    }

    withAuth(method, path, data, options, onSuccess, onError, onAuthRequired, dontRetry){
        let user = this.getUserInfo()
        if(!user){
            if('function' == typeof onError){
                onAuthRequired()
            }
            return;
        }
        let config = options || {}
        config.headers = {
            ...config.headers,
            Authorization: 'Bearer ' + user.token 
        };
        config.url = USER_API_BASE_URL + path;
        config.method = method || 'get';
        config.data = method === 'post' ? data : null;
        config.params = method !== 'post' ? data : null;
        axios.request(config).then(res => {
            if(res.status === 200 || res.status === 201){
                if('function' == typeof onSuccess){
                    onSuccess(res.data)
                }
            }else {
                if('function' == typeof onError){
                    onError(res.data.message);
                }
            }
        }).catch(error => {
            if(!dontRetry && error.response && (401 === error.response.status || 422 === error.response.status)){
                // try to refresh
                let that = this;
                this.refresh(function(){
                    that.withAuth(method, path, data, options, onSuccess, onError, onAuthRequired, true)
                }, onAuthRequired);
            }else{
                console.debug(error);
                if('function' == typeof onError){
                    onError('Unable to communicate with server !');
                }
            }
        });
    }

    getUserInfo(){
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    getAuthHeader() {
       return {headers: {Authorization: 'Bearer ' + this.getUserInfo().token }};
    }

    logout() {
        localStorage.removeItem('userInfo');
    }

    refresh(onSuccess, onError){
        let user = this.getUserInfo()
        if(!user){
            if('function' == typeof onError){
                onError()
            }
            return;
        }
        axios.post(USER_API_BASE_URL + 'refresh', null, {headers: {Authorization: 'Bearer ' + user.refreshToken }}).then(res => {
            if(res.status === 200){
                user.token = res.data.access_token;
                localStorage.setItem('userInfo', JSON.stringify(user));
                if('function' == typeof onSuccess){
                    onSuccess(user)
                }
            }else {
                if('function' == typeof onError){
                    onError(res.data.message);
                }
            }
        }).catch(error => {
            if('function' == typeof onError){
                if(error.response && 401 === error.response.status){
                    onError('Invalid credentials !');
                }else{
                    onError('Unable to communicate with server !');
                }
            }
        });
    }

    auth(credentials, onSuccess, onError){
        axios.post(USER_API_BASE_URL + 'auth', credentials).then(res => {
            if(res.status === 200){
                credentials.token = res.data.access_token;
                credentials.refreshToken = res.data.refresh_token;
                localStorage.setItem('userInfo', JSON.stringify(credentials));
                onSuccess(credentials)
            }else {
                onError(res.data.message);
            }
        }).catch(error => {
            if(error.response && 401 === error.response.status){
                onError('Invalid credentials !');
            }else{
                onError('Unable to communicate with server !');
            }
        });
    }
}

export default new AuthService();