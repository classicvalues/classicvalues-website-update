# Install script for directory: C:/Users/santi/Documents/beast/example/websocket/server

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/Program Files (x86)/Beast")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("C:/Users/santi/Documents/beast/build/example/websocket/server/async/cmake_install.cmake")
  include("C:/Users/santi/Documents/beast/build/example/websocket/server/chat-multi/cmake_install.cmake")
  include("C:/Users/santi/Documents/beast/build/example/websocket/server/coro/cmake_install.cmake")
  include("C:/Users/santi/Documents/beast/build/example/websocket/server/fast/cmake_install.cmake")
  include("C:/Users/santi/Documents/beast/build/example/websocket/server/stackless/cmake_install.cmake")
  include("C:/Users/santi/Documents/beast/build/example/websocket/server/sync/cmake_install.cmake")

endif()

