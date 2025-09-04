// H5 存储 API 实现

export const storage = {
  // 设置存储
  async setItem(key: string, value: any): Promise<void> {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      throw new Error(`Failed to set storage item: ${error}`);
    }
  },

  // 获取存储
  async getItem(key: string): Promise<any> {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return null;
      }
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      throw new Error(`Failed to get storage item: ${error}`);
    }
  },

  // 移除存储
  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove storage item: ${error}`);
    }
  },

  // 清空存储
  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error}`);
    }
  },

  // 获取所有键
  async getAllKeys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      throw new Error(`Failed to get all keys: ${error}`);
    }
  },

  // 获取存储大小
  getSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
};

// Session Storage
export const sessionStorage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      throw new Error(`Failed to set session storage item: ${error}`);
    }
  },

  async getItem(key: string): Promise<any> {
    try {
      const value = window.sessionStorage.getItem(key);
      if (value === null) {
        return null;
      }
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      throw new Error(`Failed to get session storage item: ${error}`);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove session storage item: ${error}`);
    }
  },

  async clear(): Promise<void> {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      throw new Error(`Failed to clear session storage: ${error}`);
    }
  }
};