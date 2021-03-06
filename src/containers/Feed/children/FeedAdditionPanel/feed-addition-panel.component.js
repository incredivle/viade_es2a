import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  FeedAdditionPanelHolder,
  SectionContainer,
  TabContainer,
  TabButton
} from './feed-addition-panel.style';

import { AddFriend, GroupCreationPanel } from './children';
import { ModalCloseButton } from '@utils';

import { MobileCompatWrapper } from '@utils';

const FeedAdditionPanel = ({ webId, closeFeedAddition, onGroupCreation, fetchFeed }) => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = React.useState(0);

  const tabs = ["feedadditionpanel.friends", "feedadditionpanel.groups"];

  return <MobileCompatWrapper className="wrap">
    <ModalCloseButton className="button"  onClick={closeFeedAddition} />
    <FeedAdditionPanelHolder id='feed-container'>
      <TabContainer className="tabcontainer">
        {tabs.map((name, i) => {
          return (
            <TabButton
              id={"tabButton-"+i}
              selected={selectedTab === i}
              key={i}
              onClick={() => setSelectedTab(i)}
            >
              {t(name)}
            </TabButton>
          );
        })}
      </TabContainer>

      <SectionContainer className="sc1" hidden={!selectedTab}>
        <GroupCreationPanel {...{ webId, closeFeedAddition, onGroupCreation }} />
      </SectionContainer>

      <SectionContainer className="sc2" hidden={selectedTab}>
        <AddFriend {...{ webId, fetchFeed }} />
      </SectionContainer>
    </FeedAdditionPanelHolder>
  </MobileCompatWrapper>
}

export default FeedAdditionPanel;