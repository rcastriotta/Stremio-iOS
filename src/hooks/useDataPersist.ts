import AsyncStorage from '@react-native-async-storage/async-storage';

export enum DataPersistKeys {
  USER = 'USER',
}

export default function useDataPersist() {
  async function setPersistData<T>(key: DataPersistKeys, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const jsonData = JSON.stringify(data);
      AsyncStorage.setItem(key, jsonData)
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  async function getPersistData<T>(key: DataPersistKeys): Promise<T> {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then(res => resolve(res ? JSON.parse(res) : undefined))
        .catch(err => reject(err));
    });
  }

  function removePersistData(key: DataPersistKeys): Promise<boolean> {
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem(key)
        .catch(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  async function removeAllPersistData() {
    return Promise.all(Object.values(DataPersistKeys).map(value => AsyncStorage.removeItem(value)));
  }

  return {
    setPersistData,
    getPersistData,
    removePersistData,
    removeAllPersistData,
  };
}
