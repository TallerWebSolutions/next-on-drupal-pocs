import React from 'react'
import App from '../components/App'
import Header from '../components/Header'
import withData from '../lib/withData'

const unregister = () => {
  if (
    process.env.NODE_ENV === 'production' &&
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator
  ) {
    navigator.serviceWorker
      .getRegistration('./').then(function(registrations) {
        if(typeof registrations !== 'undefined') {
          registrations.unregister().then(function(boolean) {
              console.log('unregistered: ', boolean)
          })
        }
    })
  }
}

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <button onClick={unregister}></button>
    <style jsx>{`
      button {
        background-image: url("/static/setup.png");
        background-size: 50px;
        background-repeat: no-repeat
        height: 50px;
        width: 50px;
        border: 0;
        cursor: pointer;
      }
    `}</style>
  </App>
))
