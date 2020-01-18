import React from 'react';
import Students from './components/Students/';
import Header from './components/Header';

// eslint-disable-next-line require-jsdoc
class Admin extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      tab: 'dashboard',
      students: [],
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    fetch('http://127.0.0.1:5000/students')
        .then((res) => res.json())
        .then((data) => {
          this.setState({students: data.students});
          console.log(data);
        })
        .catch(console.log);
  }

  // eslint-disable-next-line require-jsdoc
  setTab(newTab) {
    this.setState({
      tab: newTab,
    });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {loggedIn, tab} = this.state;

    if (!loggedIn) {
      return (
        <div onClick={() => this.setState({loggedIn: true})}>
                    Login
        </div>
      );
    }
    return (
      <div>
        <Header setTab={this.setTab.bind(this)} selectedTab={tab} />
        {tab === 'dashboard' && <div>dashboard </div>}
        {tab === 'students' && (
          <Students students={this.state.students} />
        )}
        {tab === 'upload' && <div>upload forms </div>}
        {tab === 'email' && <div>email </div>}
        {tab === 'logout' && <div>logout </div>}
      </div>
    );
  }
}

export default Admin;
