<div align="center">

# 水彩 suisai

A great way to manage your photo library from anywhere

[![GPLv3](https://img.shields.io/badge/license-GPLv3-green)](https://www.gnu.org/licenses/gpl-3.0.en.html#license-text)

</div>


## Setup

Create a `.env` file from `example.env` and tell suisai where your backend server is.

## Running for Production

After setting up the `.env` file, simply

```shell
make install
```

Then copy `nginx.conf` to the correct location depending on your distro

## Running for Development

    bun install
    bun run dev
