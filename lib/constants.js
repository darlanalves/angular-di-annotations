module.exports = {
	RUNNABLE: "%module%.%type%(%value%);",
	INJECTABLE: "%module%.%type%('%name%', %value%);",
	MODULE: "angular.module('%name%')"
};
