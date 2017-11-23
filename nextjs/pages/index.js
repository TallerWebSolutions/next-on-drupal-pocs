import React from 'react'
import Link from 'next/link'
import { setTimeout } from 'timers'

class Home extends React.Component {
  static getInitialProps(ctx) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ name: 'Taller' })
      }, 500)
    })
  }
  render() {
    return (
      <h1>{this.props.name}</h1>
    )
  }
}

export default Home
