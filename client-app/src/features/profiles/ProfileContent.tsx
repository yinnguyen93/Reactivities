import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhoto from './ProfilePhoto';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowing';

const panes = [
  { menuItem: 'About', render: () => <ProfileDescription /> },
  { menuItem: 'Photos', render: () => <ProfilePhoto /> },
  {
    menuItem: 'Activities',
    render: () => <Tab.Pane>Activities Content</Tab.Pane>,
  },
  {
    menuItem: 'Followers',
    render: () => <ProfileFollowings />,
  },
  {
    menuItem: 'Following',
    render: () => <ProfileFollowings />,
  },
];

interface IProps {
  setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(event, data) => setActiveTab(data.activeIndex)}
    />
  );
};
export default ProfileContent;
