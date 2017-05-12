import PubSub from 'pubsub-js'
import TodoUtils from './TodoUtils'
import Conf from './TodoConf'

let Utils = new TodoUtils();

class TodoModel {
	constructor(key) {
		this.key = key;
		this.todos = Utils.store(key);
	}

	inform() {
		Utils.store(this.key, this.todos)
	}

	addTodo(title) {
		let newTodo = {
			id: Utils.uuid(),
			title: title,
			completed: false
		}
		this.todos = this.todos.concat(newTodo)

		PubSub.publish(Conf.ADD_TODO, this.todos)
		this.inform()
	}

	toggleAll(checked) {
		this.todos = this.todos.map((todo) => {
			return Utils.extend({}, todo, {completed: checked})
		})

		this.inform()
	}

	toggle(todoToToggle) {
		this.todos = this.todos.map((todo) => {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed})
		})

		PubSub.publish(Conf.TOGGLE_TODO, this.todos)
		this.inform()
	}

	destroy(todo) {
		this.todos = this.todos.filter((candidate) => {
			return candidate !== todo
		})

		PubSub.publish(Conf.DESTROY_TODO, this.todos)
		this.inform()
	}

	save(todoToSave, title) {
		this.todos = this.todos.map((todo) => {
			return todo !== todoToSave ?
				todo :
				Utils.extend({}, todo, {title: title})
		})

		PubSub.publish(Conf.SAVE_TODO, this.todos)
		this.inform()
	}

	clearCompleted() {
		this.todos = this.todos.filter((todo) => {
			return !todo.completed
		})

		PubSub.publish(Conf.CLEAR_COMPLETED_TODOS, this.todos)
		this.inform()
	}
}

export default TodoModel
