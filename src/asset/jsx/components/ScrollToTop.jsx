import React, { Component } from 'react';
import {UpDoubleArrow } from '../../media/icon/SVGicons';

class ScrollToTopButton extends Component {
    state = {
      isVisible: false
    };
  
    componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
    }
  
    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  
    handleScroll = () => {
      const { isVisible } = this.state;
      const scrollY = window.scrollY;
  
      if (scrollY > 100 && !isVisible) {
        this.setState({ isVisible: true });
      } else if (scrollY <= 100 && isVisible) {
        this.setState({ isVisible: false });
      }
    };
  
    scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  
    render() {
      const { isVisible } = this.state;
  
      return (
        <button
          onClick={this.scrollToTop}
          className={`scroll-to-top-button ${isVisible ? 'show' : 'hide'}`}
        >
          <UpDoubleArrow className='top-icon'/>
        </button>
      );
    }
  }
  
  export default ScrollToTopButton;