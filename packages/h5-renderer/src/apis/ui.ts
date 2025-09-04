// H5 UI API 实现

export const ui = {
  // 显示提示
  showToast(options: {
    title: string;
    icon?: 'success' | 'error' | 'loading' | 'none';
    duration?: number;
    mask?: boolean;
  }): void {
    const { title, icon = 'none', duration = 2000, mask = false } = options;
    
    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = 'cross-toast';
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 9999;
      max-width: 80%;
      text-align: center;
      word-wrap: break-word;
    `;

    // 添加图标
    if (icon !== 'none') {
      const iconElement = document.createElement('div');
      iconElement.style.cssText = `
        margin-bottom: 8px;
        font-size: 24px;
      `;
      
      switch (icon) {
        case 'success':
          iconElement.textContent = '✓';
          iconElement.style.color = '#52c41a';
          break;
        case 'error':
          iconElement.textContent = '✗';
          iconElement.style.color = '#ff4d4f';
          break;
        case 'loading':
          iconElement.textContent = '⟳';
          iconElement.style.animation = 'spin 1s linear infinite';
          break;
      }
      
      toast.appendChild(iconElement);
    }

    // 添加文本
    const textElement = document.createElement('div');
    textElement.textContent = title;
    toast.appendChild(textElement);

    // 添加遮罩
    let maskElement: HTMLElement | null = null;
    if (mask) {
      maskElement = document.createElement('div');
      maskElement.className = 'cross-toast-mask';
      maskElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
        z-index: 9998;
      `;
      document.body.appendChild(maskElement);
    }

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .cross-toast {
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // 自动移除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      if (maskElement && maskElement.parentNode) {
        maskElement.parentNode.removeChild(maskElement);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, duration);
  },

  // 显示加载
  showLoading(options: {
    title?: string;
    mask?: boolean;
  }): void {
    this.hideLoading(); // 先隐藏之前的加载

    const { title = '加载中...', mask = true } = options;
    
    const loading = document.createElement('div');
    loading.id = 'cross-loading';
    loading.className = 'cross-loading';
    loading.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      text-align: center;
      min-width: 120px;
    `;

    // 添加加载图标
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 24px;
      height: 24px;
      border: 2px solid #ffffff40;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      margin: 0 auto 12px;
      animation: spin 1s linear infinite;
    `;

    // 添加文本
    const text = document.createElement('div');
    text.textContent = title;

    loading.appendChild(spinner);
    loading.appendChild(text);

    // 添加遮罩
    if (mask) {
      const maskElement = document.createElement('div');
      maskElement.id = 'cross-loading-mask';
      maskElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 9999;
      `;
      document.body.appendChild(maskElement);
    }

    document.body.appendChild(loading);
  },

  // 隐藏加载
  hideLoading(): void {
    const loading = document.getElementById('cross-loading');
    const mask = document.getElementById('cross-loading-mask');
    
    if (loading && loading.parentNode) {
      loading.parentNode.removeChild(loading);
    }
    if (mask && mask.parentNode) {
      mask.parentNode.removeChild(mask);
    }
  },

  // 显示模态对话框
  showModal(options: {
    title?: string;
    content: string;
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
  }): Promise<{ confirm: boolean; cancel: boolean }> {
    return new Promise((resolve) => {
      const {
        title = '提示',
        content,
        showCancel = true,
        cancelText = '取消',
        confirmText = '确定'
      } = options;

      // 创建遮罩
      const mask = document.createElement('div');
      mask.className = 'cross-modal-mask';
      mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // 创建模态框
      const modal = document.createElement('div');
      modal.className = 'cross-modal';
      modal.style.cssText = `
        background: white;
        border-radius: 8px;
        min-width: 280px;
        max-width: 80%;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      `;

      // 标题
      const titleElement = document.createElement('div');
      titleElement.style.cssText = `
        padding: 20px 20px 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        text-align: center;
      `;
      titleElement.textContent = title;

      // 内容
      const contentElement = document.createElement('div');
      contentElement.style.cssText = `
        padding: 16px 20px 20px;
        font-size: 14px;
        color: #666;
        text-align: center;
        line-height: 1.5;
      `;
      contentElement.textContent = content;

      // 按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        border-top: 1px solid #eee;
      `;

      // 取消按钮
      if (showCancel) {
        const cancelButton = document.createElement('button');
        cancelButton.style.cssText = `
          flex: 1;
          padding: 16px;
          border: none;
          background: none;
          font-size: 16px;
          color: #666;
          cursor: pointer;
          border-right: 1px solid #eee;
        `;
        cancelButton.textContent = cancelText;
        cancelButton.onclick = () => {
          document.body.removeChild(mask);
          resolve({ confirm: false, cancel: true });
        };
        buttonContainer.appendChild(cancelButton);
      }

      // 确定按钮
      const confirmButton = document.createElement('button');
      confirmButton.style.cssText = `
        flex: 1;
        padding: 16px;
        border: none;
        background: none;
        font-size: 16px;
        color: #1890ff;
        cursor: pointer;
        font-weight: 500;
      `;
      confirmButton.textContent = confirmText;
      confirmButton.onclick = () => {
        document.body.removeChild(mask);
        resolve({ confirm: true, cancel: false });
      };
      buttonContainer.appendChild(confirmButton);

      modal.appendChild(titleElement);
      modal.appendChild(contentElement);
      modal.appendChild(buttonContainer);
      mask.appendChild(modal);

      // 点击遮罩关闭
      mask.onclick = (e) => {
        if (e.target === mask) {
          document.body.removeChild(mask);
          resolve({ confirm: false, cancel: true });
        }
      };

      document.body.appendChild(mask);
    });
  },

  // 显示操作菜单
  showActionSheet(options: {
    itemList: string[];
    itemColor?: string;
  }): Promise<{ tapIndex: number }> {
    return new Promise((resolve, reject) => {
      const { itemList, itemColor = '#000' } = options;

      if (!itemList || itemList.length === 0) {
        reject(new Error('itemList cannot be empty'));
        return;
      }

      // 创建遮罩
      const mask = document.createElement('div');
      mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      `;

      // 创建操作菜单
      const actionSheet = document.createElement('div');
      actionSheet.style.cssText = `
        background: white;
        width: 100%;
        max-width: 400px;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      `;

      // 添加选项
      itemList.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.style.cssText = `
          padding: 16px;
          text-align: center;
          font-size: 16px;
          color: ${itemColor};
          border-bottom: 1px solid #eee;
          cursor: pointer;
        `;
        itemElement.textContent = item;
        itemElement.onclick = () => {
          document.body.removeChild(mask);
          resolve({ tapIndex: index });
        };
        actionSheet.appendChild(itemElement);
      });

      // 取消按钮
      const cancelButton = document.createElement('div');
      cancelButton.style.cssText = `
        padding: 16px;
        text-align: center;
        font-size: 16px;
        color: #666;
        background: #f5f5f5;
        cursor: pointer;
      `;
      cancelButton.textContent = '取消';
      cancelButton.onclick = () => {
        document.body.removeChild(mask);
        reject(new Error('cancel'));
      };
      actionSheet.appendChild(cancelButton);

      mask.appendChild(actionSheet);

      // 点击遮罩关闭
      mask.onclick = (e) => {
        if (e.target === mask) {
          document.body.removeChild(mask);
          reject(new Error('cancel'));
        }
      };

      document.body.appendChild(mask);

      // 显示动画
      setTimeout(() => {
        actionSheet.style.transform = 'translateY(0)';
      }, 10);
    });
  }
};