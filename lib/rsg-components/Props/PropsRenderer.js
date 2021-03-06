'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.columns = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getRowKey = getRowKey;
exports.propsToArray = propsToArray;
exports.default = PropsRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactGroup = require('react-group');

var _reactGroup2 = _interopRequireDefault(_reactGroup);

var _Arguments = require('rsg-components/Arguments');

var _Arguments2 = _interopRequireDefault(_Arguments);

var _Code = require('rsg-components/Code');

var _Code2 = _interopRequireDefault(_Code);

var _JsDoc = require('rsg-components/JsDoc');

var _JsDoc2 = _interopRequireDefault(_JsDoc);

var _Markdown = require('rsg-components/Markdown');

var _Markdown2 = _interopRequireDefault(_Markdown);

var _Name = require('rsg-components/Name');

var _Name2 = _interopRequireDefault(_Name);

var _Type = require('rsg-components/Type');

var _Type2 = _interopRequireDefault(_Type);

var _Text = require('rsg-components/Text');

var _Text2 = _interopRequireDefault(_Text);

var _Para = require('rsg-components/Para');

var _Para2 = _interopRequireDefault(_Para);

var _Table = require('rsg-components/Table');

var _Table2 = _interopRequireDefault(_Table);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function renderType(type) {
	if (!type) {
		return 'unknown';
	}

	var name = type.name;


	switch (name) {
		case 'arrayOf':
			return type.value.name + '[]';
		case 'objectOf':
			return '{' + renderType(type.value) + '}';
		case 'instanceOf':
			return type.value;
		default:
			return name;
	}
}

function renderEnum(prop) {
	if (!Array.isArray((0, _util.getType)(prop).value)) {
		return _react2.default.createElement(
			'span',
			null,
			(0, _util.getType)(prop).value
		);
	}

	var values = (0, _util.getType)(prop).value.map(function (_ref) {
		var value = _ref.value;
		return _react2.default.createElement(
			_Code2.default,
			{ key: value },
			(0, _util.showSpaces)((0, _util.unquote)(value))
		);
	});
	return _react2.default.createElement(
		'span',
		null,
		'One of:',
		' ',
		_react2.default.createElement(
			_reactGroup2.default,
			{ separator: ', ', inline: true },
			values
		)
	);
}

function renderShape(props) {
	var rows = [];
	for (var name in props) {
		var prop = props[name];
		var defaultValue = renderDefault(prop);
		var description = prop.description;
		rows.push(_react2.default.createElement(
			'div',
			{ key: name },
			_react2.default.createElement(
				_Name2.default,
				null,
				name
			),
			': ',
			_react2.default.createElement(
				_Type2.default,
				null,
				renderType(prop)
			),
			defaultValue && ' — ',
			defaultValue,
			description && ' — ',
			description && _react2.default.createElement(_Markdown2.default, { text: description, inline: true })
		));
	}
	return rows;
}

function renderDefault(prop) {
	if (prop.required) {
		return _react2.default.createElement(
			_Text2.default,
			null,
			'Required'
		);
	} else if (prop.defaultValue) {
		if (prop.type && prop.type.name === 'func') {
			return _react2.default.createElement(
				_Text2.default,
				{ underlined: true, title: (0, _util.showSpaces)((0, _util.unquote)(prop.defaultValue.value)) },
				'Function'
			);
		}

		return _react2.default.createElement(
			_Code2.default,
			null,
			(0, _util.showSpaces)((0, _util.unquote)(prop.defaultValue.value))
		);
	}
	return '';
}

function renderDescription(prop) {
	var description = prop.description,
	    _prop$tags = prop.tags,
	    tags = _prop$tags === undefined ? {} : _prop$tags;

	var extra = renderExtra(prop);
	var args = [].concat(_toConsumableArray(tags.arg || []), _toConsumableArray(tags.argument || []), _toConsumableArray(tags.param || []));
	return _react2.default.createElement(
		'div',
		null,
		description && _react2.default.createElement(_Markdown2.default, { text: description }),
		extra && _react2.default.createElement(
			_Para2.default,
			null,
			extra
		),
		_react2.default.createElement(_JsDoc2.default, tags),
		args.length > 0 && _react2.default.createElement(_Arguments2.default, { args: args, heading: true })
	);
}

function renderExtra(prop) {
	var type = (0, _util.getType)(prop);

	if (!type) {
		return null;
	}
	switch (type.name) {
		case 'enum':
			return renderEnum(prop);
		case 'union':
			return renderUnion(prop);
		case 'shape':
			return renderShape(prop.type.value);
		case 'arrayOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value);
			}
			return null;
		case 'objectOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value);
			}
			return null;
		default:
			return null;
	}
}

function renderUnion(prop) {
	if (!Array.isArray((0, _util.getType)(prop).value)) {
		return _react2.default.createElement(
			'span',
			null,
			(0, _util.getType)(prop).value
		);
	}

	var values = (0, _util.getType)(prop).value.map(function (value) {
		return _react2.default.createElement(
			_Type2.default,
			{ key: value.name },
			renderType(value)
		);
	});
	return _react2.default.createElement(
		'span',
		null,
		'One of type:',
		' ',
		_react2.default.createElement(
			_reactGroup2.default,
			{ separator: ', ', inline: true },
			values
		)
	);
}

function renderName(prop) {
	var name = prop.name,
	    _prop$tags2 = prop.tags,
	    tags = _prop$tags2 === undefined ? {} : _prop$tags2;

	return _react2.default.createElement(
		_Name2.default,
		{ deprecated: !!tags.deprecated },
		name
	);
}

function renderTypeColumn(prop) {
	return _react2.default.createElement(
		_Type2.default,
		null,
		renderType((0, _util.getType)(prop))
	);
}

function getRowKey(row) {
	return row.name;
}

function propsToArray(props) {
	return (0, _map2.default)(props, function (prop, name) {
		return _extends({}, prop, { name: name });
	});
}

var columns = exports.columns = [{
	caption: 'Prop name',
	render: renderName
}, {
	caption: 'Type',
	render: renderTypeColumn
}, {
	caption: 'Default',
	render: renderDefault
}, {
	caption: 'Description',
	render: renderDescription
}];

function PropsRenderer(_ref2) {
	var props = _ref2.props;

	return _react2.default.createElement(_Table2.default, { columns: columns, rows: propsToArray(props), getRowKey: getRowKey });
}

PropsRenderer.propTypes = {
	props: _propTypes2.default.object.isRequired
};