import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CacheService {

  constructor() {

  }

  public addToSessionStorage(key: string, item: any, timer: number = null) {
    let storageItem = {value: null, expiration: null};
    storageItem.value = item;
    if (timer) {
      storageItem.expiration = timer + new Date().getTime();
    } else {
      storageItem.expiration = null;
    }
    sessionStorage.setItem(key, JSON.stringify(storageItem));
  }

  public getFromSessionStorage(key: string = null) {
    if (!key) {
      return;
    }

    let storageItem = JSON.parse(sessionStorage.getItem(key));

    if (!storageItem) {
      return;
    }

    if (storageItem.expiration == null || storageItem.expiration > new Date().getTime()) {
      return storageItem.value;
    } else {
      return null;
    }
  }

  public checkInSessionStorage(key: string) {
    return !!sessionStorage.getItem(key);
  }

  public clearSessionStorage() {
    sessionStorage.clear();
  }
}
