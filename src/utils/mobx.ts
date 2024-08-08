import { observable, action, computed } from 'mobx';


/**
 *  auto generate observable, action, computed annotations
 * 
 * - observable: for all properties
 * - action: for all methods that start with 'set'
 * - computed: for all methods that start with 'get'
 * @param object source object `this`
 * @returns 
 */
export function getStoreAnnotations(object: Record<string, unknown>): Record<string, unknown> {
  const attributes: string[] = [
    ...Object.getOwnPropertyNames(object),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(object))
  ];
  const annotations = attributes.reduce((obj: Record<string, unknown>, key) => {
    const isFunction = typeof object[key] === 'function';
    if (isFunction) {
      key.startsWith('get') && (obj[key] = computed);
      key.startsWith('set') && (obj[key] = action);
    } else {
      obj[key] = observable;
    }
    return obj
  }, {});
  return annotations;
}