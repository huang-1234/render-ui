import React, { useState } from 'react';
import { View, Text, Input, Icon, createStyles } from '@cross-platform/components';

const InputDemo: React.FC = () => {
  const [basicValue, setBasicValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [multilineValue, setMultilineValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const styles = createStyles({
    section: {
      marginBottom: 20
    },
    title: {
      fontSize: 16,
      fontWeight: '500' as any,
      marginBottom: 10
    },
    demoContainer: {
      marginBottom: 10
    },
    description: {
      marginTop: 10,
      fontSize: 14,
      color: '#666'
    },
    inputContainer: {
      marginBottom: 15
    },
    stateContainer: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8
    },
    stateText: {
      fontSize: 14
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    inputWithButton: {
      flex: 1,
      marginRight: 10
    }
  });

  // 验证邮箱格式
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <View>
      {/* 基础输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="请输入内容"
              value={basicValue}
              onChangeText={setBasicValue}
            />
          </View>
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>当前值: {basicValue}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          基础的Input组件，支持输入文本并获取值。
        </Text>
      </View>

      {/* 密码输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>密码输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="请输入密码"
              value={passwordValue}
              onChangeText={setPasswordValue}
              secureTextEntry={true}
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用secureTextEntry属性创建密码输入框，输入的内容会被隐藏。
        </Text>
      </View>

      {/* 多行文本输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>多行文本输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="请输入多行文本"
              value={multilineValue}
              onChangeText={setMultilineValue}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用multiline和numberOfLines属性创建多行文本输入框。
        </Text>
      </View>

      {/* 带前缀和后缀的输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>带前缀和后缀的输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="请输入用户名"
              prefix={<Icon name="user" size={16} color="#999" />}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="请输入搜索内容"
              suffix={<Icon name="search" size={16} color="#999" />}
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用prefix和suffix属性添加前缀和后缀图标或文本。
        </Text>
      </View>

      {/* 可清除的输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>可清除的输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="输入后可清除"
              value={searchValue}
              onChangeText={setSearchValue}
              clearable={true}
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用clearable属性创建可清除的输入框，输入内容后会显示清除按钮。
        </Text>
      </View>

      {/* 错误状态输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>错误状态输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="请输入邮箱"
              value={errorValue}
              onChangeText={setErrorValue}
              error={errorValue !== '' && !validateEmail(errorValue)}
              errorText={
                errorValue !== '' && !validateEmail(errorValue)
                  ? '请输入有效的邮箱地址'
                  : ''
              }
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用error和errorText属性创建带有错误提示的输入框。
        </Text>
      </View>

      {/* 禁用和只读状态 */}
      <View style={styles.section}>
        <Text style={styles.title}>禁用和只读状态</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="禁用状态"
              value="这是禁用的输入框"
              disabled={true}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="只读状态"
              value="这是只读的输入框"
              readOnly={true}
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用disabled属性禁用输入框，使用readOnly属性创建只读输入框。
        </Text>
      </View>

      {/* 不同类型的输入框 */}
      <View style={styles.section}>
        <Text style={styles.title}>不同类型的输入框</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="数字输入框"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="电话输入框"
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="邮箱输入框"
              keyboardType="email-address"
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用keyboardType属性设置不同类型的输入框，会显示对应的键盘类型。
        </Text>
      </View>

      {/* 自定义样式 */}
      <View style={styles.section}>
        <Text style={styles.title}>自定义样式</Text>
        <View style={styles.demoContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="自定义样式"
              style={{ backgroundColor: '#f0f7ff' }}
              inputStyle={{
                borderColor: '#1890ff',
                borderRadius: 20,
                paddingHorizontal: 20
              }}
            />
          </View>
        </View>
        <Text style={styles.description}>
          使用style和inputStyle属性自定义输入框的外观样式。
        </Text>
      </View>
    </View>
  );
};

export default InputDemo;
