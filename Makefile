MAIN=app/...
BINARY_NAME=bin/app.out

build:
	... build -o ${BINARY_NAME} MAIN

run: build
	./${BINARY_NAME}

clean:
	rm ${BINARY_NAME}