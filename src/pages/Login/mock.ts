import { MockHttpCode, MockHttpMethod, mockRequest } from "@/mock";

import type { DataFnParams } from '@/mock';

mockRequest({
  url: '/login',
  method: MockHttpMethod.POST,
  httpCode: MockHttpCode.BadRequest,
  data: ({ query, body }: DataFnParams) => {
    return ['That is a mock request'];
  },
});