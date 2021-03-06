import React, { Component } from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, NavLink, Nav, ButtonGroup } from 'reactstrap';
import localizedTexts from '../../text_localization/LocalizedStrings';
import { connect } from 'react-redux';

const links = [
  {
    name: localizedTexts.PackageOverviewNav.packages,
    link: "/package-overview",
    validation: (cart) => {return true}
  },
  {
    name: localizedTexts.PackageOverviewNav.delPay,
    link: "/package-overview/del-pay",
    validation: (cart) => {
      let validate = false;
      cart.packages.every((_package) => {
        if (_package.isCreating !== true) {
          validate = true;
          return false;
        }
        return true;
      });
      return validate;
    }
  },
  {
    name: localizedTexts.PackageOverviewNav.delDetails,
    link: "/package-overview/del-details",
    validation: (cart) => {
      return cart.shipping !== undefined && cart.paymentType !== undefined;
    }
  },
  {
    name: localizedTexts.PackageOverviewNav.summary,
    link: "/package-overview/summary",
    validation: (cart) => {return false}
  },
];

class PackageOverviewNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLinkIndex: 0
    }
  }

  componentDidMount() {
    this.updateCurrentLinkIndex();
  }

  doRedirect(link) {
    if (link.validation(this.props.cart)) {
      this.context.router.push(link.link);
      this.updateCurrentLinkIndex();
    } else {
      alert('Vyplňte všechna povinná pole');
    }
  }

  updateCurrentLinkIndex() {
    links.every((link, i) => {
      if (link.link === this.context.router.getCurrentLocation().pathname) {
        this.setState({currentLinkIndex: i});
        return false;
      }
      return true;
    });
  }

  render() {
    const backNextButton = (modifyIndex, text) => {
      const {currentLinkIndex} = this.state;
      if (typeof links[currentLinkIndex + modifyIndex] !== 'undefined') {
        return (
          <NavLink tag={Link}
          onClick={() => {this.doRedirect(links[currentLinkIndex + modifyIndex])}}><Button>{text}</Button></NavLink>
        );
      } else {
        return null;
      }
    }

    return (
      <Row style={{ "marginTop": '30px', "marginBottom": '30px' }}>
        <Col xl="2" lg="2" md="2" sm="2" xs="3">
          {backNextButton(-1, localizedTexts.PackageOverviewNav.back)}
        </Col>
        <Col xl="8" lg="8" md="8" sm="8" xs="6">
          <Nav>
            <ButtonGroup className="mr-auto ml-auto">
              {links.map((link, i) => {
                return (
                  <Button key={i} onClick={() => {this.doRedirect(link)}}>{link.name}</Button>
                );
              })}
            </ButtonGroup>
          </Nav>
        </Col>
        <Col xl="2" lg="2" md="2" sm="2" xs="3" className="text-right">
          {backNextButton(1, localizedTexts.PackageOverviewNav.next)}
        </Col>
      </Row>
    );
  }
};

PackageOverviewNav.contextTypes = {
  router: React.PropTypes.object,
  location: React.PropTypes.object
}

const mapSateToProps = state => ({
  cart: state.cart,
});

export default connect(mapSateToProps, {  })(PackageOverviewNav);
