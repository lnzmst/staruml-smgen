#
# Copyright (c) 2017 Lorenzo Musto (lnz.mst@gmail.com - https://github.com/lnzmst)
#
# MIT License
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
cmake_minimum_required( VERSION 3.0 FATAL_ERROR )

set( CMAKE_C_COMPILER   "/usr/bin/gcc" CACHE STRING "" FORCE  )
set( CMAKE_CXX_COMPILER "/usr/bin/g++" CACHE STRING "" FORCE  )
set( CMAKE_CXX_FLAGS "-pipe -fmessage-length=0 -std=c++14 -fPIC -Wall -DTEST_SM" CACHE STRING "" FORCE )

set( cxx_mods
	sm/StateMachine.cc
)

add_executable( a.out
	sm/StateMachine.cc
)

target_include_directories( a.out
  PUBLIC
  $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
  )
