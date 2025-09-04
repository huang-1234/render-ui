// H5 设备 API 实现

export const device = {
  // 获取设备信息
  async getDeviceInfo(): Promise<{
    brand: string;
    model: string;
    system: string;
    platform: string;
  }> {
    const userAgent = navigator.userAgent;
    
    return {
      brand: getBrand(userAgent),
      model: getModel(userAgent),
      system: getSystem(userAgent),
      platform: 'h5'
    };
  },

  // 获取网络类型
  async getNetworkType(): Promise<string> {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType || 'unknown';
    }
    return 'unknown';
  },

  // 获取电池信息
  async getBatteryInfo(): Promise<{
    level: number;
    charging: boolean;
  } | null> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level,
          charging: battery.charging
        };
      } catch {
        return null;
      }
    }
    return null;
  },

  // 震动
  vibrate(pattern?: number | number[]): boolean {
    if ('vibrate' in navigator) {
      if (pattern) {
        return navigator.vibrate(pattern);
      } else {
        return navigator.vibrate(200);
      }
    }
    return false;
  },

  // 获取地理位置
  async getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  // 监听网络状态变化
  onNetworkStatusChange(callback: (isOnline: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  // 检查是否在线
  isOnline(): boolean {
    return navigator.onLine;
  }
};

// 辅助函数
function getBrand(userAgent: string): string {
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'Apple';
  if (/Samsung/.test(userAgent)) return 'Samsung';
  if (/Huawei/.test(userAgent)) return 'Huawei';
  if (/Xiaomi/.test(userAgent)) return 'Xiaomi';
  if (/OPPO/.test(userAgent)) return 'OPPO';
  if (/vivo/.test(userAgent)) return 'vivo';
  return 'Unknown';
}

function getModel(userAgent: string): string {
  // iPhone 型号识别
  if (/iPhone/.test(userAgent)) {
    const match = userAgent.match(/iPhone\s*([^;)]+)/);
    return match ? match[1].trim() : 'iPhone';
  }
  
  // Android 型号识别
  if (/Android/.test(userAgent)) {
    const match = userAgent.match(/;\s*([^)]+)\s*\)/);
    return match ? match[1].trim() : 'Android Device';
  }
  
  return 'Unknown';
}

function getSystem(userAgent: string): string {
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    const match = userAgent.match(/OS\s+([\d_]+)/);
    return match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  }
  
  if (/Android/.test(userAgent)) {
    const match = userAgent.match(/Android\s+([\d.]+)/);
    return match ? `Android ${match[1]}` : 'Android';
  }
  
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Mac/.test(userAgent)) return 'macOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  
  return 'Unknown';
}