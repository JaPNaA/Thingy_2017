// This is pretty nice for a first project :D
// JavaScript knowledge came in surprisingly helpful here.

// IMPORTED FROM REPL.IT

class Game {
  boolean[][] D = new boolean[32][32];
  int initAmount = 256,
      generation = 0;
  
  Game(){
    java.util.Random rand = new java.util.Random();
    while(initAmount > 0){
      int a = (int) rand.nextInt(
        this.D.length * this.D[0].length
        ),
        x = a % this.D.length,
        y = a / this.D[0].length;
      if(this.D[y][x]) {
        continue;
      }
      this.D[y][x] = true;
      initAmount--;
    }
  }
  
  public void print(){
    String b = new String();
    
    System.out.println("\n\n\ngeneration " + this.generation);
    
    for(int i = 0; i < this.D.length; i++) {
      for(int j = 0; j < this.D[i].length; j++) {
        b += (this.D[i][j] ? "X" : " ") + " ";
      }
      b += "\n";
    }
    System.out.println(b);
  }
  public void tick(){
    boolean[][] bf = new boolean[this.D.length][this.D[0].length];
    this.generation++;
    
    for(int i = 0; i < this.D.length; i++)
      for(int j = 0; j < this.D[i].length; j++)
        bf[i][j] = this.D[i][j];
    
    for(int y = 0; y < this.D.length; y++)
      for(int x = 0; x < this.D[y].length; x++){
        int nb = this.getNeighbours(bf, y, x);
        if(this.D[y][x]){
          if(nb < 2) {
            this.D[y][x] = false;
          } else if(nb > 3) {
            this.D[y][x] = false;
          }
        }
        if(nb == 3) {
          this.D[y][x] = true;
        }
      }
  }
  public int getNeighbours(boolean[][] ar, int y, int x){
    int a[][] = {
      {-1, -1}, {-1, 0}, {-1, 1},
      {0, -1}, {0, 1},
      {1, -1}, {1, 0}, {1, 1}
    },
    f = 0;
    for(int i = 0; i < a.length; i++){
      if(
        y + a[i][0] < ar.length &&
        y + a[i][0] > 0 &&
        x + a[i][1] < ar[0].length &&
        x + a[i][1] > 0
        ){
          if(ar[y + a[i][0]][x + a[i][1]]){
            f++;
          }
        }
    }
    return f;
  }
}

class Main {
  public static void main(String[] args){
    System.out.println("Mah first Java project:\nConway's 'game of life'\n");
    
    Game a = new Game();
    a.print();
    java.util.Timer timer = new java.util.Timer();
    timer.scheduleAtFixedRate(new java.util.TimerTask() {
      @Override
      public void run(){
        a.tick();
        a.print();
      }
    }, 100, 100);
  }
}
