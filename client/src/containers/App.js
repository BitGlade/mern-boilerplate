import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Container, Header, Menu, Divider } from 'semantic-ui-react';

// pages
import Home from '../pages/Home';
import About from '../pages/About';

var navBarItems = [
    { key: 'home', name: 'Home', as: Link, to: '/' },
    { key: 'about', name: 'About', as: Link, to: '/about' }
]

class App extends Component {
    render() {
        return (
        <Router>
        <Container id="app">
        <Header as='h1'>Boilerplate MERN</Header>
        <Menu items={navBarItems} />
        <Divider hidden />

        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        </Container>
        </Router>
        );
    }
}

export default App;
