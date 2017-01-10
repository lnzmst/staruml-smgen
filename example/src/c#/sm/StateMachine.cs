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
using System;


namespace sm {

abstract class iInterface {
  abstract public void e_busy();
  abstract public void e_tick();
  abstract public void e_idle();
  abstract public void e_resume();
}

abstract class iPlugIn {
  public abstract void o_busy( StateMachine sm );
  public abstract void o_tick( StateMachine sm );
  public abstract void o_sleep( StateMachine sm );
  public abstract void o_idle( StateMachine sm );
  public abstract void o_resume( StateMachine sm );
}

abstract class iState {
  public abstract void e_busy( StateMachine sm );
  public abstract void e_tick( StateMachine sm );
  public abstract void e_idle( StateMachine sm );
  public abstract void e_resume( StateMachine sm );
};

class StateMachine: iInterface {
  private iState _state;
  // private iPlugIn _plugin;

  public StateMachine( iState state/*, iPlugIn plugin*/ ) {
    this._state = state;
    //this._plugin = plugin;
  }

  public override void e_busy() {
    _state.e_busy( this );
  }
  public override void e_tick() {
    _state.e_tick( this );
  }
  public override void e_idle() {
    _state.e_idle( this );
  }
  public override void e_resume() {
    _state.e_resume( this );
  }

  public void state( iState s ) {
    Console.WriteLine( _state.GetType().Name + " -> " + s.GetType().Name );
    _state = s;
  }

  public bool g_idle() {
  }
  public void o_busy() {
  }
  public void o_tick() {
  }
  public void o_sleep() {
  }
  public void o_idle() {
  }
  public void o_resume() {
  }
}

class State: iState {
  public override void e_busy( StateMachine sm ) {
    Console.WriteLine( this.GetType().Name + ": unrecognized e_busy() event" );
  }
  public override void e_tick( StateMachine sm ) {
    Console.WriteLine( this.GetType().Name + ": unrecognized e_tick() event" );
  }
  public override void e_idle( StateMachine sm ) {
    Console.WriteLine( this.GetType().Name + ": unrecognized e_idle() event" );
  }
  public override void e_resume( StateMachine sm ) {
    Console.WriteLine( this.GetType().Name + ": unrecognized e_resume() event" );
  }
};


sealed class Idle: State {

  private static readonly Idle _instance = new Idle();

  // Explicit static constructor to tell C# compiler
  // not to mark type as beforefieldinit
  static Idle() {
  }

  private Idle() {
  }

  public static Idle instance
  {
    get {
      return _instance;
    }
  }

  
  public override void e_busy( StateMachine sm ) {
    if (true) {
      sm.o_busy();
      sm.state( Busy.instance );
      return;
    }
  }
  
  public override void e_tick( StateMachine sm ) {
    if (sm.g_idle()) {
      sm.o_tick();
      sm.state( Idle.instance );
      return;
    }
    if (true) {
      sm.o_sleep();
      sm.state( Sleeping.instance );
      return;
    }
  }
}


sealed class Busy: State {

  private static readonly Busy _instance = new Busy();

  // Explicit static constructor to tell C# compiler
  // not to mark type as beforefieldinit
  static Busy() {
  }

  private Busy() {
  }

  public static Busy instance
  {
    get {
      return _instance;
    }
  }

  
  public override void e_idle( StateMachine sm ) {
    if (true) {
      sm.o_idle();
      sm.state( Idle.instance );
      return;
    }
  }
}


sealed class Sleeping: State {

  private static readonly Sleeping _instance = new Sleeping();

  // Explicit static constructor to tell C# compiler
  // not to mark type as beforefieldinit
  static Sleeping() {
  }

  private Sleeping() {
  }

  public static Sleeping instance
  {
    get {
      return _instance;
    }
  }

  
  public override void e_resume( StateMachine sm ) {
    if (true) {
      sm.o_resume();
      sm.state( Busy.instance );
      return;
    }
  }
}


class MainApp {
    static void Main()
	{
		// Setup context in a state
		StateMachine sm = new StateMachine( Idle.instance );

		// Issue requests, which toggles state
		sm.e_busy();
	}
}

} // namespace sm {
