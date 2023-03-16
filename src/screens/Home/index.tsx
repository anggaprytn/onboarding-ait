import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, View, ActivityIndicator, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation } from '@react-navigation/core';
import { defaultColors } from '../../themes';
import { Feather } from '@expo/vector-icons';
import { Text, Button } from '../../components';
import { FlatList } from 'react-native-gesture-handler';
import { IconFavorite, IconPromo } from '../../assets/icons';
import { request } from '../../utils/services';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';

const statusBarHeight = getStatusBarHeight();

const Home = () => {
  const navigation: any = useNavigation();
  const accessToken = useSelector(
    ({ authSlice }: any) => authSlice.accessToken,
  );
  const refreshToken = useSelector(
    ({ authSlice }: any) => authSlice.refreshToken,
  );
  const isSignedIn = useSelector(({ authSlice }: any) => authSlice.isSignedIn);

  const dispatch = useDispatch();

  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    request(
      {
        method: 'get',
        endpoint: `/product?page=${page}&limit=8`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      refreshToken,
      dispatch,
      isSignedIn,
    )
      .then(response => {
        console.log(response, 'response');
        const newProducts = JSON.parse(response.data);
        const newProducts2: any[] = newProducts.data.items;

        console.log(newProducts?.data?.items, 'newProducts');
        setProducts(prevProducts => [...prevProducts, ...newProducts2]);
      })
      .catch(error => {
        console.error(error);
        console.log(error, 'response');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, dispatch, isSignedIn, page, refreshToken]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  const FooterLoading = useCallback(() => {
    return (
      <View style={styles.footer}>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    );
  }, [isLoading]);

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
    <View style={styles.container}>
      <StatusBar translucent />
      <View style={styles.header}>
        <View>
          <Pressable
            onPress={() => navigation.navigate('Search', products)}
            style={styles.containerSearch}>
            <Text type="regular" color={defaultColors.textFooterDate} size={16}>
              Nike Air Jordan
            </Text>
          </Pressable>
          <Feather
            style={styles.iconSearch}
            name="search"
            size={22}
            color={defaultColors.textFooterDate}
          />
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.pb16}
        showsVerticalScrollIndicator={false}
        data={products}
        extraData={products}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<FooterLoading />}
      />
    </View>
  );
};

export default Home;

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
