import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import TodoItem from './TodoItem'
import Conf from './TodoConf'

class TodoMain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: null,
      shownTodos: []
    }

    this.toggleAll = this.toggleAll.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleTodoItems = this.handleTodoItems.bind(this)
  }

  toggleAll(event) {
		let checked = event.target.checked;
		this.props.model.toggleAll(checked);
	}

  toggle(todoToToggle) {
		this.props.model.toggle(todoToToggle);
	}

	destroy(todo) {
		this.props.model.destroy(todo);
	}

	edit(todo) {
		this.setState({editing: todo.id});
	}

	save(todoToSave, title) {
		this.props.model.save(todoToSave, title);
		this.setState({editing: null});
	}

	cancel() {
		this.setState({editing: null});
	}

  handleTodoItems(msg, data) {
    this.setState({
      shownTodos : this.props.model.todos.filter((todo) => {
        switch (this.props.nowShowing) {
        case Conf.ACTIVE_TODOS:
          return !todo.completed;
        case Conf.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
        }
      })
    })
  }

  shouldComponentUpdate() {
    PubSub.subscribe(Conf.ADD_TODO, this.handleTodoItems)
    PubSub.subscribe(Conf.DESTROY_TODO, this.handleTodoItems)
    PubSub.subscribe(Conf.TOGGLE_TODO, this.handleTodoItems)
    PubSub.subscribe(Conf.CLEAR_COMPLETED_TODOS, this.handleTodoItems)
    PubSub.subscribe(Conf.SAVE_TODO, this.handleTodoItems)

    return true;
  }

  componentWillMount() {
    this.setState({
      shownTodos : this.props.model.todos.filter((todo) => {
        switch (this.props.nowShowing) {
        case Conf.ACTIVE_TODOS:
          return !todo.completed;
        case Conf.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
        }
      })
    })
  }

  render() {
    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={this.toggleAll}
          checked={this.props.activeTodoCount === 0}
        />
				<label htmlFor="toggle-all">Mark all as complete</label>
				<ul className="todo-list">
					{
            this.state.shownTodos.map((todo) => {
              return (
      					<TodoItem
      						key={todo.id}
      						todo={todo}
      						onToggle={this.toggle.bind(this, todo)}
      						onDestroy={this.destroy.bind(this, todo)}
      						onEdit={this.edit.bind(this, todo)}
      						editing={this.state.editing === todo.id}
      						onSave={this.save.bind(this, todo)}
      						onCancel={this.cancel}
      					/>
      				)
            })
          }
				</ul>
			</section>
    )
  }
}

export default TodoMain
