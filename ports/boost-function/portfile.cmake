# Automatically generated by scripts/boost/generate-ports.ps1

vcpkg_from_github(
    OUT_SOURCE_PATH SOURCE_PATH
    REPO boostorg/function
    REF boost-1.79.0
    SHA512 a1f0e4ff828c286e9eb29a8cb8c203248605b9ddc9e81e0797ff62f1513f7debfe3c48fd158383cb2e963a442959e33de5fa7fb641690649ed402e782b411947
    HEAD_REF master
)

include(${CURRENT_INSTALLED_DIR}/share/boost-vcpkg-helpers/boost-modular-headers.cmake)
boost_modular_headers(SOURCE_PATH ${SOURCE_PATH})
