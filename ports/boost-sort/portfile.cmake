# Automatically generated by scripts/boost/generate-ports.ps1

vcpkg_from_github(
    OUT_SOURCE_PATH SOURCE_PATH
    REPO boostorg/sort
    REF boost-1.79.0
    SHA512 779f1e7d78baa1147af8cdbcd5aa38576c8977ce5e17ea69b38028c6ed3366812875bcea7702e3efa3c6b55c941a4993ae68ec576a0775a61da0a101356632ef
    HEAD_REF master
)

include(${CURRENT_INSTALLED_DIR}/share/boost-vcpkg-helpers/boost-modular-headers.cmake)
boost_modular_headers(SOURCE_PATH ${SOURCE_PATH})
