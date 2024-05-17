// The following tests are copied and adapted directly from the Jed project,
// made available under the MIT License.
//
// https://github.com/messageformat/Jed
//
// Copyright JS Foundation and other contributors, https://js.foundation/
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import Jed from '../index.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/* eslint-disable */

(function (Jed) {
	describe('Property Checks', function () {
		it('should exist', function () {
			assert(Jed);
		});

		it('should have a context delimiter as per the gettext spec', function () {
			assert.equal(Jed.context_delimiter, '\u0004');
			assert.equal(Jed.context_delimiter, String.fromCharCode(4));
		});
	});

	// Group tests that need similar data
	(function () {
		var locale_data = {
			messages: {
				'': {
					domain: 'messages',
					lang: 'en',
					'plural-forms': 'nplurals=2; plural=(n != 1);',
				},
				test: ['test_translation_output'],
			},
		};

		var locale_data2 = {
			some_domain: {
				'': {
					domain: 'some_domain',
					lang: 'en',
					'plural-forms': 'nplurals=2; plural=(n != 1);',
				},
				test: ['test_translation_output2'],
				'zero length translation': [''],
			},
		};

		var locale_data3 = {
			some_domain: {
				'': {
					domain: 'some_domain',
					lang: 'ar',
					'plural-forms':
						'nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5);',
				},
				test: ['test_translation_output3'],
				'zero length translation': [''],
			},
		};

		var i18n = new Jed({
			domain: 'messages',
			locale_data: locale_data,
		});

		var i18n_2 = new Jed({
			domain: 'some_domain',
			locale_data: locale_data2,
		});

		var i18n_3 = new Jed({
			domain: 'some_domain',
			locale_data: locale_data3,
		});

		// Standard shorthand function
		function _(msgid) {
			return i18n_2.gettext(msgid);
		}

		// Actual tests
		describe('Instantiation', function () {
			it('should exist', function () {
				assert(i18n);
				assert(i18n_2);
				assert(i18n_3);
				assert(_);
			});
		});

		describe('Basic', function () {
			it('should translate a key that exists in the translation', function () {
				assert.equal(i18n.gettext('test'), 'test_translation_output');
			});

			it("should just pass through strings that aren't translatable", function () {
				assert.equal(i18n.gettext('missing'), 'missing');
			});

			it("should translate a key in a locale with plural-forms rules that don't assume n==1 will return 0", function () {
				assert.equal(i18n_3.gettext('test'), 'test_translation_output3');
			});

			it('should allow you to wrap it as a shorthand function', function () {
				assert.equal(_('test'), 'test_translation_output2');
				assert.equal(_('missing'), 'missing');
			});

			it('should have identical output for wrapped and non-wrapped instances', function () {
				assert.equal(_('test'), i18n_2.gettext('test'));
				assert.equal(_('missing'), i18n_2.gettext('missing'));
			});

			it("should not allow you to use domains that don't exist", function () {
				function badCreate() {
					var x = new Jed({
						domain: 'missing_domain',
						locale_data: locale_data,
					});
					return x;
				}
				assert.throws(badCreate);
			});

			it('should just pass through translations that are empty strings', function () {
				assert.equal(_('zero length translation'), 'zero length translation');
			});

			it('should call the callback function (if given) when a key is missing', function () {
				var callbackCalled;
				function missingKeyCallback(key) {
					callbackCalled = true;
				}

				callbackCalled = false;
				var jedWithCallback = new Jed({
					missing_key_callback: missingKeyCallback,
				});
				jedWithCallback.gettext('missing key');
				assert.equal(callbackCalled, true);

				callbackCalled = false;
				var jedWithoutCallback = new Jed({});
				jedWithoutCallback.gettext('missing key');
				assert.equal(callbackCalled, false);
			});
		});
	})();

	(function () {
		var locale_data = {
			messages_1: {
				'': {
					domain: 'messages_1',
					lang: 'en',
					'plural-forms': 'nplurals=2; plural=(n != 1);',
				},
				test: ['test_1'],
				'test singular': ['test_1 singular', 'test_1 plural'],
				'context\u0004test': ['test_1 context'],
				'context\u0004test singular': [
					'test_1 context singular',
					'test_1 context plural',
				],
			},
			messages_2: {
				'': {
					domain: 'messages_2',
					lang: 'en',
					'plural-forms': 'nplurals=2; plural=(n != 1);',
				},
				test: ['test_2'],
				'test singular': ['test_2 singular', 'test_2 plural'],
				'context\u0004test': ['test_2 context'],
				'context\u0004test singular': [
					'test_2 context singular',
					'test_2 context plural',
				],
			},
		};

		describe('Domain', function () {
			var i18n1 = new Jed({
				domain: 'messages_1',
				locale_data: locale_data,
			});

			var i18n_2 = new Jed({
				domain: 'messages_2',
				locale_data: locale_data,
			});

			// No default domain
			var i18n_3 = new Jed({
				locale_data: locale_data,
			});

			it('should use the correct domain when there are multiple', function () {
				assert.equal(i18n1.gettext('test'), 'test_1');
				assert.equal(i18n_2.gettext('test'), 'test_2');
			});

			it('should still pass through non-existent keys', function () {
				assert.equal(i18n1.gettext('nope'), 'nope');
				assert.equal(i18n_2.gettext('nope again'), 'nope again');
			});

			it('should reveal the current domain on any instance', function () {
				assert.equal(i18n1.textdomain(), 'messages_1');
				assert.equal(i18n_2.textdomain(), 'messages_2');
			});

			it('should use `messages` as the default domain if none given', function () {
				assert.equal(i18n_3.textdomain(), 'messages');
			});

			it('should allow on the fly domain switching', function () {
				// Switch these up
				i18n1.textdomain('messages_2');
				i18n_2.textdomain('messages_1');

				assert.equal(i18n1.gettext('test'), 'test_2');
				assert.equal(i18n_2.gettext('test'), 'test_1');
				assert.equal(i18n1.textdomain(), 'messages_2');
				assert.equal(i18n_2.textdomain(), 'messages_1');
			});

			describe('#dgettext', function () {
				it('should have the dgettext function', function () {
					assert(i18n_3.dgettext);
				});

				it('should allow you to call the domain on the fly', function () {
					assert.equal(i18n_3.dgettext('messages_1', 'test'), 'test_1');
					assert.equal(i18n_3.dgettext('messages_2', 'test'), 'test_2');
				});

				it('should pass through non-existent keys', function () {
					assert.equal(i18n_3.dgettext('messages_1', 'nope'), 'nope');
					assert.equal(
						i18n_3.dgettext('messages_2', 'nope again'),
						'nope again'
					);
				});
			});

			describe('#dcgettext', function () {
				var i18n_4 = new Jed({
					locale_data: locale_data,
				});

				it('should have the dcgettext function', function () {
					assert(i18n_4.dcgettext);
				});

				it('should ignore categories altogether', function () {
					assert.equal(
						i18n_4.dcgettext('messages_1', 'test', 'A_CATEGORY'),
						'test_1'
					);
				});
			});
		});

		describe('Pluralization', function () {
			var locale_data1 = {
				plural_test: {
					'': {
						domain: 'plural_test',
						lang: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
					},
					'test singular': ['test_1'],
					'test plural %1$d': ['test_1_singular %1$d', 'test_1_plural %1$d'],
					'context\u0004test context': ['test_1context'],
					test2: ['test_2'],
					'zero length translation': [''],
					'context\u0004test2': ['test_2context'],
					'Not translated plural': ['asdf', 'asdf'], // this should never hit, since it's msgid2
					'context\u0004context plural %1$d': [
						'context_plural_1 singular %1$d',
						'context_plural_1 plural %1$d',
					],
				},
			};

			var locale_data2 = {
				plural_test2: {
					'': {
						domain: 'plural_test2',
						lang: 'sl',
						// actual Slovenian pluralization rules
						plural_forms:
							'nplurals=4; plural=(n==1 ? 0 : n%10==2 ? 1 : n%10==3 || n%10==4 ? 2 : 3);',
					},
					Singular: ['Numerus 0', 'Numerus 1', 'Numerus 2', 'Numerus 3'],
				},
			};

			var i18n = new Jed({
				domain: 'plural_test',
				locale_data: locale_data1,
			});

			var i18n_2 = new Jed({
				domain: 'plural_test2',
				locale_data: locale_data2,
			});

			describe('#ngettext', function () {
				it('should have a ngettext function', function () {
					assert(i18n.ngettext);
				});

				it('should choose the correct pluralization translation', function () {
					assert.equal(
						i18n.ngettext('test plural %1$d', 'test plural %1$d', 1),
						'test_1_singular %1$d'
					);
					assert.equal(
						i18n.ngettext('test plural %1$d', 'test plural %1$d', 2),
						'test_1_plural %1$d'
					);
					assert.equal(
						i18n.ngettext('test plural %1$d', 'test plural %1$d', 0),
						'test_1_plural %1$d'
					);
				});

				it('should still pass through on plurals', function () {
					assert.equal(
						i18n.ngettext('Not translated', 'Not translated plural', 1),
						'Not translated'
					);
					assert.equal(
						i18n.ngettext('Not translated', 'Not translated plural', 2),
						'Not translated plural'
					);
					assert.equal(
						i18n.ngettext('Not translated', 'Not translated plural', 0),
						'Not translated plural'
					);
					assert.equal(
						i18n_2.ngettext('Not translated', 'Not translated plural', 3),
						'Not translated plural'
					);
				});

				it('should be able to parse complex pluralization rules', function () {
					var strings = ['Singular', 'Plural'];
					for (var i = 0; i <= 40; i++) {
						var translation = i18n_2.ngettext(strings[0], strings[1], i);
						var plural =
							i == 1 ? 0 : i % 10 == 2 ? 1 : i % 10 == 3 || i % 10 == 4 ? 2 : 3;

						assert.equal(translation, 'Numerus ' + plural);
					}
				});
			});

			var locale_data_multi = {
				messages_3: {
					'': {
						domain: 'messages_3',
						lang: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
					},
					test: ['test_1'],
					'test singular': ['test_1 singular', 'test_1 plural'],
					'context\u0004test': ['test_1 context'],
					'context\u0004test singular': [
						'test_1 context singular',
						'test_1 context plural',
					],
				},
				messages_4: {
					'': {
						domain: 'messages_4',
						lang: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
					},
					test: ['test_2'],
					'test singular': ['test_2 singular', 'test_2 plural'],
					'context\u0004test': ['test_2 context'],
					'context\u0004test singular': [
						'test_2 context singular',
						'test_2 context plural',
					],
				},
			};

			describe('#dngettext', function () {
				var i18n = new Jed({
					locale_data: locale_data_multi,
				});

				it('should have a dngettext function', function () {
					assert(i18n.dngettext);
				});

				it('should pluralize correctly, based on domain rules', function () {
					assert.equal(
						i18n.dngettext('messages_3', 'test singular', 'test plural', 1),
						'test_1 singular'
					);
					assert.equal(
						i18n.dngettext('messages_3', 'test singular', 'test plural', 2),
						'test_1 plural'
					);
					assert.equal(
						i18n.dngettext('messages_3', 'test singular', 'test plural', 0),
						'test_1 plural'
					);

					assert.equal(
						i18n.dngettext('messages_4', 'test singular', 'test plural', 1),
						'test_2 singular'
					);
					assert.equal(
						i18n.dngettext('messages_4', 'test singular', 'test plural', 2),
						'test_2 plural'
					);
					assert.equal(
						i18n.dngettext('messages_4', 'test singular', 'test plural', 0),
						'test_2 plural'
					);
				});

				it('should passthrough non-found keys regardless of pluralization addition', function () {
					assert.equal(
						i18n.dngettext(
							'messages_3',
							'Not translated',
							'Not translated plural',
							1
						),
						'Not translated'
					);
					assert.equal(
						i18n.dngettext(
							'messages_3',
							'Not translated',
							'Not translated plural',
							2
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dngettext(
							'messages_3',
							'Not translated',
							'Not translated plural',
							0
						),
						'Not translated plural'
					);

					assert.equal(
						i18n.dngettext(
							'messages_4',
							'Not translated',
							'Not translated plural',
							1
						),
						'Not translated'
					);
					assert.equal(
						i18n.dngettext(
							'messages_4',
							'Not translated',
							'Not translated plural',
							2
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dngettext(
							'messages_4',
							'Not translated',
							'Not translated plural',
							0
						),
						'Not translated plural'
					);
				});
			});

			describe('#dcngettext', function () {
				var i18n = new Jed({
					locale_data: locale_data_multi,
				});

				it('should more or less ignore the category', function () {
					assert.equal(
						i18n.dcngettext(
							'messages_3',
							'test singular',
							'test plural',
							1,
							'LC_MESSAGES'
						),
						'test_1 singular'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_3',
							'test singular',
							'test plural',
							2,
							'LC_MESSAGES'
						),
						'test_1 plural'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_3',
							'test singular',
							'test plural',
							0,
							'LC_MESSAGES'
						),
						'test_1 plural'
					);

					assert.equal(
						i18n.dcngettext(
							'messages_4',
							'test singular',
							'test plural',
							1,
							'LC_MESSAGES'
						),
						'test_2 singular'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_4',
							'test singular',
							'test plural',
							2,
							'LC_MESSAGES'
						),
						'test_2 plural'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_4',
							'test singular',
							'test plural',
							0,
							'LC_MESSAGES'
						),
						'test_2 plural'
					);

					assert.equal(
						i18n.dcngettext(
							'messages_3',
							'Not translated',
							'Not translated plural',
							1,
							'LC_MESSAGES'
						),
						'Not translated'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_3',
							'Not translated',
							'Not translated plural',
							2,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_3',
							'Not translated',
							'Not translated plural',
							0,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);

					assert.equal(
						i18n.dcngettext(
							'messages_4',
							'Not translated',
							'Not translated plural',
							1,
							'LC_MESSAGES'
						),
						'Not translated'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_4',
							'Not translated',
							'Not translated plural',
							2,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dcngettext(
							'messages_4',
							'Not translated',
							'Not translated plural',
							0,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);
				});
			});

			describe('#pgettext', function () {
				var locale_data_w_context = {
					context_test: {
						'': {
							domain: 'context_test',
							lang: 'en',
							'plural-forms': 'nplurals=2; plural=(n != 1);',
						},
						'test singular': ['test_1'],
						'test plural %1$d': ['test_1_singular %1$d', 'test_1_plural %1$d'],
						'context\u0004test context': ['test_1context'],
						test2: ['test_2'],
						'zero length translation': [''],
						'context\u0004test2': ['test_2context'],
						'context\u0004context plural %1$d': [
							'context_plural_1 singular %1$d',
							'context_plural_1 plural %1$d',
						],
					},
				};

				var i18n = new Jed({
					domain: 'context_test',
					locale_data: locale_data_w_context,
				});

				it('should expose the pgettext function', function () {
					assert(i18n.pgettext);
				});

				it('should accept a context and look up a new key using the context_glue', function () {
					assert.equal(
						i18n.pgettext('context', 'test context'),
						'test_1context'
					);
				});

				it('should still pass through missing keys', function () {
					assert.equal(
						i18n.pgettext('context', 'Not translated'),
						'Not translated'
					);
				});

				it('should make sure same msgid returns diff results w/ context when appropriate', function () {
					assert.equal(i18n.gettext('test2'), 'test_2');
					assert.equal(i18n.pgettext('context', 'test2'), 'test_2context');
				});
			});

			describe('#dpgettext', function () {
				var i18n = new Jed({
					locale_data: locale_data_multi,
				});

				it('should have a dpgettext function', function () {
					assert(i18n.dpgettext);
				});

				it('should use the domain and the context simultaneously', function () {
					assert.equal(
						i18n.dpgettext('messages_3', 'context', 'test'),
						'test_1 context'
					);
					assert.equal(
						i18n.dpgettext('messages_4', 'context', 'test'),
						'test_2 context'
					);
				});

				it("should pass through if either the domain, the key or the context isn't found", function () {
					assert.equal(
						i18n.dpgettext('messages_3', 'context', 'Not translated'),
						'Not translated'
					);
					assert.equal(
						i18n.dpgettext('messages_4', 'context', 'Not translated'),
						'Not translated'
					);
				});
			});

			describe('#dcpgettext', function () {
				var i18n = new Jed({
					locale_data: locale_data_multi,
				});

				it('should have a dcpgettext function', function () {
					assert(i18n.dcpgettext);
				});

				it('should use the domain and the context simultaneously - ignore the category', function () {
					assert.equal(
						i18n.dcpgettext('messages_3', 'context', 'test', 'LC_MESSAGES'),
						'test_1 context'
					);
					assert.equal(
						i18n.dcpgettext('messages_4', 'context', 'test', 'LC_MESSAGES'),
						'test_2 context'
					);
				});

				it("should pass through if either the domain, the key or the context isn't found", function () {
					assert.equal(
						i18n.dcpgettext(
							'messages_3',
							'context',
							'Not translated',
							'LC_MESSAGES'
						),
						'Not translated'
					);
					assert.equal(
						i18n.dcpgettext(
							'messages_4',
							'context',
							'Not translated',
							'LC_MESSAGES'
						),
						'Not translated'
					);
				});
			});

			describe('#npgettext', function () {
				var locale_data_w_context = {
					context_plural_test: {
						'': {
							domain: 'context_plural_test',
							lang: 'en',
							'plural-forms': 'nplurals=2; plural=(n != 1);',
						},
						'test singular': ['test_1'],
						'test plural %1$d': ['test_1_singular %1$d', 'test_1_plural %1$d'],
						'context\u0004test context': ['test_1context'],
						test2: ['test_2'],
						'zero length translation': [''],
						'context\u0004test2': ['test_2context'],
						'context\u0004context plural %1$d': [
							'context_plural_1 singular %1$d',
							'context_plural_1 plural %1$d',
						],
					},
				};

				var i18n = new Jed({
					domain: 'context_plural_test',
					locale_data: locale_data_w_context,
				});

				it('should have a dcpgettext function', function () {
					assert(i18n.dcpgettext);
				});

				it('should handle plurals at the same time as contexts', function () {
					assert.equal(
						i18n.npgettext('context', 'context plural %1$d', 'plural %1$d', 1),
						'context_plural_1 singular %1$d'
					);
					assert.equal(
						i18n.npgettext('context', 'context plural %1$d', 'plural %1$d', 2),
						'context_plural_1 plural %1$d'
					);
					assert.equal(
						i18n.npgettext('context', 'context plural %1$d', 'plural %1$d', 0),
						'context_plural_1 plural %1$d'
					);
				});

				it('should just pass through on not-found cases', function () {
					assert.equal(
						i18n.npgettext(
							'context',
							'Not translated',
							'Not translated plural',
							1
						),
						'Not translated'
					);
					assert.equal(
						i18n.npgettext(
							'context',
							'Not translated',
							'Not translated plural',
							2
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.npgettext(
							'context',
							'Not translated',
							'Not translated plural',
							0
						),
						'Not translated plural'
					);
				});
			});

			describe('#dnpgettext', function () {
				var i18n = new Jed({
					locale_data: locale_data_multi,
				});

				it('should have a dnpgettext function', function () {
					assert(i18n.dnpgettext);
				});

				it('should be able to do a domain, context, and pluralization lookup all at once', function () {
					assert.equal(
						i18n.dnpgettext(
							'messages_3',
							'context',
							'test singular',
							'test plural',
							1
						),
						'test_1 context singular'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_3',
							'context',
							'test singular',
							'test plural',
							2
						),
						'test_1 context plural'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_3',
							'context',
							'test singular',
							'test plural',
							0
						),
						'test_1 context plural'
					);

					assert.equal(
						i18n.dnpgettext(
							'messages_4',
							'context',
							'test singular',
							'test plural',
							1
						),
						'test_2 context singular'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_4',
							'context',
							'test singular',
							'test plural',
							2
						),
						'test_2 context plural'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_4',
							'context',
							'test singular',
							'test plural',
							0
						),
						'test_2 context plural'
					);
				});

				it("should pass through if everything doesn't point towards a key", function () {
					assert.equal(
						i18n.dnpgettext(
							'messages_3',
							'context',
							'Not translated',
							'Not translated plural',
							1
						),
						'Not translated'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_3',
							'context',
							'Not translated',
							'Not translated plural',
							2
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_3',
							'context',
							'Not translated',
							'Not translated plural',
							0
						),
						'Not translated plural'
					);

					assert.equal(
						i18n.dnpgettext(
							'messages_4',
							'context',
							'Not translated',
							'Not translated plural',
							1
						),
						'Not translated'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_4',
							'context',
							'Not translated',
							'Not translated plural',
							2
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dnpgettext(
							'messages_4',
							'context',
							'Not translated',
							'Not translated plural',
							0
						),
						'Not translated plural'
					);
				});
			});

			describe('#dcnpgettext', function () {
				var i18n = new Jed({
					locale_data: locale_data_multi,
				});

				it('should have a dcnpgettext function', function () {
					assert(i18n.dcnpgettext);
				});

				it('should be able to do a domain, context, and pluralization lookup all at once - ignore category', function () {
					assert.equal(
						i18n.dcnpgettext(
							'messages_3',
							'context',
							'test singular',
							'test plural',
							1,
							'LC_MESSAGES'
						),
						'test_1 context singular'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_3',
							'context',
							'test singular',
							'test plural',
							2,
							'LC_MESSAGES'
						),
						'test_1 context plural'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_3',
							'context',
							'test singular',
							'test plural',
							0,
							'LC_MESSAGES'
						),
						'test_1 context plural'
					);

					assert.equal(
						i18n.dcnpgettext(
							'messages_4',
							'context',
							'test singular',
							'test plural',
							1,
							'LC_MESSAGES'
						),
						'test_2 context singular'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_4',
							'context',
							'test singular',
							'test plural',
							2,
							'LC_MESSAGES'
						),
						'test_2 context plural'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_4',
							'context',
							'test singular',
							'test plural',
							0,
							'LC_MESSAGES'
						),
						'test_2 context plural'
					);
				});

				it("should pass through if everything doesn't point towards a key", function () {
					assert.equal(
						i18n.dcnpgettext(
							'messages_3',
							'context',
							'Not translated',
							'Not translated plural',
							1,
							'LC_MESSAGES'
						),
						'Not translated'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_3',
							'context',
							'Not translated',
							'Not translated plural',
							2,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_3',
							'context',
							'Not translated',
							'Not translated plural',
							0,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);

					assert.equal(
						i18n.dcnpgettext(
							'messages_4',
							'context',
							'Not translated',
							'Not translated plural',
							1,
							'LC_MESSAGES'
						),
						'Not translated'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_4',
							'context',
							'Not translated',
							'Not translated plural',
							2,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);
					assert.equal(
						i18n.dcnpgettext(
							'messages_4',
							'context',
							'Not translated',
							'Not translated plural',
							0,
							'LC_MESSAGES'
						),
						'Not translated plural'
					);
				});
			});
		});

		describe('Plural Forms Parsing', function () {
			// This is the method from the original gettext.js that uses new Function
			function evalParse(plural_forms) {
				var pf_re = new RegExp(
					'^(\\s*nplurals\\s*=\\s*[0-9]+\\s*;\\s*plural\\s*=\\s*(?:\\s|[-\\?\\|&=!<>+*/%:;a-zA-Z0-9_()])+)',
					'm'
				);
				if (pf_re.test(plural_forms)) {
					var pf = plural_forms;
					if (!/;\s*$/.test(pf)) pf = pf.concat(';');

					var code =
						'var plural; var nplurals; ' +
						pf +
						' return { "nplural" : nplurals, "plural" : (plural === true ? 1 : plural ? plural : 0) };';
					return new Function('n', code);
				} else {
					throw new Error(
						'Syntax error in language file. Plural-Forms header is invalid [' +
							plural_forms +
							']'
					);
				}
			}

			// http://translate.sourceforge.net/wiki/l10n/pluralforms
			it('should have the same result as doing an eval on the expression for all known plural-forms.', function () {
				var pfs = [
						'nplurals=2; plural=(n > 1)',
						'nplurals=2; plural=(n != 1)',
						'nplurals=6; plural= n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;',
						'nplurals=1; plural=0',
						'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)',
						'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2',
						'nplurals=3; plural=n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2',
						'nplurals=4; plural= (n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3',
						'nplurals=2; plural=n > 1',
						'nplurals=5; plural=n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4',
						'nplurals=4; plural=(n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3',
						'nplurals=2; plural= (n > 1)',
						'nplurals=2; plural=(n%10!=1 || n%100==11)',
						'nplurals=2; plural=n!=0',
						'nplurals=2; plural=(n!=1)',
						'nplurals=2; plural=(n!= 1)',
						'nplurals=4; plural= (n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3',
						'nplurals=2; plural=n>1;',
						'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2)',
						'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2)',
						'nplurals=2; plural= n==1 || n%10==1 ? 0 : 1',
						'nplurals=3; plural=(n==0 ? 0 : n==1 ? 1 : 2)',
						'nplurals=4; plural=(n==1 ? 0 : n==0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3)',
						'nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)',
						'nplurals=2; plural=(n!=1);',
						'nplurals=3; plural=(n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);',
						'nplurals=4; plural=(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0)',
						'nplurals=2; plural=n != 1',
						'nplurals=2; plural=(n>1)',
						'nplurals=1; plural=0;',
					],
					pf,
					pfc,
					pfe,
					pfi,
					i;
				for (pfi = 0; pfi < pfs.length; pfi++) {
					pf = '' + pfs[pfi];
					for (i = 0; i < 106; i++) {
						pfc = Jed.PF.compile('' + pf)(i);
						pfe = evalParse('' + pf)(i).plural;
						if (pfc !== pfe) {
							throw new Error('expected ' + pfe + ' but got ' + pfc);
						}
					}
				}
			});
		});

		describe('Chainable API', function () {
			var locale_data_w_context = {
				context_sprintf_test: {
					'': {
						domain: 'context_sprintf_test',
						lang: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
					},
					'test singular': ['test_1'],
					'test plural %1$d': ['test_1_singular %1$d', 'test_1_plural %1$d'],
					'context\u0004test context': ['test_1context'],
					test2: ['test_2'],
					'zero length translation': [''],
					'context\u0004test2': ['test_2context'],
					'context\u0004context plural %1$d': [
						'context_plural_1 singular %1$d',
						'context_plural_1 plural %1$d',
					],
				},
				other_domain: {
					'': {
						domain: 'other_domain',
						lang: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
					},
					'test other_domain singular': ['other domain test 1'],
					'context\u0004context other plural %1$d': [
						'context_plural_1 singular %1$d',
						'context_plural_1 plural %1$d',
					],
				},
			};
			var i18n = new Jed({
				locale_data: locale_data_w_context,
				domain: 'context_sprintf_test',
			});

			it('should handle a simple gettext passthrough', function () {
				assert.equal(i18n.translate('test singular').fetch(), 'test_1');
			});

			it('should handle changing domains', function () {
				assert.equal(
					i18n
						.translate('test other_domain singular')
						.onDomain('other_domain')
						.fetch(),
					'other domain test 1'
				);
			});

			it('should allow you to add plural information in the chain.', function () {
				assert.equal(
					i18n.translate('test plural %1$d').ifPlural(5, 'dont matta').fetch(),
					'test_1_plural %1$d'
				);
			});

			it('should take in a sprintf set of args (as array) on the plural lookup', function () {
				assert.equal(
					i18n
						.translate('test plural %1$d')
						.ifPlural(5, 'dont matta')
						.fetch([5]),
					'test_1_plural 5'
				);
				assert.equal(
					i18n
						.translate('test plural %1$d %2$d')
						.ifPlural(5, 'dont matta %1$d %2$d')
						.fetch([5, 6]),
					'dont matta 5 6'
				);
				assert.equal(
					i18n
						.translate('test plural %1$d %2$d')
						.ifPlural(1, 'dont matta %1$d %2$d')
						.fetch([1, 6]),
					'test plural 1 6'
				);
			});

			it('should take in a sprintf set of args (as args) on the plural lookup', function () {
				assert.equal(
					i18n
						.translate('test plural %1$d %2$d')
						.ifPlural(5, 'dont matta %1$d %2$d')
						.fetch(5, 6),
					'dont matta 5 6'
				);
				assert.equal(
					i18n
						.translate('test plural %1$d %2$d')
						.ifPlural(1, 'dont matta %1$d %2$d')
						.fetch(1, 6),
					'test plural 1 6'
				);
			});

			it('should handle context information.', function () {
				assert.equal(
					i18n.translate('test context').withContext('context').fetch(),
					'test_1context'
				);
			});

			it('should be able to do all at the same time.', function () {
				assert.equal(
					i18n
						.translate('context other plural %1$d')
						.withContext('context')
						.onDomain('other_domain')
						.ifPlural(5, 'ignored %1$d')
						.fetch(5),
					'context_plural_1 plural 5'
				);
				assert.equal(
					i18n
						.translate('context other plural %1$d')
						.withContext('context')
						.onDomain('other_domain')
						.ifPlural(1, 'ignored %1$d')
						.fetch(1),
					'context_plural_1 singular 1'
				);
			});
		});

		describe('Sprintf', function () {
			var locale_data_w_context = {
				context_sprintf_test: {
					'': {
						domain: 'context_sprintf_test',
						lang: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
					},
					'test singular': ['test_1'],
					'test plural %1$d': ['test_1_singular %1$d', 'test_1_plural %1$d'],
					'context\u0004test context': ['test_1context'],
					test2: ['test_2'],
					'zero length translation': [''],
					'context\u0004test2': ['test_2context'],
					'context\u0004context plural %1$d': [
						'context_plural_1 singular %1$d',
						'context_plural_1 plural %1$d',
					],
				},
			};

			var i18n = new Jed({
				locale_data: locale_data_w_context,
				domain: 'context_sprintf_test',
			});

			it('should take multiple types of arrays as input', function () {
				var strings = {
					blah: 'blah',
					'thing%1$sbob': 'thing[one]bob',
					'thing%1$s%2$sbob': 'thing[one][two]bob',
					'thing%1$sasdf%2$sasdf': 'thing[one]asdf[two]asdf',
					'%1$s%2$s%3$s': '[one][two]',
					'tom%1$saDick': 'tom[one]aDick',
				};
				var args = ['[one]', '[two]'];

				for (var i in strings) {
					// test using new Array
					assert.equal(Jed.sprintf(i, ['[one]', '[two]']), strings[i]);
					assert.equal(i18n.sprintf(i, ['[one]', '[two]']), strings[i]);
					// test using predefined array
					assert.equal(Jed.sprintf(i, args), strings[i]);
					assert.equal(i18n.sprintf(i, args), strings[i]);
				}
			});

			it('should accept a single string instead of an array', function () {
				// test using scalar rather than array
				var strings = {
					blah: 'blah',
					'': '',
					'%%': '%',
					'tom%%dick': 'tom%dick',
					'thing%1$sbob': 'thing[one]bob',
					'thing%1$s%2$sbob': 'thing[one]bob',
					'thing%1$sasdf%2$sasdf': 'thing[one]asdfasdf',
					'%1$s%2$s%3$s': '[one]',
				};
				var arg = '[one]';

				for (var i in strings) {
					assert.equal(Jed.sprintf(i, arg), strings[i]);
					assert.equal(i18n.sprintf(i, arg), strings[i]);
				}
			});
		});
	})();
})(Jed);
