
NAME = no-fucking-thanks

TARGETS = $(NAME)-firefox.xpi $(NAME)-chrome.zip $(NAME)-chrome.crx

SRC = manifest.json \
      transform.js \
      popup.html \
      icon.png


PARENT = $(shell cd .. ; pwd | xargs cygpath -w)

all: $(TARGETS)

clean:
	rm -f $(TARGETS)

$(NAME)-firefox.xpi: $(SRC)
	sed -i 's/\("manifest_version": \).*/\12,/' manifest.json
	zip -r $@ $^
	sed -i 's/\("manifest_version": \).*/\13,/' manifest.json

$(NAME)-chrome.zip: $(SRC)
	zip -r $@ $^

$(NAME)-chrome.crx: $(SRC)
	"/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" --pack-extension="$(PARENT)\src" --pack-extension-key="$(PARENT)\$(NAME).pem"
	mv "$(PARENT)\src.crx" $@

