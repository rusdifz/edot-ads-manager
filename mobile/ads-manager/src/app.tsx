import React from 'react';
import { Host } from 'react-native-portalize';
import { Header, Icon } from './components';
import { MenuProvider } from 'react-native-popup-menu';
import { ToastProvider } from 'react-native-toast-notifications';
import images from './themes/images';
import { colors } from './themes/colors';
import { AppNavigation } from './navigation/AppNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BASE_URL_ADS } from './config/common';
import { setContext } from '@apollo/client/link/context'
import { Provider } from 'react-redux';
import { store } from './redux/store';

const App = ({ accessToken, parentNavigation }: any): JSX.Element => {

  const httpLink = createHttpLink({
    uri: BASE_URL_ADS,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      }
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
 

  return (
    <Provider store={store} >
       <ApolloProvider client={client}>
          <MenuProvider>
          <Host>
            <ToastProvider
              successColor={colors.success}
              successIcon={<Icon name={images.icon.check_circle} />}
            >
              <NavigationContainer>
                <Header parentNavigation={parentNavigation} />
                <AppNavigation />
              </NavigationContainer>
            </ToastProvider>
          </Host>
        </MenuProvider>
      </ApolloProvider>      
    </Provider>
  );
};

export default App;
