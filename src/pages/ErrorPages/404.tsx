import React from 'react';

import { useRouteError } from 'react-router-dom';

const Error404: React.FC = () => {
  const error = useRouteError() as Record<string, string>;
  console.error(error);
  return (
    <div>
      This is a 404 page
      <p>error: {error.message}</p>
    </div>
  )
}

export default Error404;