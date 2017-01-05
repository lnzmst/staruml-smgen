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
#ifndef SINGLETON_H
#define SINGLETON_H

/**
 *
 *    <p><b>Examples</b>
 *
  \code{.cpp}
#include <cstdio>

#include "Singleton.h"

class A {
private:
  friend Singleton<A>;

  A() {
    printf("%s\n", __PRETTY_FUNCTION__ );
  }

public:
  void a() {
    printf("%s\n", __PRETTY_FUNCTION__ );
  }
};

int main( int argc, char **argv )
{
  Singleton<A>::instance()->a();

  return 0;
}
  \endcode

  \code{.cpp}
#include <cstdio>

#include "Singleton.h"

class B: public Singleton<B> {
private:
  friend Singleton<B>;

  B() {
    printf("%s\n", __PRETTY_FUNCTION__ );
  }

public:
  void b() {
    printf("%s\n", __PRETTY_FUNCTION__ );
  }
};

int main( int argc, char **argv )
{
  B::instance()->b();

  return 0;
}
  \endcode
 */
template<typename T>
class Singleton {
private:
  static T *_instance;
public:
  static T *instance();
  static void deinstantiate();
  static bool instantiated();
};

#include "Singleton.i"

#endif // #ifndef SINGLETON_H
