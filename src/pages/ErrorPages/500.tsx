import React from 'react';
import { observer } from 'mobx-react';


const Error500: React.FC = observer(({ store }: { store: any }) => {
  console.error(store.getError);
  return (
    <div>
      This is a 500 page
    </div>
  )
});

export default Error500;