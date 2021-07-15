import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

export default function App() {
  const [repos, setRepos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchGithubRepos(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGithubRepos = async () => {
    console.log('called with', page);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=javascipt&sort=stars&order=desc&per_page=20&page=${page}`,
      );
      setRepos([...repos, ...response.data.items]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.owner?.avatar_url}} style={styles.itemImage} />
      <View>
        <Text>Name: {item.name}</Text>
        <Text>Owner: {item.owner?.login}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Text style={styles.header}>Github Repos</Text>
      <FlatList
        refreshing={<ActivityIndicator />}
        data={repos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0}
        onEndReached={() => {
          if (!loading) {
            fetchGithubRepos(page);
          }
        }}
        ListFooterComponent={
          <>{loading && <ActivityIndicator size="large" />}</>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginVertical: 5,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
});
