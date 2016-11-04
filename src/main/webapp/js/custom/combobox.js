define(function(require, exports, module) {
	var $ = require('jquery');
	var jQuery = $;
	require('jquery.ui.autocomplete');
	require('jquery.ui.tooltip');

(function( $ ) {
		$.widget( "custom.combobox", {
			options:{placeholder:'',
				     required:false,
				     readonly:false
				},
			_create: function() {
				if(this.element.next().hasClass('ui-autocomplete-input')){
					this.wrapper = this.element.next();
				}else{
					this.wrapper = $( "<div>" )
					.addClass( "ui-autocomplete-input" )
					.insertAfter( this.element );
					this.element.style = this.element.attr('style');
					this.element.hide();
				}
				this._createAutocomplete();
				this._createShowAllButton();
			},

			_createAutocomplete: function() {
				var selected = this.element.children( "option:selected" ),
					value = selected.val() ? selected.text() : "";
				if(!this.wrapper.is(':empty')){
					this.input = this.wrapper.find('input.form-control').val(value)
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: $.proxy( this, "_source" )
					})
					.tooltip({
						tooltipClass: "ui-state-highlight"
					});
				}else{
					this.input = $( "<input type='text' data-aaa=''>" )
					.appendTo( this.wrapper)
					.val( value )
//					.css('width',this.element.css('width'))
					.attr( "title", "" )
					.attr("placeholder",this.options.placeholder)
					.attr("required",this.options.required)
					.attr("readonly",this.options.readonly)
					.addClass( "form-control" )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: $.proxy( this, "_source" )
					})
					.tooltip({
						tooltipClass: "ui-state-highlight"
					});
					if(this.element.css('width').indexOf('px')!=-1){
						this.input.css('width',this.element.css('width'));
					}
					
				}
				
				this._on( this.input, {
					autocompleteselect: function( event, ui ) {
						ui.item.option.selected = true;
						this._trigger( "select", event, {
							item: ui.item.option
						});
					},

					autocompletechange: "_removeIfInvalid"
				});
			},

			_createShowAllButton: function() {
				var input = this.input,
					wasOpen = false;
					
				if($(input).next().is('i')){
					$(input).next()
					.attr( "tabIndex", -1 )
					.attr( "title", "显示所有" )
					.tooltip()
					.mousedown(function() {
						wasOpen = input.autocomplete( "widget" ).is( ":visible" );
					})
					.click(function() {
						input.focus();
						if ( wasOpen ) {
							return;
						}
						input.autocomplete( "search", "" );
					});
				}else{
					$( "<i class='icon-caret-down icon-large'></i>")
					.attr( "tabIndex", -1 )
					.attr( "title", "显示所有" )
					.tooltip()
					.appendTo( this.wrapper )
					.mousedown(function() {
						wasOpen = input.autocomplete( "widget" ).is( ":visible" );
					})
					.click(function() {
						input.focus();

						// Close if already visible
						if ( wasOpen ) {
							return;
						}

						// Pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
					});
				}
				
			},

			_source: function( request, response ) {
				var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
				response( this.element.children( "option" ).map(function() {
					var text = $( this ).text();
					if ( this.value && ( !request.term || matcher.test(text) ) )
						return {
							label: text,
							value: text,
							option: this
						};
				}) );
			},

			_removeIfInvalid: function( event, ui ) {
				
				// Selected an item, nothing to do
				if ( ui.item ) {
					 this.input.change();
					 this.element.change();
					return;
				}

				// Search for a match (case-insensitive)
				var value = this.input.val(),
					valueLowerCase = value.toLowerCase(),
					valid = false;
				this.element.children( "option" ).each(function() {
					if ( $( this ).text().toLowerCase() === valueLowerCase ) {
						this.selected = valid = true;
						return false;
					}
				});

				// Found a match, nothing to do
				if ( valid ) {
					return;
				}

				// Remove invalid value
				this.input
					.val( "" )
					.tooltip( "open" );
				this.element.val( "" );
				this._delay(function() {
					this.input.tooltip( "close" ).attr( "title", "" );
				}, 2500 );
				this.input.data( "ui-autocomplete" ).term = "";
			},

			_destroy: function() {
				this.wrapper.remove();
				this.element.show();
			}
		});
	})( jQuery );
});