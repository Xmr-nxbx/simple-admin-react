import { MockHttpCode, MockHttpMethod, mockRequest } from "@/mock";

import type { DataFnParams } from '@/mock';

mockRequest({
  url: '/login',
  method: MockHttpMethod.POST,
  httpCode: MockHttpCode.BadRequest,
  data: ({ query, body }: DataFnParams) => {
    const { username, password } = body;
    return { username, password};
  },
  message: 'Login',
});