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
#include "sm/StateMachine.h"

#include <iostream>


namespace sm {

iInterface::~iInterface()
{}

iPlugIn::~iPlugIn()
{}

iState::~iState()
{}

void iState::e_busy( StateMachine *sm ) {
  (void )sm;
  std::cout << "Unexpected event " << __FUNCTION__ << std::endl;
}

void iState::e_tick( StateMachine *sm ) {
  (void )sm;
  std::cout << "Unexpected event " << __FUNCTION__ << std::endl;
}

void iState::e_idle( StateMachine *sm ) {
  (void )sm;
  std::cout << "Unexpected event " << __FUNCTION__ << std::endl;
}

void iState::e_resume( StateMachine *sm ) {
  (void )sm;
  std::cout << "Unexpected event " << __FUNCTION__ << std::endl;
}

StateMachine::StateMachine( iState *state, iPlugIn *plugin )
  : _state( state )
  , _plugin( plugin )
{}

void StateMachine::e_busy() {
  _state->e_busy( this );
}
void StateMachine::e_tick() {
  _state->e_tick( this );
}
void StateMachine::e_idle() {
  _state->e_idle( this );
}
void StateMachine::e_resume() {
  _state->e_resume( this );
}

void StateMachine::state( iState *s )
{
  _state = s;
}

bool StateMachine::g_idle() {
  // add here your implementation for g_idle()
  return false;
}

void StateMachine::o_busy() {
  if (_plugin)
    _plugin->o_busy( this );
}

void StateMachine::o_tick() {
  if (_plugin)
    _plugin->o_tick( this );
}

void StateMachine::o_sleep() {
  if (_plugin)
    _plugin->o_sleep( this );
}

void StateMachine::o_idle() {
  if (_plugin)
    _plugin->o_idle( this );
}

void StateMachine::o_resume() {
  if (_plugin)
    _plugin->o_resume( this );
}

Idle::Idle()
{}

void Idle::e_busy( StateMachine *sm )
{
  if (true) {
    sm->o_busy();
    sm->state( Singleton<Busy>::instance() );
    return;
  }
}

void Idle::e_tick( StateMachine *sm )
{
  if (sm->g_idle()) {
    sm->o_tick();
    sm->state( Singleton<Idle>::instance() );
    return;
  }
  if (true) {
    sm->o_sleep();
    sm->state( Singleton<Sleeping>::instance() );
    return;
  }
}

Busy::Busy()
{}

void Busy::e_idle( StateMachine *sm )
{
  if (true) {
    sm->o_idle();
    sm->state( Singleton<Idle>::instance() );
    return;
  }
}

Sleeping::Sleeping()
{}

void Sleeping::e_resume( StateMachine *sm )
{
  if (true) {
    sm->o_resume();
    sm->state( Singleton<Busy>::instance() );
    return;
  }
}

} // namespace sm {

#ifdef TEST_SM
class PlugIn: public sm::iPlugIn {
public:
  void o_busy( sm::StateMachine *sm ) override {
    std::cout << __PRETTY_FUNCTION__ << std::endl;
  }
  void o_tick( sm::StateMachine *sm ) override {
    std::cout << __PRETTY_FUNCTION__ << std::endl;
  }
  void o_sleep( sm::StateMachine *sm ) override {
    std::cout << __PRETTY_FUNCTION__ << std::endl;
  }
  void o_idle( sm::StateMachine *sm ) override {
    std::cout << __PRETTY_FUNCTION__ << std::endl;
  }
  void o_resume( sm::StateMachine *sm ) override {
    std::cout << __PRETTY_FUNCTION__ << std::endl;
  }
};

int main( int argc, char **argv )
{
  PlugIn plugin;
  sm::StateMachine sm( Singleton<sm::Idle>::instance(), &plugin );
  sm.e_busy();
  return 0;
}
#endif // #ifdef TEST_SM