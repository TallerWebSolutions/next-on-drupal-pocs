import React, { Component } from 'react'

class Home extends Component {
  state = {
    value: ''
  }

  onchangeHandler = ({ target: { value = '' } }) => {
    this.setState({ value })
  }

  render () {
    return (
      <section>
        <h1>Formulario</h1>
        { /* Remove the alt attribute to see the error from eslint */ }
        <img src='http://dummy-images.com/objects/dummy-480x270-Commodore64.jpg' alt='Commodore 64' />
        <form>
          { /* Remove the htmlFor attribute to see the error from eslint */ }
          { /* Move the input outside of the label element to see the error from eslint */ }
          <label htmlFor='name'>
            <span>Seu nome:</span>
            <input
              id='name'
              placeholder='Digite seu nome'
              type='text'
              onChange={ this.onchangeHandler }
              value={ this.state.value }
              name='name'
              style={ { width: 300 } }
            />
          </label>

          <label htmlFor='choicea' style={ { clear: 'left', display: 'block' } }>
            Li e concordo com os termos
            <input id='choicea' type='checkbox' />
          </label>
          <button>Salvar</button>
        </form>
      </section>
    )
  }
}

export default Home
