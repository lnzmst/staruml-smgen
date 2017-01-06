/**
 * Copyright (c) 2017 Lorenzo Musto (lnz.mst@gmail.com - https://github.com/lnzmst)
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
define( function( require, exports, module ) {

    "use strict";

	var Repository     = app.getModule( "core/Repository" ),
		FileSystem     = app.getModule( "filesystem/FileSystem" ),
		FileUtils      = app.getModule( "file/FileUtils" ),
		Toast          = app.getModule( "ui/Toast" ),
		ProjectManager = app.getModule( "engine/ProjectManager" );

	var SMGenPrefs     = require( "SMGenPrefs" );

	function _generate() {

		console.log( 'Project: ' + ProjectManager.getFilename() );
		//console.log( FileUtils.getApplicationDirectoryPath() );
		//console.log( 'Module path:' + FileUtils.getNativeModuleDirectoryPath( module ) );

		var result = new $.Deferred();

		[ "@UMLInterface", "@UMLClass", "@UMLStateMachine" ].forEach( function( umltype ) {

			var elements = Repository.select( umltype );
			elements.forEach( function( elem ) {

				if (elem instanceof type.UMLStateMachine) {

					var data = {
						smNameSpaces: [],
						smTriggers: [],
						smEffects: [],
						smGuards: [],
						smStates: []
					};

					var cache = {
						_firstState: "",
						firstState: function () { if (cache._firstState === "") { cache._firstState = this.stateName; return cache._firstState; } },
						_firstTrigger: "",
						firstTrigger: function () { if (cache._firstTrigger === "") { cache._firstTrigger = data.smTriggers[0]; return cache._firstTrigger; } }
					};

					console.log( "Parsing " + elem.name + ' ' + elem.constructor.name );
					console.log( elem );
					data.smName = elem.name;
					data.smNAME = elem.name.toUpperCase();

					var parent = {};
					parent = elem._parent;
					while (parent instanceof type.UMLPackage) {
						console.log( parent.name + '::' );
						//console.log( parent );
						data.smNameSpaces.push( parent.name );
						parent = {};
						parent = parent._parent;
					}
					data.smNameSpaces.reverse();

					elem.regions.forEach( function( region ) {
						region.vertices.forEach( function( vertex ) {
							if (vertex instanceof type.UMLState || vertex instanceof type.UMLFinalState) {
								console.log( vertex );
								var state = {};
								state.stateName = vertex.name;
								state.stateTransitions = [];
								state.firstState = cache.firstState;
								state.firstTrigger = cache.firstTrigger;
								var seen = {}
								region.transitions.forEach( function( transition ) {
									if (vertex.name === transition.source.name) {
										transition.triggers.forEach( function( trigger ) {

											if (data.smTriggers.indexOf( trigger.name ) == -1) {
												data.smTriggers.push( trigger.name );
											}
											if (transition.guard !== "") {
												data.smGuards.push( transition.guard );
											}
											transition.effects.forEach( function( effect ) {
												data.smEffects.push( effect.name );
											});

											if (trigger.name in seen) {
												//console.log( trigger.name + ' found @ ' + seen[trigger.name] );

												var t_idx = seen[trigger.name];

												var target = {
													transitionTarget: transition.target.name,
													transitionEffects: []
												};
												if (transition.guard !== "") {
													target.transitionGuard = transition.guard;
												}
												transition.effects.forEach( function( effect ) {
													target.transitionEffects.push( effect.name );
												});

												state.stateTransitions[t_idx].triggerTargets.push( target );

											} else {

												var t = {
													triggerName: trigger.name,
													triggerTargets: []
												};

												var target = {
													transitionTarget: transition.target.name,
													transitionEffects: []
												};
												if (transition.guard !== "") {
													target.transitionGuard = transition.guard;
												}
												transition.effects.forEach( function( effect ) {
													target.transitionEffects.push( effect.name );
												});

												t.triggerTargets.push( target );

												state.stateTransitions.push( t );

												seen[trigger.name] = state.stateTransitions.length - 1;
											}
										});
									}
								});
								data.smStates.push( state );
							}
						})
					})

					var outdir = FileUtils.getDirectoryPath( ProjectManager.getFilename() );

					var smpath = "src/";
					data.smNameSpaces.forEach( function ( item ) {
						smpath += item + '/';
					});

					var fullPath = outdir + smpath;
					var directory = FileSystem.getDirectoryForPath( fullPath );
					directory.create( function( err, stat ) {
						if (!err || err === "AlreadyExists") {
							console.log( "mkdir: " + fullPath );
							Toast.info( "mkdir: " + fullPath );
						} else {
							console.error( err );
							Toast.error( err );
							result.reject( err );
							return result.promise();
						}
					});

					var cxxPrefs = SMGenPrefs.getCxxPrefs();
					var parms = [
						{
							extension: 'h',
							template: cxxPrefs.template_h
						},
						{
							extension: 'cc',
							template: cxxPrefs.template_cc
						}
					];

					parms.forEach( function( parm ) {

						var file = FileSystem.getFileForPath( parm.template );
						FileUtils.readAsText( file )
							.fail( function( err ) {
								console.error( err );
								Toast.error( err );
								result.reject( error );
								return result.promise();
							})
							.done( function( text ) {
								console.log( data );
								var outtext = Mustache.render( text, data );
								var outfile = FileSystem.getFileForPath( fullPath + data.smName + '.' + parm.extension );
								var allowBlindWrite = true;
								FileUtils.writeText( outfile, outtext, allowBlindWrite )
									.done( function() {
										console.log( 'Wrote ' + fullPath + data.smName + '.' + parm.extension );
										console.log( outtext );
										Toast.info( 'Wrote ' + fullPath + data.smName + '.' + parm.extension );
									})
									.fail( function( error ) {
										console.error( error );
										Toast.error( error );
										result.reject( error );
										return result.promise();
									})
							})

					})

				}

			})
		})

		result.resolve();
        return result.promise();
	}

	exports.generate    = _generate;
});
