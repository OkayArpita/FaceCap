import NetInfo from '@react-native-community/netinfo';

export const watchConnectivity = (onChange: (online: boolean) => void): (() => void) =>
  NetInfo.addEventListener(state => {
    onChange(Boolean(state.isConnected));
  });

export const getConnectivity = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected);
};
