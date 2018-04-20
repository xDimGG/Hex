module.exports = class {
	static extend(target) {
		Object.defineProperties(
			target.prototype,
			Object.getOwnPropertyDescriptors(this.prototype)
		);
	}
};