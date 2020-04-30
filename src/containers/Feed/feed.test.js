import React from 'react';
import { cleanup } from 'react-testing-library';
import { HashRouter as Router } from 'react-router-dom';
import { FeedContainer } from './feed.container';

import 'jest-dom/extend-expect';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const webId = 'https://marcosav.inrupt.net/profile/card#';

describe.only('Feed', () => {
  afterAll(cleanup);
  let wrapper;
 // const { container, getByTestId 
 beforeEach(() => { wrapper = mount(
    <Router>
      <FeedContainer {... { webId }} />
    </Router>
  );
  });

  test('renders without crashing', () => {
    expect(wrapper).toBeTruthy();
  });

  test('renders components', () => {
    expect(wrapper.find('.RouteMapHolder')).toBeTruthy();
    expect(wrapper.find('.Map')).toBeTruthy();
    expect(wrapper.find('.FeedSidePanel')).toBeTruthy();
    expect(wrapper.find('.RouteView')).toBeTruthy();
    expect(wrapper.find('.FeedAdditionPanel')).toBeTruthy();
    expect(wrapper.find('.GroupView')).toBeTruthy();
    expect(wrapper.find('.GroupEditionPanel')).toBeTruthy();
    expect(wrapper.find('.FloatingButton')).toBeTruthy();
  });
});