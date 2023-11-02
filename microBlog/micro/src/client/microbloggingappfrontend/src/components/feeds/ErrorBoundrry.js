import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundry.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      // Render the custom fallback UI
      return (
        <div className="container1">
          <div className="content1">
            <div className="content-box1">
              <img src="https://cdn-icons-png.flaticon.com/512/595/595067.png?w=826&t=st=1686898671~exp=1686899271~hmac=48295ecc89956d87d468cda5cd0f017769c6c8166231cb09545d72326e99a845" alt="" style={{width:'300px'}} />
              <h2 className='err'>Something Went Wrong</h2>
              <a href="/feeds" className="btnN">Go Back</a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
