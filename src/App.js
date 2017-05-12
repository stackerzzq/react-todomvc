import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import TodoHeader from './TodoHeader'
import TodoMain from './TodoMain'
import TodoFooter from './TodoFooter'
import TodoModel from './TodoModel'
import Conf from './TodoConf'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      model: new TodoModel('react-todos'),
      nowShowing: Conf.ALL_TODOS,
      activeTodoCount: 0,
      completedCount: 0
    }

    this.nowShowing = this.nowShowing.bind(this)
    this.clearCompleted = this.clearCompleted.bind(this)
    this.handleTodoItems = this.handleTodoItems.bind(this)
  }

  nowShowing(type) {
    this.setState({nowShowing : type})
  }

  clearCompleted() {
		this.state.model.clearCompleted();
	}

  handleTodoItems(msg, data) {
    let todoModel = new TodoModel('react-todos')
    let activeTodoCount = todoModel.todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0)
    this.setState({
      model: todoModel,
      activeTodoCount: activeTodoCount,
      completedCount: todoModel.todos.length - activeTodoCount
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
    let todoModel = this.state.model;
    let activeTodoCount = todoModel.todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0)
    this.setState({
      activeTodoCount: activeTodoCount,
      completedCount: todoModel.todos.length - activeTodoCount
    })

    switch (location.pathname) {
      case '/active':
        this.setState({nowShowing: Conf.ACTIVE_TODOS})
        break;
      case '/completed':
        this.setState({nowShowing: Conf.COMPLETED_TODOS})
        break;
      default:
        this.setState({nowShowing: Conf.ALL_TODOS})
    }
  }

  render() {
    return (
      <section className="todoapp">
        <TodoHeader model={this.state.model}/>
        {this.state.model.todos.length ? <TodoMain
          nowShowing={this.state.nowShowing}
          model={this.state.model}
          activeTodoCount={this.state.activeTodoCount}
        /> : ''}
        {(this.state.activeTodoCount || this.state.completedCount) ? <TodoFooter
          model={this.state.model}
					count={this.state.activeTodoCount}
					completedCount={this.state.completedCount}
					nowShowing={this.state.nowShowing}
          onNowShowing={this.nowShowing}
					onClearCompleted={this.clearCompleted}
				/> : ''}
      </section>
    )
  }
}

export default App;
