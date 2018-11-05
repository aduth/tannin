import Tannin from 'tannin';
import sprintf from '@tannin/sprintf';

var DEFAULT_OPTIONS = {
	locale_data: {
		messages: {
			'': {
				domain: 'messages',
				lang: 'en',
				plural_forms: 'nplurals=2; plural=(n != 1);',
			},
		},
	},
	domain: 'messages',
};

function identity( x ) {
	return x;
}

function Chain( key, instance ) {
	this._key = key;
	this._instance = instance;
}

Chain.prototype.onDomain = function( domain ) {
	this._domain = domain;

	return this;
};

Chain.prototype.withContext = function( context ) {
	this._context = context;

	return this;
};

Chain.prototype.ifPlural = function( num, pkey ) {
	this._val = num;
	this._pkey = pkey;

	return this;
};

Chain.prototype.fetch = function( sArr ) {
	var fn;

	if ( ! Array.isArray( sArr ) ) {
		sArr = Array.prototype.slice.call( arguments, 0 );
	}

	fn = sArr.length ? Jed.sprintf : identity;

	return fn(
		this._instance.dcnpgettext( this._domain, this._context, this._key, this._pkey, this._val ),
		sArr
	);
};

/**
 * Returns a new instance of a Jed-compatible Tannin shim.
 *
 * @example
 *
 * ```js
 * import Jed from '@tannin/compat';
 *
 * const i18n = new Jed( {
 * 	locale_data: {
 * 		the_domain: {
 * 			'': {
 * 				domain: 'the_domain',
 * 				lang: 'en',
 * 				plural_forms: 'nplurals=2; plural=(n != 1);',
 * 			},
 * 			example: [ 'singular translation', 'plural translation' ],
 * 		},
 * 	},
 * 	domain: 'the_domain',
 * } );
 *
 * i18n.translate( 'example' ).fetch();
 * // ⇒ 'singular translation'
 * ```
 *
 * @param {Object} options Jed options.
 */
export default function Jed( options ) {
	var key, config, tannin;

	// Assign options
	options = options || {};
	this.options = {};
	for ( key in DEFAULT_OPTIONS ) {
		this.options[ key ] = options[ key ] || DEFAULT_OPTIONS[ key ];
	}

	// Provide a default plural forms expression if omitted in data. This
	// mutates the passed options object.
	for ( key in this.options.locale_data ) {
		config = this.options.locale_data[ key ][ '' ];
		if ( ! config.plural_forms && ! config[ 'Plural-Forms' ] && ! config[ 'plural-forms' ] ) {
			config.plural_forms = DEFAULT_OPTIONS.locale_data.messages.plural_forms;
		}
	}

	if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
		throw new Error( 'Text domain set to non-existent domain: `' + options.domain + '`' );
	}

	this.textdomain( this.options.domain );
	this.sprintf = sprintf;

	tannin = this.tannin = new Tannin( this.options.locale_data, {
		contextDelimiter: Jed.context_delimiter,
		onMissingKey: options.missing_key_callback,
	} );

	Object.defineProperty( this.options, 'locale_data', {
		get: function() {
			return tannin.data;
		},
		set: function( value ) {
			tannin.data = value;
		},
	} );

	Jed.instances.push( this );
}

Jed.instances = [];

Object.defineProperty( Jed, 'context_delimiter', {
	get: function() {
		if ( Jed.instances.length ) {
			return Jed.instances[ 0 ].tannin.options.contextDelimiter;
		}

		return String.fromCharCode( 4 );
	},
	set: function( value ) {
		Jed.instances.forEach( function( instance ) {
			instance.tannin.options.contextDelimiter = value;
		} );
	},
} );

Jed.sprintf = sprintf;

Jed.PF = {};

Jed.PF.compile = function( p ) {
	var tannin = new Tannin( {
		default: {
			'': {
				plural_forms: p,
			},
		},
	} );

	return function( n ) {
		return tannin.getPluralForm( 'default', n );
	};
};

Jed.prototype.textdomain = function( domain ) {
	if ( ! domain ) {
		return this._textdomain;
	}

	this._textdomain = domain;
};

Jed.prototype.dcnpgettext = function( domain, context, singular_key, plural_key, val ) {
	plural_key = plural_key || singular_key;
	domain = domain || this._textdomain;

	return this.tannin.dcnpgettext( domain, context, singular_key, plural_key, val );
};

Jed.prototype.translate = function( key ) {
	return new Chain( key, this );
};

Jed.prototype.gettext = function( key ) {
	return this.dcnpgettext.call( this, undefined, undefined, key );
};

Jed.prototype.dgettext = function( domain, key ) {
	return this.dcnpgettext.call( this, domain, undefined, key );
};

Jed.prototype.dcgettext = function( domain, key ) {
	return this.dcnpgettext.call( this, domain, undefined, key );
};

Jed.prototype.ngettext = function( skey, pkey, val ) {
	return this.dcnpgettext.call( this, undefined, undefined, skey, pkey, val );
};

Jed.prototype.dngettext = function( domain, skey, pkey, val ) {
	return this.dcnpgettext.call( this, domain, undefined, skey, pkey, val );
};

Jed.prototype.dcngettext = function( domain, skey, pkey, val ) {
	return this.dcnpgettext.call( this, domain, undefined, skey, pkey, val );
};

Jed.prototype.pgettext = function( context, key ) {
	return this.dcnpgettext.call( this, undefined, context, key );
};

Jed.prototype.dpgettext = function( domain, context, key ) {
	return this.dcnpgettext.call( this, domain, context, key );
};

Jed.prototype.dcpgettext = function( domain, context, key ) {
	return this.dcnpgettext.call( this, domain, context, key );
};

Jed.prototype.npgettext = function( context, skey, pkey, val ) {
	return this.dcnpgettext.call( this, undefined, context, skey, pkey, val );
};

Jed.prototype.dnpgettext = function( domain, context, skey, pkey, val ) {
	return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
};
