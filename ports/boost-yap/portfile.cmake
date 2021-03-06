# Automatically generated by scripts/boost/generate-ports.ps1

vcpkg_from_github(
    OUT_SOURCE_PATH SOURCE_PATH
    REPO boostorg/yap
    REF boost-1.79.0
    SHA512 df10ca51af90cac70952f94265d09e14b499aa6d2c89977d93d202347bf497758229b98bad51e43b043957d7ae11801a2843aeb6f740f526adddda0a63404d1b
    HEAD_REF master
)

include(${CURRENT_INSTALLED_DIR}/share/boost-vcpkg-helpers/boost-modular-headers.cmake)
boost_modular_headers(SOURCE_PATH ${SOURCE_PATH})
