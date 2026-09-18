INSTALL_DIR ?= /var/www/suisai
SUDO        ?= sudo

all: build

build:
	bun install
	bun run build

install: build
	$(SUDO) mkdir -p $(INSTALL_DIR)
	$(SUDO) rsync -av --delete dist/ $(INSTALL_DIR)/

uninstall:
	$(SUDO) rm -rf $(INSTALL_DIR)

clean:
	rm -rf dist

.PHONY: all build install uninstall clean
