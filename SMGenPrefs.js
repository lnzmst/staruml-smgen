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

    var AppInit           = app.getModule( "utils/AppInit" ),
        Core              = app.getModule( "core/Core" ),
        PreferenceManager = app.getModule( "core/PreferenceManager" ),
		FileUtils         = app.getModule( "file/FileUtils" );

	var preferenceId = "smgen";

	var template_h = FileUtils.getNativeModuleDirectoryPath( module ) + "/templates/cxx/h.mustache";
	var template_cc = FileUtils.getNativeModuleDirectoryPath( module ) + "/templates/cxx/cc.mustache";

    var SMGenPreferences = {
        "smgen.cxx": {
            text: "C++ Code Generation",
            type: "Section"
        },
		"smgen.cxx.template_h": {
            text: ".h template",
            description: "Path to template used to generate definitions",
            type: "String",
			"default": template_h
		},
		"smgen.cxx.template_cc": {
            text: ".cc template",
            description: "Path to template used to generate implementations",
            type: "String",
            "default": template_cc
		}
    };

    function getId() {
        return preferenceId;
    }

	function getCxxPrefs() {
		return {
			template_h: PreferenceManager.get( "smgen.cxx.template_h" ),
			template_cc: PreferenceManager.get( "smgen.cxx.template_cc" )
		};
	}

    AppInit.htmlReady(function () {
        PreferenceManager.register( preferenceId, "State Machine Gen", SMGenPreferences );
    });

    exports.getId       = getId;
    exports.getCxxPrefs = getCxxPrefs;
});
