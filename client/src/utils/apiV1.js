import axios from 'axios';
import apiBase from '../config';

class V1 {
  constructor() {
    this.baseURL = apiBase;
    this.authToken = null;
    this.noAuthReq = null;
    this.authReq = null;
  }

  authHeaders() {
    this.authToken = localStorage.getItem('authToken');
    return {
      'x-auth': this.authToken,
    };
  }

  get auth() {
    if (!this.authReq) {
      this.authReq = axios.create({
        baseURL: `${this.baseURL}/api`,
        headers: this.authHeaders(),
      });
    }
    return this.authReq;
  }

  get noAuth() {
    if (!this.noAuthReq) {
      this.noAuthReq = axios.create({ baseURL: `${this.baseURL}/auth` });
    }
    return this.noAuthReq;
  }
}

const apiv1 = new V1();
export default apiv1;
