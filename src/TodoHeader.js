import React, { Component } from 'react';
import Conf from './TodoConf'

class TodoHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTodo: ''
    }

    this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== Conf.ENTER_KEY) {
			return;
		}

		event.preventDefault();

		let val = this.state.newTodo.trim();

		if (val) {
			this.props.model.addTodo(val);
			this.setState({newTodo: ''});
		}
  }

  handleChange(event) {
    this.setState({newTodo: event.target.value})
  }

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
					className="new-todo"
					placeholder="What needs to be done?"
					value={this.state.newTodo}
					onKeyDown={this.handleNewTodoKeyDown}
					onChange={this.handleChange}
					autoFocus={true}
				/>
      </header>
    );
  }
}

export default TodoHeader;
