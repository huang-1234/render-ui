/* eslint-disable import/no-extraneous-dependencies */
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
// import { go, rem } from '@cp/core';
import React from 'react';
import { Image as TinyImage } from 'react-native'

function go(url: string) {
  window.location.href = url;
}
function rem(value: number) {
  const baseFontSize = 12;
  const baseWidth = 414;
  return value * baseFontSize / baseWidth;
}
export function Price(props: any) {
  return <View>
    {props.children}
  </View>
}

export interface ICommonPrice {
  priceSuffixLabel: React.ReactNode;
}

export interface IGoodsCard {
  goodsId: number;
  goodsName: string;
  goodsImage: string;
  goodsPrice: number;
  goodsSoldCount: number;
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: rem(116),
    gap: rem(8),
    opacity: 1,
    borderRadius: rem(6),
    padding: rem(8),
    borderWidth: rem(0.5),
    borderColor: '#F0F1F5',
    backgroundColor: 'rgb(250, 251, 252)',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: rem(10),
  },
  titleContainer: {
    marginBottom: rem(4),
  },
  titleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: rem(15),
    fontWeight: '500',
    color: 'rgba(26, 31, 40, 1)',
    lineHeight: rem(21),
    textAlign: 'left',
    // @ts-ignore
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  productImage: {
    width: rem(100),
    height: rem(100),
    borderRadius: rem(4),
    marginRight: rem(8),
  },
  rightContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  addToShelfButton: {
    // 动态设置宽高，通过props传入
  },
  priceInfoContainer: {
    flex: 1,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rem(4),
  },
  salePriceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  salePriceLabel: {
    fontSize: rem(12),
    fontWeight: '400',
    color: 'rgba(122, 133, 153, 1)',
    lineHeight: rem(17),
    textAlign: 'left',
  },
  salePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: rem(2),
  },
  salePriceText: {
    fontSize: rem(12),
    fontWeight: '400',
    color: 'rgba(122, 133, 153, 1)',
    lineHeight: rem(17),
    textAlign: 'left',
  },
  salesInfoContainer: {
    marginTop: rem(8),
  },
  soldCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: rem(8),
  },
  soldCountText: {
    fontSize: rem(12),
    fontWeight: '400',
    color: 'rgba(122, 133, 153, 1)',
    lineHeight: rem(17),
    textAlign: 'left',
  },
  commissionContainer: {
    marginBottom: rem(8),
  },
  sellingPointContainer: {
    borderRadius: rem(2),
    overflow: 'hidden',
    marginBottom: rem(4),
    background:
      'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90.47deg, #FFFFFF 18.87%, #66FF50 54.05%, #00EDDF 66.22%, #00DEFA 92.92%, #2BE2FF 106.52%), linear-gradient(92.79deg, #FFEE34 -17.14%, #00CC12 7.03%, #04C2E3 53.1%, #04C2E3 88.97%)',
    paddingHorizontal: rem(4),
  },
  sellingPointTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: rem(18),
  },
  sellingPointText: {
    fontSize: rem(13),
    fontWeight: '400',
    textAlign: 'left',
    numberOfLines: 1,
    ellipsizeMode: 'tail',

    background:
      'linear-gradient(92.79deg, #FFEE34 -17.14%, #00CC12 7.03%, #04C2E3 53.1%, #04C2E3 88.97%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    lineHeight: rem(18),
  },
});

interface ProductImageProps {
  /**
   * @desc 图片URL
   */
  imageUrl: string;
  /**
   * @desc 宽度
   * @default 100
   */
  width?: number;
  /**
   * @desc 高度
   * @default 100
   */
  height?: number;
  /**
   * @desc 圆角
   * @default 4
   */
  borderRadius?: number;
  /**
   * @desc 右边距
   * @default 8
   */
  marginRight?: number;
  /**
   * @desc 缩放模式
   * @default 'cover'
   */
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  /**
   * @desc 点击事件
   */
  onPress?: () => void;
}

export const ProductImage = (props: ProductImageProps) => {
  const {
    imageUrl,
    width = 100,
    height = 100,
    borderRadius = 4,
    marginRight = 8,
    resizeMode = '',
    onPress = () => {},
  } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <TinyImage
        source={{ uri: imageUrl }}
        style={[
          styles.productImage,
          {
            width: rem(width),
            height: rem(height),
            borderRadius: rem(borderRadius),
            marginRight: rem(marginRight),
          },
        ]}
        resizeMode={resizeMode || 'cover'}
      />
    </TouchableOpacity>
  );
};

// 原子组件：商品标题
interface ProductTitleProps {
  title: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  numberOfLines?: number;
  marginBottom?: number;
}

export const ProductTitle = (props: ProductTitleProps) => {
  const {
    title,
    fontSize = 15,
    color = 'rgba(26, 31, 40, 1)',
    fontWeight = '500',
    numberOfLines = 1,
    marginBottom = 4,
  } = props;
  return (
    <View style={[styles.titleContainer, { marginBottom: rem(marginBottom) }]}>
      <View style={styles.titleTextContainer}>
        <Text
          style={[
            styles.titleText,
            // @ts-ignore
            {
              fontSize: rem(fontSize),
              color,
              fontWeight,
              lineHeight: rem(fontSize * 1.4),
            },
          ]}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export interface SellingPointHighlightProps {
  text: string;
  fontSize?: number;
  numberOfLines?: number;
  marginBottom?: number;
  paddingHorizontal?: number;
  height?: number;
  borderRadius?: number;
}

/**
 * @desc 卖点文本（渐变色）
 * @param
 * @returns
 */
export const SellingPointHighlight = (props: SellingPointHighlightProps) => {
  const {
    text,
    fontSize = 13,
    numberOfLines = 1,
    marginBottom = 4,
    paddingHorizontal = 0,
    height = 18,
    borderRadius = 2,
  } = props;
  return (
    <View
      style={[
        styles.sellingPointContainer,
        {
          marginBottom: rem(marginBottom),
          paddingHorizontal: rem(paddingHorizontal),
          borderRadius: rem(borderRadius),
        },
      ]}
    >
      <View style={[styles.sellingPointTextContainer, { height: rem(height) }]}>
        <Text
          style={[
            styles.sellingPointText,
            {
              fontSize: rem(fontSize),
              lineHeight: rem(height),
            },
          ]}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      </View>
    </View>
  );
};
interface CommissionInfoProps {
  rate: number;
  text: string;
  fontSize?: number;
  preText?: string;
  color?: string;
  fontWeight?: string;
  marginBottom?: number;
  labelBackgroundColor?: string;
  labelTextColor?: string;
  labelFontSize?: number;
}

export const CommissionInfo = (props: CommissionInfoProps) => {
  const {
    rate,
    text,
    fontSize = 20,
    preText = '赚',
    color = '#F23030',
    fontWeight = '600',
    marginBottom = 8,
    labelBackgroundColor = '#FEEAEA',
    labelTextColor = '#F23030',
    labelFontSize = 11,
  } = props || {};
  const priceSuffixLabel: ICommonPrice['priceSuffixLabel'] = React.useMemo(() => {
    return (
      <View
        style={{
          height: rem(20),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: labelBackgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: rem(2),
            paddingHorizontal: rem(4),
            marginLeft: rem(2),
            top: -1,
            borderRadius: rem(2),
          }}
        >
          <Text
            style={{
              color: labelTextColor,
              fontSize: rem(labelFontSize),
              lineHeight: rem(labelFontSize + 1),
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    );
  }, [text, labelBackgroundColor, labelTextColor, labelFontSize]);

  return (
    <View style={[styles.commissionContainer, { marginBottom: rem(marginBottom) }]}>
      <Price
        price={rate}
        fontSize={fontSize}
        unit={1}
        preText={preText}
        customStyle={{
          color,
          fontWeight,
        }}
        priceSuffixLabel={priceSuffixLabel}
        decimalSuit={false}
        preTextGap={2}
        hasSymbol={true}
      />
    </View>
  );
};

// 原子组件：价格信息
interface PriceInfoProps {
  price: string;
  soldCount: string;
  priceLabel?: string;
  fontSize?: number;
  color?: string;
  marginTop?: number;
  soldCountMarginLeft?: number;
}
/**
 * @desc 价格信息
 * @param props
 * @returns
 */
export const PriceInfo = (props: PriceInfoProps) => {
  const {
    price,
    soldCount,
    priceLabel = '售价',
    fontSize = 12,
    color = 'rgba(122, 133, 153, 1)',
    marginTop = 4,
    soldCountMarginLeft = 8,
  } = props;
  return (
    <View style={styles.priceInfoContainer}>
      <View style={[styles.priceSection, { marginTop: rem(marginTop) }]}>
        <View style={styles.salePriceLabelContainer}>
          <Text
            style={[
              styles.salePriceLabel,
              {
                fontSize: rem(fontSize),
                color,
                lineHeight: rem(fontSize * 1.4),
              },
            ]}
          >
            {priceLabel}
          </Text>
        </View>
        <View style={styles.salePriceContainer}>
          <Text
            style={[
              styles.salePriceText,
              {
                fontSize: rem(fontSize),
                color,
                lineHeight: rem(fontSize * 1.4),
              },
            ]}
          >
            {price}
          </Text>
        </View>
        <View style={[styles.soldCountContainer, { marginLeft: rem(soldCountMarginLeft) }]}>
          <Text
            style={[
              styles.soldCountText,
              {
                fontSize: rem(fontSize),
                color,
                lineHeight: rem(fontSize * 1.4),
              },
            ]}
          >
            {soldCount}
          </Text>
        </View>
      </View>
    </View>
  );
};

// 原子组件：操作按钮
interface ActionButtonProps {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'plain';
  size?: 'tiny' | 'mini' | 'small' | 'medium' | 'large' | 'huge';
  ghost?: boolean;
  width?: number;
  height?: number;
}

export const ActionButton = (props: ActionButtonProps) => {
  const {
    text = '加入',
    onPress = () => {},
    disabled = false,
    type = 'primary',
    size = 'small',
    ghost = false,
    width = 76,
    height = 32,
  } = props;
  return (
    <View style={[styles.addToShelfButton, { width: rem(width), height: rem(height) }]}>
      <Button
        title={text}
        disabled={disabled}
        onPress={onPress}
      >
      </Button>
    </View>
  );
};

/**
 * @desc 商品卡片
 * @param props
 */
export interface ProductCardProps {
  /**
   * @desc 商品数据、主要用于按钮
   */
  goodsData?: IGoodsCard;
  /**
   * @desc 商品ID
   */
  relItemId: number;
  /**
   * @desc 商品标题
   */
  itemTitle?: string;
  /**
   * @desc 商品跳转URL
   */
  jumpUrl?: string;
  /**
   * @desc 商品图片
   */
  productImage: {
    url: string;
    width: number;
    height: number;
    borderRadius?: number;
    marginRight?: number;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
  };
  /**
   * @desc 售价
   */
  zkFinalPrice?: string;
  /**
   * @desc 已售数量
   */
  soldCountThirtyDays?: string;
  /**
   * @desc 佣金率
   */
  commissionRate?: number;
  /**
   * @desc 佣金文案
   */
  commissionText?: string;
  /**
   * @desc 卖点文本
   */
  aiRecoReason?: string;
  /**
   * @desc 按钮文本
   */
  buttonText?: string;
  /**
   * @desc 按钮点击事件
   */
  onButtonPress?: () => void;
  /**
   * @desc 容器宽度
   */
  containerWidth?: number;
  /**
   * @desc 容器高度
   */
  containerHeight?: number;
  /**
   * @desc 容器内边距
   */
  containerPadding?: number;
  /**
   * @desc 容器圆角
   */
  containerBorderRadius?: number;
  /**
   * @desc 容器边框颜色
   */
  containerBorderColor?: string;
  /**
   * @desc 容器背景颜色
   */
  containerBackgroundColor?: string;
  /**
   * @desc 容器外边距
   */
  containerMarginHorizontal?: number;
}

function wrapVar(prefix: string, value: string, suffix: string) {
  return `${prefix}${value}${suffix}`;
}

/**
 * @desc 商品卡片
 * @param props
 * @returns
 */
export function CardGoods(props: ProductCardProps) {
  const {
    itemTitle = '蕉下中长款防晒冰昀系列超能防晒衣',
    jumpUrl = '',
    productImage = {
      url: 'https://p2-ec.eckwai.com/kos/nlav12333/aicode/figmaImage/2025-07-22/huangshuiqing/商品图_aeeu01khsee00.331029ba2c234d6d.png',
      width: 100,
      height: 100,
      borderRadius: 4,
      marginRight: 8,
      resizeMode: 'cover',
    },
    zkFinalPrice: salePrice = '¥14',
    soldCountThirtyDays = '已售372件',
    commissionRate = 22.86,
    commissionText = '10%佣金',
    aiRecoReason = '-',
    buttonText = '加入',
    onButtonPress = () => {},
    containerWidth = 0,
    containerHeight = 116,
    containerPadding = 8,
    containerBorderRadius = 6,
    containerBorderColor = '#F0F1F5',
    containerBackgroundColor = '#FAFBFC',
    containerMarginHorizontal = 0,
    goodsData,
    relItemId,
  } = props || {};
  const soldCount = React.useMemo(() => {
    return wrapVar('已售', soldCountThirtyDays, '件');
  }, [soldCountThirtyDays]);
  const _commissionText = React.useMemo(() => {
    return commissionText || wrapVar('', `${commissionText}%`, '佣金');
  }, [commissionText]);
  return (
    <View
      style={[
        styles.container,
        {
          width: containerWidth ? rem(containerWidth) : undefined,
          height: rem(containerHeight),
          padding: rem(containerPadding),
          borderRadius: rem(containerBorderRadius),
          borderColor: containerBorderColor,
          backgroundColor: containerBackgroundColor,
          marginHorizontal: rem(containerMarginHorizontal),
        },
      ]}
    >
      <View style={styles.contentWrapper}>
        <ProductImage
          imageUrl={productImage.url}
          onPress={() => {
            if (jumpUrl) {
              go(jumpUrl);
            }
          }}
        />

        <View style={styles.rightContent}>
          <View style={styles.topSection}>
            <ProductTitle
              title={itemTitle}
              fontSize={15}
              color="rgba(26, 31, 40, 1)"
              fontWeight="500"
              numberOfLines={1}
              marginBottom={4}
            />
            <SellingPointHighlight text={aiRecoReason} />
            <View style={styles.salesInfoContainer}>
              <CommissionInfo rate={commissionRate} text={_commissionText} />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <PriceInfo price={salePrice} soldCount={soldCount} />
            <Button title={buttonText} onPress={onButtonPress} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(CardGoods);
