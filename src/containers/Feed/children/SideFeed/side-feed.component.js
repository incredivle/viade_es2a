import React, { Component, useRef } from 'react';
import { CenterContainer } from '@util-components';
import { SideFeedHolder, RouteContainer, SideFeedHeader, FeedRoute } from './side-feed.style';
import { Trans, useTranslation } from 'react-i18next';
import RouteCard from './route-card.component'


const SideFeed = props => {
  const { routes } = props;

  const { t } = useTranslation();

  return <SideFeedHolder >
    <SideFeedHeader>
      {t("feed.sideFeed.recentRoutes")}
    </SideFeedHeader>

    <RouteContainer>
      {routes.map(route => {
        return (
          <RouteCard key={route.id} {... { route }} />
        );
      })}
    </RouteContainer>
  </SideFeedHolder>
}

export default SideFeed;
