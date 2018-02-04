# IMPORTED FROM REPL.IT

from random import randint as rdm
from threading import Timer as tmr
from datetime import datetime as dt
import traceback
class Game:
  width = False
  height = False
  mines = False
  state = 1
  tflags = 0
  starttime = dt.now().timestamp()
  lastCom = "0 0"
  doLastCom = False
  tmr = 0
  ret = False
  
  display = []
  minec = 0
  
  def print(self):
    fi = ""
    fi += "info:\nTime elapsed: {} seconds\n  Mines left: {}".format(
    int(dt.now().timestamp() - self.starttime), self.mines - self.tflags
    )
    fi += "\n\n     "
    for i in range(0, self.width):
      fi += str(i)[-1] + " "
    fi += "\n\n"
    for i in self.display:
      fi += str(i[0]["x"])[-1] + "    "
      for j in i:
        if j["visible"]:
          if j["mine"]:
            if j["flag"]:
              fi += "# "
            else:
              fi += "* "
            continue
          else:
            if j["flag"]:
              fi += "O "
            else:
              fi += str(j["minearound"]) + " "
        else:
          if j["flag"]:
            fi += "F "
            continue
          else:
            fi += ". "
            continue
      fi += "\n"
    print(fi)
    return fi
    
  def around(self, x, y):
    st = (
    (-1, -1), ( 0, -1), ( 1, -1),
    (-1,  0),           ( 1,  0),
    (-1,  1), ( 0,  1), ( 1,  1)
    )
    fi = []
    for i in st:
      try:
        if x + i[0] < 0 or y + i[1] < 0:
          raise "ltz"
        fi.append(self.display[x + i[0]][y + i[1]])
      except:
        0
    return fi
    
  def count(self, t, e):
    a = 0
    for i in e:
      if i[t]:
        a += 1
    return a
  
  def visibleall(self, e = False):
    if e:
      for i in e:
        i["visible"] = True
    else:
      for i in self.display:
        for j in i:
          j["visible"] = True
  
  def flag(self, x, y):
    a = self.display[x][y]
    if a["flag"]:
      a["flag"] = False
      self.tflags -= 1
    elif a["visible"]:
      a["flag"] = False
      print("already visible and safe - move canceled")
    else:
      a["flag"] = True
      self.tflags += 1
  
  def poke(self, x, y, r = False):
    if self.ret:
      return
    a = self.display[x][y]
    if a["flag"]:
      r or print("position flagged - move canceled")
    elif a["mine"]:
      a["visible"] = True
      print("Game over! You lost")
      self.state = 0
      self.print()
      self.visibleall()
      self.print()
      print("Game over! You lost")
    else:
      if a["visible"] and a["minearound"] == self.count("flag", self.around(x, y)) and not r:
        for i in self.around(x, y):
          self.poke(i["x"], i["y"], True)
      a["visible"] = True
      if a["minearound"] == 0 and not a["p0"]:
        if self.tmr > 100 and len(traceback.extract_stack()) > 750:
          self.tmr = 0
          self.ret = True
          print("Stopping to prevent stack overflow...")
          return
        self.tmr += 1
        if self.tmr == 250:
          print("This is a large request, this may take some time")
        a["p0"] = True
        for i in self.around(x, y):
          if i["p0"]:
            continue
          self.poke(i["x"], i["y"])
    win = True
    for i in self.display:
      for j in i:
        if not (j["visible"] or j["mine"]):
          win = False
    if win and self.state != 0:
      self.print()
      print("You win-ed!!1!!1 GG")
      self.state = 0
  
  def regCom(self, e):
    self.lastCom = e or self.lastCom;
    args = e.split(" ")
    com = args.pop(0)
    
    if not com:
      self.doLastCom = True
      return
    
    if com[0].lower() == "p":
      try:
        x = int(args[0])
        y = int(args[1])
      except:
        print("Error: arguments 1 or 2 is not a valid integer")
        return
      print(x,y)
      if x < self.width and y < self.height:
        self.poke(y, x)
      else:
        print("Error: arguments 1 or 2 is outside of range")
        return
    elif com[0].lower() == "f":
      try:
        x = int(args[0])
        y = int(args[1])
      except:
        print("Error: arguments 1 or 2 is not a valid integer")
        return
      if x < self.width and y < self.height:
        self.flag(y, x)
      else:
        print("Error: arguments 1 or 2 is outside of range")
        return
    elif com[0].lower() == "v":
      self.visibleall()
    elif com[0].lower() == "q":
      self.state = 0
    else:
      try:
        x = int(com)
        y = int(args[0])
        self.poke(y, x)
      except:
        print("unknown action request")
  
  def start(self):
    print("Welcome to PythonSweeper! It's like minesweeper, but worse! (and also written in python)\nTo open a tile, type 'p {x coord} {y coord}'\nand to flag: 'f {x coord} {y coord}'\nAnd type q to quit\n\nGood luck!")
    self.setup()
    while self.state:
      self.print()
      self.regCom(input(">"))
      self.ret = False
      self.tmr = 0
      if self.doLastCom:
        self.doLastCom = False
        self.regCom(self.lastCom)
    
  def setup(self):
    while not(self.width and self.height and self.mines):
      inp = input("Choose difficulty: Easy, Medium, Hard, or Custom\n").lower()
      if not inp:
        continue
      if inp[0] == "e":
        self.width = 9
        self.height = 9
        self.mines = 10
        break
      elif inp[0] == "m":
        self.width = 16
        self.height = 16
        self.mines = 40
        break
      elif inp[0] == "h":
        self.width = 30
        self.height = 15
        self.mines = 99
        break
      elif inp[0] == "q":
        self.state = 0
        break
      elif inp[0] == "c":
        try:
          self.width = int(input("Width:"))
          self.height = int(input("Height:"))
          a = int(input("Mines:"))
          if(a > self.width * self.height):
            print("Too many mines")
            continue
          else:
            self.mines = a
        except:
          0
    self.starttime = dt.now().timestamp()
    
    self.display.clear()
    for i in range(0, self.height):
      a = []
      for j in range(0, self.width):
        a.append({
          "mine": False,
          "minearound": 0,
          "x": i,
          "y": j,
          "visible": False,
          "flag": False,
          "p0": False,
          "pa": False
        });
      self.display.append(a)
    
    while self.minec < self.mines:
      x = rdm(0, self.height - 1)
      y = rdm(0, self.width - 1)
      if self.display[x][y]["mine"]:
        continue
      self.display[x][y]["mine"] = True
      self.minec += 1
    
    for i in range(0, self.height):
      for j in range(0, self.width):
        self.display[i][j]["minearound"] = self.count(
        "mine", self.around(i, j)
        )

while True:
  Game().start()
  if(input("Play agian? (y/N)").lower() == "y"):
    continue
  else:
    break

