import { makeObservable } from "mobx";
import { getStoreAnnotations } from "@/utils/mobx";

import type { AnnotationsMap } from "mobx";
import type { UserInfoType } from '@/types/userInfo';

export class UserStore {
  constructor() {
    // tranform properties to observable, 'get' function to computed and 'set' function to action
    const annotations = getStoreAnnotations(this);
    const customAnnotations = {};
    makeObservable(this, {
      ...annotations,
      ...customAnnotations,
    } as unknown as AnnotationsMap<this, never>);
  }

  // index signatures: for `typeof this[key]` and Record<string, unknown>
  [key: string]: unknown;

  public userName: string | null = null;

  public token: string | null = null;

  public userInfo: UserInfoType | null = null;

  public setUserName(name: string | null) {
    this.userName = name;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public setUserInfo(userInfo: UserInfoType | null) {
    this.userInfo = userInfo;
  }
}
