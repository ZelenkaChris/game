from Tkinter import *

block_size = 40

level = [[0 for y in range(32)] for x in range(18)]   #[y][x] // [row][col]

testLevel = [[0 for y in range(4)] for x in range(4)]
testCond = [[0 for y in range(4)] for x in range(4)]

testLevel[0] = [1, 1, 0, 1]
testLevel[1] = [1, 1, 0, 1]
testLevel[2] = [1, 1, 1, 0]
testLevel[3] = [1, 1, 0, 1]

app = Tk()
app.title("Map Maker")
app.geometry("1280x720")
app.resizable(False, False)

def add_menus(a):
    menubar = Menu(a)
    filemenu = Menu(menubar, tearoff=0)
    filemenu.add_command(label="New", command=None)
    filemenu.add_command(label="Open", command=testSave)
    filemenu.add_command(label="Save as...", command=save)
    filemenu.add_separator()
    filemenu.add_command(label="Exit", command=app.quit)
    menubar.add_cascade(label="File", menu=filemenu)

    a.config(menu=menubar)

def click(e):
    x = e.x/block_size
    y = e.y/block_size
    if level[y][x] != 1:
        level[y][x] = 1
        canvas.create_rectangle(x * block_size, y * block_size, x * block_size + block_size,  y * block_size + block_size, fill="black")

def save():
    for i in range(len(level)):
        print level[i]


def testSave():
    resArr = [[0 for y in range(len(testLevel))] for x in range(len(testLevel[0]))]
    row = [0 for i in range(len(testLevel[0]))]
    retArr = [[0 for y in range(len(testLevel))] for x in range(len(testLevel[0]))]
    
    '''
    for i in range(len(testLevel)):
        for j in range(len(testLevel[i])):
            val = testLevel[i][j]
            if (val != 0):
                row[j] += 1
            else:
                row[j] = 0
        #print row
        count = 0
        minHeight = 999
        for x in range(len(row)):
            if (row[x] >= 1):
                count += 1
                minHeight = minHeight if minHeight < row[x] else row[x]
            else:
                count = 0
                minHeight = 999

            if (count > 0):
                testCond[i][x - count + 1] = [count, minHeight]
        print testCond[i]
    '''

    for i in reversed(range(len(testLevel))):
        for j in reversed(range(len(testLevel[i]))):
            val = testLevel[i][j]
            if (val != 0):
                row[j] += 1
            else:
                row[j] = 0
        resArr[i] = list(row)
    
    for i in range(len(resArr)):
        count = 0
        minHeight = 999
        for j in reversed(range(len(resArr[i]))):
            val = resArr[i][j]
            if (val >= 1):
                count += 1
                minHeight = minHeight if minHeight < val else val
            else :
                count = 0
                minHeight = 999
            retArr[i][j] = [count, minHeight if minHeight != 999 else 0]
            print retArr[i][j],
        print
            
        
        

canvas = Canvas(app)
canvas.bind("<Button-1>", click)
canvas.pack(fill="both", expand=True)

#add_menus(app)

#app.mainloop()

testSave()