module.exports = {
	functionNode: {
		"range": [
			100,
			133
		],
		"type": "FunctionDeclaration",
		"id": {
			"range": [
				109,
				118
			],
			"type": "Identifier",
			"name": "fooFilter"
		},
		"params": [{
			"range": [
				119,
				122
			],
			"type": "Identifier",
			"name": "Foo"
		}, {
			"range": [
				124,
				127
			],
			"type": "Identifier",
			"name": "Bar"
		}],
		"defaults": [],
		"body": {
			"range": [
				129,
				133
			],
			"type": "BlockStatement",
			"body": []
		},
		"rest": null,
		"generator": false,
		"expression": false,
		"leadingComments": [{
			"type": "Block",
			"value": "*\n * @module foo-module\n * @requires bar, baz, some-other-stuff\n ",
			"range": [
				0,
				69
			]
		}, {
			"type": "Block",
			"value": "*\n * @filter fooFilter\n ",
			"range": [
				71,
				99
			]
		}],
		"trailingComments": [{
			"type": "Block",
			"value": "*\n * @directive ctFooDirective\n ",
			"range": [
				135,
				171
			]
		}]
	},

	variableNode: {
		"range": [
			301,
			320
		],
		"type": "VariableDeclaration",
		"declarations": [{
			"range": [
				305,
				319
			],
			"type": "VariableDeclarator",
			"id": {
				"range": [
					305,
					314
				],
				"type": "Identifier",
				"name": "someValue"
			},
			"init": {
				"range": [
					317,
					319
				],
				"type": "Literal",
				"value": 10,
				"raw": "10"
			}
		}],
		"kind": "var",
		"leadingComments": [{
			"type": "Line",
			"value": " @value SOME_VALUE",
			"range": [
				291,
				300
			]
		}]
	}
}
