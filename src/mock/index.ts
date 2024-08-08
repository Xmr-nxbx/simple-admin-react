import Mock from "mockjs";
import { MockHttpMethod } from "./method";
import { MockHttpCode } from "./code";

import type { ResponseType } from "@/types/response";

type queryType = Record<string, string | string[]>;
type bodyType = Record<string, unknown>;

export interface DataFnParams {
  query: queryType;
  body: bodyType;
}

interface IMockRequestParams {
  url: string | RegExp;
  method?: string;
  httpCode?: number;
  message?: string | undefined;
  data: (({ query, body }: DataFnParams) => unknown) | unknown;
}

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Custom mock request function.
 * 
 * for example:
 * ```ts
 * mockRequest({
 *  url: '/api/user',
 *  method: 'get',
 *  httpCode: 200,
 *  data({ query, body }) {
 *    return {
 *      name: 'John Doe',
 *      age: 30,
 *    }
 *  },
 * })
 * ```
 * @param {IMockRequestParams} params
 * @returns void
 */
export function mockRequest({
  url,
  method,
  httpCode,
  message,
  data,
}: IMockRequestParams) {
  // validation
  const isValidUrl = typeof url === "string" || url instanceof RegExp;

  httpCode = httpCode || MockHttpCode.OK;

  if (!isValidUrl) {
    return;
  }

  // wrap url to regexp
  let targetUrl: RegExp | null = null;
  if (typeof url === "string") {
    url = url.startsWith("/") ? url : `/${url}`;
    targetUrl = new RegExp(`^${BASE_URL}${url}(\\?.*)?$`);
  } else {
    const source = url.source;
    const flag = url.flags;
    targetUrl = new RegExp(`^${BASE_URL}(?:${source})(\\?.*)?`, flag);
  }

  // mock url request
  const templateFn: Mock.templateOrFn = ({ url: currentUrl, body }): ResponseType => {
    // get query
    const urlObject = new URL(location.origin + currentUrl);
    const params = urlObject.searchParams;
    const query: queryType = {};
    params.forEach((value, key) => {
      if (query[key] !== undefined) {
        if (Array.isArray(query[key])) {
          query[key].push(value);
        } else {
          query[key] = [query[key], value];
        }
      } else {
        query[key] = value;
      }
    })

    // format body
    try {
      body = JSON.parse(body);
    } catch (error) {
      console.warn(`URL: ${currentUrl}, body is not a valid JSON.\n body: ${body}`);
    }

    const template: ResponseType = {
      status: httpCode,
      message: message || "This is a mock response",
      data: typeof data === 'function' ? data({ query, body }) : data,
    };

    return Mock.mock(template);
  }

  const isMethodValid = method && Object.values(MockHttpMethod).includes(method);
  const isAllMethod = method && method.toLowerCase() === MockHttpMethod.ALL;

  if (isMethodValid && !isAllMethod) {
    Mock.mock(targetUrl, method.toLowerCase(), templateFn);
  } else {
    Mock.mock(targetUrl, templateFn);
  }
}

export async function setupMock() {
  // enable each mock file in pages
  const moduleObject: Record<string, () => Promise<unknown>> = import.meta.glob(
    "../pages/**/*mock.ts"
  );

  Mock.setup({ timeout: '200-1000'});

  for (const module of Object.values(moduleObject)) {
    await module();
  }
}

export { MockHttpMethod, MockHttpCode };
