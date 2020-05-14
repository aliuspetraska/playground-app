import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as R from 'ramda';

@Injectable()
export class ConfigService {
  private config = {};

  constructor(private http: HttpClient) {}

  private getData(endpoint: any) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(endpoint, options).toPromise();
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: any) {
    this.config = R.mergeDeepRight(this.config, config);
  }

  load() {
    return new Promise((resolve, reject) => {
      this.getData(`${environment.hostUrl}api/config`)
        .then((response) => {
          this.setConfig(response);
          setTimeout(() => {
            resolve(true);
          }, 0);
        })
        .catch(() => {
          resolve(true);
        });
    });
  }
}
