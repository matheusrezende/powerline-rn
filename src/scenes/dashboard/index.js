
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Title, Content, Button, Footer, FooterTab, Text, Body, Left, Right, Icon, Item, Input, Grid, Row, Col } from 'native-base';

import { View } from 'react-native';

import Menu, {
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers
} from 'react-native-popup-menu';

import { openDrawer } from '../../actions/drawer';
import { loadGroups, clearGroupsInCache, loadBookmarks, resetBookmarks } from 'PLActions';
import styles from './styles';

// Tab Scenes
import Newsfeed from './newsfeed/'

const { SlideInMenu } = renderers;

class Home extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
      group: 'all',
    };
  }

  // Newsfeed
  async onNewsfeedTab() {
    const { props: { token, bookmarksPage, dispatch, items } } = this;
    this.toggleTab1();
    try {
      if (bookmarksPage === 0) {
        await Promise.race([
          dispatch(loadBookmarks(token)),
          timeout(15000),
        ]);
      }
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out') {
        alert(message);
      }
      else {
        alert('Timed out. Please check internet connection');
      }
      dispatch(resetBookmarks());
      return;
    } finally {
      if (items.length === 0) {
        alert('No newsfeed yet');
      }
    }
  }

  toggleTab1() {
    this.setState({
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
    });
  }

  toggleTab2() {
    this.setState({
      tab1: false,
      tab2: true,
      tab3: false,
      tab4: false,
    });
  }

  toggleTab3() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: true,
      tab4: false,
    });
  }

  toggleTab4() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true,
    });
  }

  selectGroup(group) {
    this.setState({ group: group });
  }

  selectNewItem(value) {
    this.bottomMenu.close();
  }

  onRef = r => {
    this.bottomMenu = r;
  }

  goToGroupSelector() {
    this.props.dispatch(clearGroupsInCache());
    Actions.groupSelector();
  }

  renderSelectedTab() {
    if (this.state.tab1 === true) {
      return (<Newsfeed />);
    } else {
      return null;
    }
  }

  render() {
    return (
      <MenuContext customStyles={menuContextStyles}>
        <Container>
          <Header searchBar rounded style={styles.header}>
            <Left style={{ flex: 0.1 }}>
              <Button transparent onPress={this.props.openDrawer}>
                <Icon active name="menu" style={{ color: 'white' }} />
              </Button>
            </Left>
            <Item style={styles.searchBar}>
              <Input style={styles.searchInput} placeholder="Search groups, people, topics" />
              <Icon active name="search" />
            </Item>
          </Header>
          <View style={styles.container}>
            <Grid style={styles.groupSelector}>
              <Row>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'all' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('all')}>
                    <Icon active name="walk" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('all')}>All</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'town' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('town')}>
                    <Icon active name="pin" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('town')}>Town</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'state' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('state')}>
                    <Icon active name="pin" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('state')}>State</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={this.state.group == 'country' ? styles.iconActiveButton : styles.iconButton} onPress={() => this.selectGroup('country')}>
                    <Icon active name="pin" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.selectGroup('country')}>Country</Text>
                </Col>
                <Col style={styles.col}>
                  <Button style={styles.iconButton} onPress={() => this.goToGroupSelector()}>
                    <Icon active name="more" style={styles.icon} />
                  </Button>
                  <Text style={styles.iconText} onPress={() => this.goToGroupSelector()}>More</Text>
                </Col>
              </Row>
            </Grid>
            {this.renderSelectedTab()}
          </View>

          <Footer style={styles.footer}>
            <FooterTab>
              <Button active={this.state.tab1} onPress={() => this.onNewsfeedTab()} >
                <Icon active={this.state.tab1} name="ios-flash" />
                <Text>Newsfeed</Text>
              </Button>
              <Button active={this.state.tab2} onPress={() => this.toggleTab2()} >
                <Icon active={this.state.tab2} name="md-people" />
                <Text>Friends</Text>
              </Button>
              <Button>
                <Menu name="create_item" renderer={SlideInMenu} onSelect={value => this.selectNewItem(value)} ref={this.onRef}>
                  <MenuTrigger>
                    <Icon name="ios-add-circle" style={{ fontSize: 36, color: '#030366' }} />
                  </MenuTrigger>
                  <MenuOptions customStyles={optionsStyles}>
                    <MenuOption value={'group_announcement'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_announcement')}>
                        <Icon name="volume-up" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Group Announcement</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_fundraiser'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_fundraiser')}>
                        <Icon name="cash" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Group Fundraiser</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_event'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_event')}>
                        <Icon name="calendar" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Group Event</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_petition'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_petition')}>
                        <Icon name="create" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Group Petition</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_discussion'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_discussion')}>
                        <Icon name="chatbubbles" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Group Discussion</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'group_poll'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('group_poll')}>
                        <Icon name="stats" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Group Poll</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'petition'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('petition')}>
                        <Icon name="create" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Petition</Text>
                      </Button>
                    </MenuOption>
                    <MenuOption value={'post'}>
                      <Button iconLeft transparent dark onPress={() => this.selectNewItem('post')}>
                        <Icon name="flag" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Create New Post</Text>
                      </Button>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </Button>
              <Button active={this.state.tab3} onPress={() => this.toggleTab3()} >
                <Icon active={this.state.tab3} name="md-mail" />
                <Text>Messages</Text>
              </Button>
              <Button active={this.state.tab4} onPress={() => this.toggleTab4()} >
                <Icon active={this.state.tab4} name="md-notifications" />
                <Text>Notifications</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </MenuContext >
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fafafa',
    paddingLeft: 5,
  },
};

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop,
};

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

const mapStateToProps = state => ({
  token: state.user.token,
  bookmarksPage: state.bookmarks.page,
});

export default connect(mapStateToProps, bindAction)(Home);
