.PHONY: sample

iframe:
	loopit -data src/videos.json src/template.html > ./index.html

sample:
	mkdir -p ./sample
	loopit sample/src/template.html > ./sample/index.html

all: iframe sample
