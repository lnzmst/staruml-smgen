# staruml-smgen

A StarUML Extension for Template based source code generation of UML State Machines.

## License
staruml-smgen is released under [License MIT](https://opensource.org/licenses/MIT).

## Mustache Logic-less Templates
Mustache Logic-less templates ([https://mustache.github.io](https://mustache.github.io)) are at the base of code generation process. They work
by expanding tags in a template using values provided in a hash or object whose
actual values are computed by running the staruml-smgen extension via the menu
```
    Tools > State Machine Generator > C++ ...
```

### Default Templates

Default templates are provided into staruml-smgen extension's installation folder that
can be detected by the Configuration menu
```
    Tools > State Machine Generator > Configure ...
```

#### C++
Depending on installation C++ standard templates on windows platforms may be located under
```
    C:\Users\<username>\AppData\Roaming\StarUML\extensions\user\lnzmst.smgen\templates\cxx\h.mustache
    C:\Users\<username>\AppData\Roaming\StarUML\extensions\user\lnzmst.smgen\templates\cxx\cc.mustache
```

### User Defined Templates

The better approach to create custom templates is by making a copy of the corresponding default ones.
To activated them they have to be selected in the Configuration menu
```
    Tools > State Machine Generator > Configure ...
```

### State Machine Representation

The State Machine representation Mustache will use to drive the template expansion into the actual
code is defined accordingly with the following schema

	{
		smName: <string>,
		smNAME: <string>,
		smPackages: [ <string>, ... ],
		smTriggers: [ <string>, ... ],
		smGuards: [ <string>, ... ],
		smEffects: [ <string>, ... ],
		smStates: [
			{
				stateName: "",
				stateTransitions: [
					triggerName: <string>,
					triggerTargets: [
						{
							transitionGuard: <string>,
							transitionEffects: [ <string>, ... ],
							trasitionTarget: <string>
						},
						...
					]
				],
				state_hasPublic: <function>,
				firstState: <function>,
				firstTrigger: <function>
			},
			...
		]
	}

with keywords or Mustache tags, to be used in templates to drive expansion, described as below

    - smName the name of state machine
	- smNAME Uppercase name of state machine
    - smPackages List, outermost first, of packages the State Machine is defiend in
	- smTriggers The list of triggers to drive the State Machine evolution
	- smGuards The list of Guards that enable a state transition
	- smEffects The list of Effects the State Machine controls
	- smStates The list of States the State Machine is composed by
	    - stateName the actual State name
		- stateTransitions the list of transitions departing from a state
			- triggerName
			- triggerTargets
				- transitionGuard the guard enabling the transition
				- transitionEffects list of opaque behaviour associated with the transition
				- trasitionTarget the target State of the transition
		- state_hasPublic returning true if the state has a public section
		- firstState helper to return the first State name in the list
		- firstTrigger helper to return the first Trigger in the list

#### Example

	{
		smEffects: [ "o_busy", "o_tick", "o_sleep", "o_idle", "o_resume" ],
		smGuards: [ "g_idle" ],
		smNAME: "STATEMACHINE",
		smName: "StateMachine",
		smNameSpaces: [ "sm" ],
		smStates: [
			{
				firstState: function () { ... },
				firstTrigger: function () { ... },
				state_hasPublic: function () { ... },
				stateName: "Idle",
				stateTransitions: [
					{
						triggerName: "e_busy",
						triggerTargets: [
							{
								transitionEffects: [ "o_busy" ],
								transitionTarget: "Busy"
							}
						]
					}
				]
			},
			{
				firstState: function () { ... },
				firstTrigger: function () { ... },
				state_hasPublic: function () { ... },
				stateName: "Busy",
				stateTransitions: [
					{
						triggerName: "e_idle",
						triggerTargets: [
							{
								transitionEffects: [
									transitionTarget: "Idle"
								]
							}
						]
					}
				]
			},
			{...}
		]
		smTriggers: [ "e_busy", "e_tick", "e_idle", "e_resume" ]
	}

## State Machine Architecture

The code is generated in accordance to the well known State Design Pattern. To improve efficiency a singleton is also used to reference State instances.

## Languages

C++ is the only language supported so far.
