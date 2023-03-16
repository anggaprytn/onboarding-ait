import { StatusBar } from 'expo-status-bar';
import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  Pressable,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation, useRoute } from '@react-navigation/core';
import { defaultColors } from '../../themes';
import { Feather } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { Text, Button } from '../../components';
import { IconPromo, IconFavorite } from '../../assets/icons';
import { request } from '../../utils/services';
import { useSelector, useDispatch } from 'react-redux';

const statusBarHeight = getStatusBarHeight();

const Profile = () => {
  const navigation = useNavigation();
  const textInputRef: any = useRef();
  const route = useRoute();

  const productParams: any = route.params;

  const accessToken = useSelector(
    ({ authSlice }: any) => authSlice.accessToken,
  );
  const refreshToken = useSelector(
    ({ authSlice }: any) => authSlice.refreshToken,
  );
  const isSignedIn = useSelector(({ authSlice }: any) => authSlice.isSignedIn);

  const dispatch = useDispatch();

  console.log(productParams, 'productParams');

  const [products, setProducts] = useState<any[]>(productParams);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _getProducts = useCallback(() => {
    if (search.length < 2) {
      return;
    }
    setIsLoading(true);
    request(
      {
        method: 'get',
        endpoint: `/product?search=${search}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      refreshToken,
      dispatch,
      isSignedIn,
    )
      .then(response => {
        const data = JSON.parse(response.data);
        const data2: any[] = data.data.items;
        setProducts(data2);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, dispatch, isSignedIn, refreshToken, search]);

  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null;

    return (...args: any[]) => {
      const context = this;

      const later = () => {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout!);
      timeout = setTimeout(later, wait);
    };
  };

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearch(text);
      debounce(_getProducts, 500)();
    },
    [_getProducts],
  );

  function formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  useEffect(() => {
    setTimeout(() => textInputRef.current.focus(), 1);
  }, []);

  const renderHeader = useMemo(() => {
    return (
      <View
        style={{
          width: wp(100),
          backgroundColor: 'white',
          height: 56 + 8 + statusBarHeight,
          elevation: 10,
          flexDirection: 'row',
        }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            height: 48,
            width: 48,
            marginTop: statusBarHeight + 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name="chevron-left"
            size={25}
            color={defaultColors.textFooterDate}
          />
        </Pressable>
        <View>
          <TextInput
            onChangeText={handleSearchChange}
            value={search}
            ref={textInputRef}
            placeholder="Nike Air Jordan"
            style={{
              borderColor: defaultColors.textFooterDate,
              backgroundColor: defaultColors.white,
              paddingLeft: 16,
              paddingRight: 32 + 8,
              height: 56 - 8 - 6,
              width: wp(100) - 48 - 16 - 8,
              borderRadius: 8,
              borderWidth: 1,
              marginLeft: 8,
              fontFamily: 'Satoshi-Regular',
              fontSize: 16,
              marginTop: statusBarHeight + 8 + 3,
            }}></TextInput>
          <Feather
            style={{
              position: 'absolute',
              right: 15,
              top: statusBarHeight + 21,
              color: defaultColors.buttonEnableBg,
            }}
            name="search"
            size={22}
            color={defaultColors.textFooterDate}
          />
        </View>
      </View>
    );
  }, [handleSearchChange, navigation, search]);

  const listEmpty = () => {
    return (
      <View
        style={{
          height: hp(60),
          width: wp(100),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text type="bold" size={20}>
          No results found
        </Text>
        <Text type="regular" size={18} style={{ marginTop: 8 }}>
          Try different or more general keyword
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Button style={styles.containerCard}>
      <View style={styles.topCard}>
        <View style={styles.nameProduct}>
          <Text
            color={defaultColors.textTitleLabel}
            numberOfLines={2}
            type={'medium'}
            size={15}>
            {item.name}
          </Text>
        </View>
        <IconPromo width={45.37} height={60} />
        <View style={styles.textOff}>
          <Text color={defaultColors.white} type={'bold'} size={14}>
            {item.discount?.value}%
          </Text>
          <Text color={defaultColors.white} type={'regular'} size={12}>
            OFF
          </Text>
        </View>
      </View>
      <FastImage
        source={{
          uri: item.image,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={{
          width: wp(50) - 16 - 8,
          height: 230 - 60 - 45,
        }}
      />
      <View style={styles.bottomCard}>
        <View style={styles.price}>
          <Text
            color={defaultColors.textFooterDate}
            style={styles.lineThrough}
            type={'regular'}
            size={11}>
            Rp {formatNumberWithCommas(item.discount?.real_price)}
          </Text>
          <Text color={defaultColors.buttonEnableBg} type={'bold'} size={15}>
            Rp {formatNumberWithCommas(item.price)}
          </Text>
        </View>
        <View style={styles.containerIcFav}>
          {item.is_favorite && <IconFavorite width={22} height={22} />}
        </View>
      </View>
    </Button>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar translucent />
      {renderHeader}
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        contentContainerStyle={styles.pb16}
        showsVerticalScrollIndicator={false}
        data={products}
        extraData={products}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  pb16: { paddingBottom: 16 },
  iconSearch: {
    position: 'absolute',
    right: 15,
    top: statusBarHeight + 21,
    color: defaultColors.buttonEnableBg,
  },
  containerSearch: {
    borderColor: defaultColors.textFooterDate,
    backgroundColor: defaultColors.white,
    paddingHorizontal: 16,
    height: 56 - 8 - 6,
    width: wp(100) - 32,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 16,
    marginTop: statusBarHeight + 8 + 3,
    justifyContent: 'center',
  },
  header: {
    width: wp(100),
    backgroundColor: defaultColors.white,
    height: 56 + 8 + statusBarHeight,
    elevation: 10,
    flexDirection: 'row',
  },
  container: { flex: 1, backgroundColor: defaultColors.white },
  containerIcFav: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineThrough: { textDecorationLine: 'line-through' },
  containerCard: {
    height: 230,
    width: wp(50) - 16 - 8,
    marginLeft: 16,
    marginTop: 16,
    backgroundColor: defaultColors.productItemBg,
    borderRadius: 10,
  },
  topCard: {
    width: wp(50) - 16 - 8,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textOff: {
    position: 'absolute',
    height: 60,
    width: 45.37,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameProduct: {
    height: 60 - 8,
    marginTop: 8,
    width: wp(50) - 16 - 8 - 45.37 - 16,
    marginHorizontal: 8,
  },
  bottomCard: {
    width: wp(50) - 16 - 8,
    height: 45,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  price: {
    width: wp(50) - 16 - 8 - 45 - 8,
    height: 45,
    justifyContent: 'center',
  },
  footer: { height: 50, alignItems: 'center', justifyContent: 'center' },
});
