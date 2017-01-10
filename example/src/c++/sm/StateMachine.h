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
#ifndef sm_StateMachine_h
#define sm_StateMachine_h

#include "base/Singleton.h"

namespace sm {

class StateMachine;

class iInterface {
public:
  virtual ~iInterface();
  virtual void e_busy() = 0;
  virtual void e_tick() = 0;
  virtual void e_idle() = 0;
  virtual void e_resume() = 0;
};

class iPlugIn {
public:
  virtual ~iPlugIn();
  virtual void o_busy( StateMachine *sm ) = 0;
  virtual void o_tick( StateMachine *sm ) = 0;
  virtual void o_sleep( StateMachine *sm ) = 0;
  virtual void o_idle( StateMachine *sm ) = 0;
  virtual void o_resume( StateMachine *sm ) = 0;
};

class iState {
public:
  virtual ~iState();
  virtual void e_busy( StateMachine *sm );
  virtual void e_tick( StateMachine *sm );
  virtual void e_idle( StateMachine *sm );
  virtual void e_resume( StateMachine *sm );
};

class StateMachine: public iInterface {
private:
  iState *_state;
  iPlugIn *_plugin;

public:
  StateMachine( iState *state, iPlugIn *plugin = 0 );

  void e_busy() override;
  void e_tick() override;
  void e_idle() override;
  void e_resume() override;

  void state( iState *s );

  bool g_idle();
  void o_busy();
  void o_tick();
  void o_sleep();
  void o_idle();
  void o_resume();
};

class Idle: public iState {
private:
  friend Singleton<Idle>;
  Idle();

public:
  void e_busy( StateMachine *sm ) override;
  void e_tick( StateMachine *sm ) override;
};

class Busy: public iState {
private:
  friend Singleton<Busy>;
  Busy();

public:
  void e_idle( StateMachine *sm ) override;
};

class Sleeping: public iState {
private:
  friend Singleton<Sleeping>;
  Sleeping();

public:
  void e_resume( StateMachine *sm ) override;
};

} // namespace sm {

#endif // #ifndef sm_StateMachine_h