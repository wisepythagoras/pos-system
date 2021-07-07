# Point-of-Sale App

This POS app, with its administrative panel, was meant to be a simple to use alternative to all the restrictive paid apps for small shops and neighborhood festivals.

## Building

This app was built with Go 1.16, so make sure you have that installed.

``` sh
git clone https://github.com/wisepythagoras/pos-system && cd pos-system
make current_arch
```

If the build completes without any issues, you should have an executable file in `./bin`:

```
./bin/pos-system
```

Now you can access the POS app via `http://localhost:8088`.

## Runtime Dependencies

The only dependency that this application has is `wkhtmltopdf` (you can find information about it [here](https://wkhtmltopdf.org/)), if you want to be able to print receipts (which you should). The website provides [downloadable](https://wkhtmltopdf.org/downloads.html) packages for many systems. However, if you are using Ubuntu or Debian, you can install it by running the following command:

``` sh
sudo apt install wkhtmltopdf
```

## Deploying

If you wish to deploy the app, you can use a $35 [Raspberry Pi](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/) running [Raspberry Pi OS Lite](https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit) or [Ubuntu Server](https://ubuntu.com/download/raspberry-pi), if you wish to have a 64-bit version.

You can create a dedicated Wi-Fi network and connect the Raspberry Pi directly to the router. After that, you'll have to drop this source directory somewhere (see the [Building] section) and create a `config.yaml` file following the example in `config.example.yaml`. Then direct your tablet(s) to `http://localhost:8088`. That's it!

### Printing

This app was built to use a CUPS server. You can connect your thermal printer to the Raspberry Pi you have this server running on, or to some other machine, and tell the POS app where to find it.

## What's missing

1. [x] Receipt printer support.
2. [ ] Manage products from the admin panel.
3. [ ] Manage users through the admin panel.
