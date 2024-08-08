import { useEffect } from 'react';
import { SystemStore } from '@/store/system'
import { useSnackbar, SnackbarProviderProps } from 'notistack';

export default function useAdminSnackbar(systemStore: SystemStore) {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (systemStore.snackBarMessages.length > 0) {
      systemStore.snackBarMessages.forEach((option: SnackbarProviderProps & { msg: string }) => {
        enqueueSnackbar(option.msg, option);
      });
      systemStore.clearSnackBarMessages();
    }
  }, [systemStore, systemStore.snackBarMessages, enqueueSnackbar]);
    
}