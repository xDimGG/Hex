module.exports = class Extension {
	static extend(target) {
		Object.defineProperties(
			target.prototype,
			Object.getOwnPropertyDescriptors(this.prototype)
		)
	}
}