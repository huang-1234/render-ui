// H5 网络 API 实现

export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

export interface RequestResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export const network = {
  // 发起网络请求
  async request(options: RequestOptions): Promise<RequestResponse> {
    const {
      url,
      method = 'GET',
      data,
      headers = {},
      timeout = 10000,
      responseType = 'json',
      withCredentials = false
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: controller.signal,
        credentials: withCredentials ? 'include' : 'same-origin'
      };

      if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        if (headers['Content-Type']?.includes('application/json')) {
          fetchOptions.body = JSON.stringify(data);
        } else if (headers['Content-Type']?.includes('application/x-www-form-urlencoded')) {
          fetchOptions.body = new URLSearchParams(data).toString();
        } else if (data instanceof FormData) {
          fetchOptions.body = data;
          // 删除 Content-Type，让浏览器自动设置
          delete (fetchOptions.headers as any)['Content-Type'];
        } else {
          fetchOptions.body = data;
        }
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      let responseData: any;
      switch (responseType) {
        case 'json':
          responseData = await response.json();
          break;
        case 'text':
          responseData = await response.text();
          break;
        case 'blob':
          responseData = await response.blob();
          break;
        case 'arraybuffer':
          responseData = await response.arrayBuffer();
          break;
        default:
          responseData = await response.json();
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  },

  // GET 请求
  async get(url: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse> {
    let requestUrl = url;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      requestUrl += queryString ? `?${queryString}` : '';
    }

    return this.request({
      url: requestUrl,
      method: 'GET',
      ...options
    });
  },

  // POST 请求
  async post(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse> {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  },

  // PUT 请求
  async put(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse> {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  },

  // DELETE 请求
  async delete(url: string, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<RequestResponse> {
    return this.request({
      url,
      method: 'DELETE',
      ...options
    });
  },

  // PATCH 请求
  async patch(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse> {
    return this.request({
      url,
      method: 'PATCH',
      data,
      ...options
    });
  },

  // 上传文件
  async upload(url: string, file: File | Blob, options?: {
    name?: string;
    filename?: string;
    headers?: Record<string, string>;
    data?: Record<string, any>;
    onProgress?: (progress: number) => void;
  }): Promise<RequestResponse> {
    const { name = 'file', filename, headers = {}, data = {}, onProgress } = options || {};

    const formData = new FormData();
    
    // 添加文件
    if (filename) {
      formData.append(name, file, filename);
    } else {
      formData.append(name, file);
    }

    // 添加其他数据
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 监听上传进度
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              data,
              status: xhr.status,
              statusText: xhr.statusText,
              headers: this.parseResponseHeaders(xhr.getAllResponseHeaders())
            });
          } catch {
            resolve({
              data: xhr.responseText,
              status: xhr.status,
              statusText: xhr.statusText,
              headers: this.parseResponseHeaders(xhr.getAllResponseHeaders())
            });
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });

      xhr.open('POST', url);

      // 设置请求头
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(formData);
    });
  },

  // 下载文件
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || this.getFilenameFromUrl(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  },

  // 解析响应头
  parseResponseHeaders(headerString: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!headerString) return headers;

    headerString.split('\r\n').forEach(line => {
      const [key, value] = line.split(': ');
      if (key && value) {
        headers[key.toLowerCase()] = value;
      }
    });

    return headers;
  },

  // 从 URL 获取文件名
  getFilenameFromUrl(url: string): string {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() || 'download';
  },

  // 检查网络状态
  isOnline(): boolean {
    return navigator.onLine;
  },

  // 监听网络状态变化
  onNetworkChange(callback: (isOnline: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};