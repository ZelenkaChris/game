from Tkinter import *

block_size = 40

level = [[False for x in range(32)] for y in range(18)]   #[y][x] // [row][col]

app = Tk()
app.title("Map Maker")
app.geometry("1280x720")
app.resizable(False, False)

def add_menus(a):
    menubar = Menu(a)
    filemenu = Menu(menubar, tearoff=0)
    filemenu.add_command(label="New", command=None)
    filemenu.add_command(label="Open", command=None)
    filemenu.add_command(label="Save as...", command=save)
    filemenu.add_separator()
    filemenu.add_command(label="Exit", command=app.quit)
    menubar.add_cascade(label="File", menu=filemenu)

    a.config(menu=menubar)

def click(e):
    x = e.x/block_size
    y = e.y/block_size
    if not level[y][x]:
        level[y][x] = True
        canvas.create_rectangle(x * block_size, y * block_size, x * block_size + block_size,  y * block_size + block_size, fill="black")

def save():
    for i in range(len(level)):
        for j in range(len(level[i])):
            if level[i][j]:
                print "1",
            else:
                print "0",
        print
        

canvas = Canvas(app)
canvas.bind("<Button-1>", click)
canvas.pack(fill="both", expand=True)

add_menus(app)

app.mainloop()