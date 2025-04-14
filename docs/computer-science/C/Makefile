CC = D:\\Program Files\\mingw64\\bin\\gcc.exe
CFLAGS = -fdiagnostics-color=always -g
SOURCES = $(shell find . -name "*.c")
EXECUTABLE = index.exe

all: $(EXECUTABLE)

$(EXECUTABLE): $(SOURCES)
	$(CC) $(CFLAGS) $(SOURCES) -o $(EXECUTABLE)

clean:
	rm -f $(EXECUTABLE)
