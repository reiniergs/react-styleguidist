'use strict';

require('./polyfills');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _isFinite = require('lodash/isFinite');

var _isFinite2 = _interopRequireDefault(_isFinite);

var _slots = require('rsg-components/slots');

var _slots2 = _interopRequireDefault(_slots);

var _StyleGuide = require('rsg-components/StyleGuide');

var _StyleGuide2 = _interopRequireDefault(_StyleGuide);

var _utils = require('./utils/utils');

require('./styles');

var _reactGa = require('react-ga');

var _reactGa2 = _interopRequireDefault(_reactGa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactGa2.default.initialize('UA-101225731-1');

// Examples code revision to rerender only code examples (not the whole page) when code changes
/* eslint-disable import/first */

var codeRevision = 0;

function fireTracking() {
	_reactGa2.default.pageview(window.location.hash);
}

function renderStyleguide() {
	fireTracking();
	// eslint-disable-next-line import/no-unresolved
	var styleguide = require('!!../loaders/styleguide-loader!./index.js');

	var sections = (0, _utils.processSections)(styleguide.sections);

	// Parse URL hash to check if the components list must be filtered

	var _getInfoFromHash = (0, _utils.getInfoFromHash)(),
	    targetName = _getInfoFromHash.targetName,
	    targetIndex = _getInfoFromHash.targetIndex;

	var isolatedComponent = false;
	var isolatedExample = false;
	var isolatedSection = false;

	// Filter the requested component id required
	if (targetName) {
		var filteredComponents = (0, _utils.filterComponentsInSectionsByExactName)(sections, targetName);
		if (filteredComponents.length) {
			sections = [{ components: filteredComponents }];
			isolatedComponent = true;
		} else {
			var section = (0, _utils.findSection)(sections, targetName);
			sections = section ? [section] : [];
			isolatedSection = true;
		}

		// If a single component or section is filtered and a fenced block index is specified hide all other examples
		if ((0, _isFinite2.default)(targetIndex)) {
			if (filteredComponents.length === 1) {
				filteredComponents[0] = (0, _utils.filterComponentExamples)(filteredComponents[0], targetIndex);
				isolatedExample = true;
			} else if (sections.length === 1) {
				sections[0] = (0, _utils.filterSectionExamples)(sections[0], targetIndex);
				isolatedExample = true;
			}
		}
	}

	// Reset slugger for each render to be deterministic
	_utils.slugger.reset();
	sections = (0, _utils.setSlugs)(sections);

	var documentTitle = styleguide.config.title;
	if (isolatedComponent || isolatedExample) {
		documentTitle = sections[0].components[0].name + ' — ' + documentTitle;
	} else if (isolatedSection) {
		documentTitle = sections[0].name + ' — ' + documentTitle;
	}
	document.title = documentTitle;

	_reactDom2.default.render(_react2.default.createElement(_StyleGuide2.default, {
		codeRevision: codeRevision,
		config: styleguide.config,
		slots: _slots2.default,
		welcomeScreen: styleguide.welcomeScreen,
		patterns: styleguide.patterns,
		sections: sections,
		isolatedComponent: isolatedComponent,
		isolatedExample: isolatedExample,
		isolatedSection: isolatedSection
	}), document.getElementById('app'));
}

window.addEventListener('hashchange', renderStyleguide);

/* istanbul ignore if */
if (module.hot) {
	module.hot.accept('!!../loaders/styleguide-loader!./index.js', function () {
		codeRevision += 1;
		renderStyleguide();
	});
}

renderStyleguide();