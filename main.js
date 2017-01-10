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

    var Commands       = app.getModule( "command/Commands" ),
        CommandManager = app.getModule( "command/CommandManager" ),
        MenuManager    = app.getModule( "menu/MenuManager" ),
		Repository     = app.getModule( "core/Repository" ),
		FileSystem     = app.getModule( "filesystem/FileSystem" ),
		FileUtils      = app.getModule( "file/FileUtils" ),
		Toast          = app.getModule( "ui/Toast" ),
		ProjectManager = app.getModule( "engine/ProjectManager" );

	var SMGenCxx       = require( "SMGenCxx" ),
		SMGenCsharp    = require( "SMGenCsharp" ),
		SMGenPrefs     = require( "SMGenPrefs" );

    /**
     * Command IDs
     */
    var CMD_SMGEN        = 'smgen',
        CMD_SMGEN_CXX    = 'smgen.cxx',
		CMD_SMGEN_CSHARP = 'smgen.csharp',
        CMD_SMGEN_PREFS  = 'smgen.prefs';

    /**
     * Command Handler for C++ Generator
     *
     * @return {$.Promise}
     */
    function _handleGenerateCxx() {
		console.log( "Generate C++ ..." );
        var result = new $.Deferred();
		SMGenCxx.generate().then( result.resolve, result.reject );
        return result.promise();
    }

    function _handleGenerateCsharp() {
		console.log( "Generate C# ..." );
        var result = new $.Deferred();
		SMGenCsharp.generate().then( result.resolve, result.reject );
        return result.promise();
	}

    function _handlePrefs() {
		console.log( "Configure SMGen ..." );
        CommandManager.execute( Commands.FILE_PREFERENCES, SMGenPrefs.getId() );
    }

    CommandManager.register( "State Machine Generator", CMD_SMGEN, CommandManager.doNothing );
    CommandManager.register( "C++ ...",                 CMD_SMGEN_CXX, _handleGenerateCxx );
    CommandManager.register( "C# ...",                  CMD_SMGEN_CSHARP, _handleGenerateCsharp );
    CommandManager.register( "Configure...",            CMD_SMGEN_PREFS, _handlePrefs );

    var menu, menuItem;
    menu = MenuManager.getMenu( Commands.TOOLS );
    menuItem = menu.addMenuItem( CMD_SMGEN );
    menuItem.addMenuItem( CMD_SMGEN_CXX );
    menuItem.addMenuItem( CMD_SMGEN_CSHARP );
    menuItem.addMenuDivider();
    menuItem.addMenuItem( CMD_SMGEN_PREFS );
});
