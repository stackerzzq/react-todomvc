import React, { Component } from 'react'
import classNames from 'classnames'
import TodoUtils from './TodoUtils'
import Conf from './TodoConf'

class TodoFooter extends Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
			<footer className="footer">
				<span className="todo-count">
					<strong>{this.props.count}</strong> {(new TodoUtils()).pluralize(this.props.count, 'item')} left
				</span>
				<ul className="filters">
					<li>
						<a
							href="/"
              className={classNames({selected: this.props.nowShowing === Conf.ALL_TODOS})}>
								All
						</a>
					</li>
					{' '}
					<li>
						<a
							href="/active"
              className={classNames({selected: this.props.nowShowing === Conf.ACTIVE_TODOS})}>
								Active
						</a>
					</li>
					{' '}
					<li>
						<a
							href="/completed"
              className={classNames({selected: this.props.nowShowing === Conf.COMPLETED_TODOS})}>
								Completed
						</a>
					</li>
				</ul>
			  {
          this.props.completedCount > 0 ? <button
						className="clear-completed"
						onClick={this.props.onClearCompleted}>
						Clear completed
					</button> : ''
        }
			</footer>
		)
  }
}

export default TodoFooter
