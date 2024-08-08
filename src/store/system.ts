import { makeObservable, action } from "mobx";
import { getStoreAnnotations } from "@/utils/mobx";

import type { AnnotationsMap } from "mobx";
import type { SnackbarProviderProps } from "notistack";

import { LanguageEnum } from "@/types/language";

export class SystemStore {
  constructor() {
    // tranform properties to observable, 'get' function to computed and 'set' function to action
    const annotations = getStoreAnnotations(this);
    const customAnnotations = {
      addSnackBarMessage: action,
      clearSnackBarMessages: action,
    };
    makeObservable(this, {
      ...annotations,
      ...customAnnotations,
    } as unknown as AnnotationsMap<this, never>);
  }

  // index signatures: for `typeof this[key]`
  [key: string]: unknown;

  public isDarkMode: boolean = false;

  public reactErrorObject: Error | null = null;

  public snackBarMessages: (SnackbarProviderProps & { msg: string })[] = [];

  public language: LanguageEnum = LanguageEnum.zh_CN;

  setDarkMode(darkMode: boolean) {
    this.isDarkMode = darkMode;
  }

  setReactErrorObject(errorObject: Error | null) {
    this.reactErrorObject = errorObject;
  }

  setLanguage(language: LanguageEnum) {
    this.language = language;
  }

  addSnackBarMessage(message: string, props: SnackbarProviderProps) {
    this.snackBarMessages = [...this.snackBarMessages, { ...props, msg: message }];
  }

  clearSnackBarMessages() {
    this.snackBarMessages = [];
  }
}

const systemStore = new SystemStore();

export default systemStore;
