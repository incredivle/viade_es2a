import React from 'react';

import {
  RouteMapHolder,
  MapHolder,
  ExpandButton
} from './feed.style';

import { FeedSidePanel, AddFriend } from './children';
import isLoading from '@hocs/isLoading';

import { RouteView, Map } from '@components';
import { FloatingButton } from '@components/Utils';
import { RouteMapContext } from '@components/RouteMap/route-map.component';

import { RouteColor as colors } from '@constants';
import { modal } from '@utils';
import { routeService, friendService } from '@services';

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

export const FeedContext = React.createContext();

/**
 * Feed Page UI component, containing a Map which displays some routes and a side legend.
 * @param props
 */

export const FeedComponent = isLoading(({ friends, webId, fetchFriends }) => {

  let loadedRoutesAmount = 0;

  const [deletedFriends, setDeletedFriends] = React.useState([]);
  const [loadedRoutes, setLoadedRoutes] = React.useState([]);
  const [selectedFriends, setSelectedFriends] = React.useState([]);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [collapsed, setCollapsed] = React.useState(false);

  const [RouteViewModal, openRouteView, closeRouteView] = modal('route-map');
  const [AddFriendModal, openAddFriend, closeAddFriend] = modal('route-map');

  const map = React.useRef();

  const onRouteView = () => {
    if (selectedRoute)
      openRouteView();
  };

  const onRouteSelect = route => {
    const newRoute = selectedRoute === route.id ? null : route.id;
    setSelectedRoute(newRoute);
    if (newRoute && route.points[0])
      map.current.panTo(route.points[0]);
  };

  const onFriendSelect = async (friend, currentRoutes) => {
    if (isSelectedFriend(friend)) {
      removeSelectedFriend(friend);
      deloadRoutes(currentRoutes);

      return [];

    } else {
      addSelectedFriend(friend);

      const friendRoutes = await routeService.getRoutesByOwner([friend], webId);
      const routes = friendRoutes[0].routes;

      loadRoutes(routes);
      return routes;
    }
  };

  const removeSelectedFriend = friend => {
    selectedFriends.splice(selectedFriends.indexOf(friend), 1);
    setSelectedFriends([...selectedFriends]);
  };

  const addSelectedFriend = friend => {
    setSelectedFriends(selectedFriends.concat(friend));
  };

  const loadRoutes = routes => {
    routes.forEach((route, index) => route.color = colors[(index + loadedRoutesAmount) % colors.length]);
    loadedRoutesAmount += routes.length;
    setLoadedRoutes([...loadedRoutes, ...routes]);
  };

  const deloadRoutes = routes => {
    routes.forEach(r => loadedRoutes.splice(loadedRoutes.indexOf(r), 1));
    setLoadedRoutes([...loadedRoutes]);
  };

  const deleteFriend = async (friend, currentRoutes) => {
    if (isSelectedFriend(friend)) {
      removeSelectedFriend(friend);
      deloadRoutes(currentRoutes);
    }

    setDeletedFriends(deletedFriends.concat(friend));
    await friendService.deleteFriend(webId, friend);
  };

  const isSelectedFriend = friend => selectedFriends.includes(friend);

  const isDeletedFriend = friend => deletedFriends.includes(friend);

  return (
    <RouteMapHolder data-testid="map-holder" id='route-map'>
      <RouteMapContext.Provider
        value={{
          selectedRoute,
          onRouteView,
          onRouteSelect,
          collapsed,
          setCollapsed,
        }}>

        {collapsed &&
          <ExpandButton onClick={() => setCollapsed(false)}>
            ⇠
          </ExpandButton>
        }

        <Map {... { routes: loadedRoutes }}
          mapRef={map}
          data-testid="map"
          googleMapURL={googleMapURL}
          loadingElement={<MapHolder />}
          containerElement={<MapHolder />}
          mapElement={<MapHolder />}
        />
        <FeedContext.Provider value={{
          isSelectedFriend,
          onFriendSelect,
          deleteFriend,
          isDeletedFriend
        }}>
          <FeedSidePanel data-testid="side-menu" {... { friends, collapsed, setCollapsed }} />
        </FeedContext.Provider>

        <RouteMapContext.Consumer>
          {props => (
            <RouteViewModal>
              <RouteView {... { route: loadedRoutes.filter(r => r.id === props.selectedRoute)[0], closeRouteView }} />
            </RouteViewModal>
          )}
        </RouteMapContext.Consumer>

        <AddFriendModal>
          <AddFriend {...{ webId, closeAddFriend, fetchFriends }} />
        </AddFriendModal>

        <FloatingButton
          onClick={openAddFriend}
          background={'#8a25fc'}
          hoverBackground={'#9841fc'}
          activeBackground={'#ad66ff'}
          foreground={'white'}
          text={'🞤'} />
      </RouteMapContext.Provider >
    </RouteMapHolder>
  );
});