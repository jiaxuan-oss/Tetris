/**
 * Inside this file you will use the classes and functions from rx.js
 * to add visuals to the svg element in index.html, animate them, and make them interactive.
 *
 * Study and complete the tasks in observable exercises first to get ideas.
 *
 * Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/
 *
 * You will be marked on your functional programming style
 * as well as the functionality that you implement.
 *
 * Document your code!
 */

import "./style.css";

import { fromEvent, interval, merge, range, Observable} from "rxjs";
import { map, filter, scan, take} from "rxjs/operators";

/** Constants */

const Viewport = {
  CANVAS_WIDTH: 200,
  CANVAS_HEIGHT: 400,
  PREVIEW_WIDTH: 160,
  PREVIEW_HEIGHT: 80,
} as const;

const Constants = {
  TICK_RATE_MS: 500,
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
} as const;

const Block = {
  WIDTH: Viewport.CANVAS_WIDTH / Constants.GRID_WIDTH,
  HEIGHT: Viewport.CANVAS_HEIGHT / Constants.GRID_HEIGHT,
};

/** User input */

type Key = "KeyS" | "KeyA" | "KeyD" | "KeyW";

type Event = "keydown" | "keyup" | "keypress";

/** Utility functions */
type Color = ["Red", "Green", "Pink"]

/**
   * create all blocks coordinate
   * @param s block state
   * @returns Array<{x: number, y:number}> 
   */
const createSquare = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 2
  s.blockpos.sizeY = 2
  s.blockpos.color = "green"
  return [{x:s.blockpos.x , y:s.blockpos.y, color: "green"}, {x:s.blockpos.x + Block.WIDTH,
    y: s.blockpos.y + Block.HEIGHT, color: "green"}, {x:s.blockpos.x + Block.WIDTH , y:s.blockpos.y, color: "green"},
    {x:s.blockpos.x ,y:s.blockpos.y + Block.HEIGHT, color: "green"}]
}

const createStraightLine = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 4
  s.blockpos.sizeY = 1
  s.blockpos.color = "red"
  return [{x:s.blockpos.x , y:s.blockpos.y, color: "red"}, {x:s.blockpos.x + Block.WIDTH,
    y: s.blockpos.y, color: "red"}, {x:s.blockpos.x + Block.WIDTH + Block.WIDTH , y:s.blockpos.y, color: "red"},
    {x:s.blockpos.x + Block.WIDTH + Block.WIDTH + Block.WIDTH ,y:s.blockpos.y, color: "red"}]
}

const createStraightLine2 = (s: State): Array<{x:number, y:number, color: string}> => {

  s.blockpos.sizeX = 1
  s.blockpos.sizeY = 4
  s.blockpos.color = "red"
  return [{x: s.blockpos.x, y: s.blockpos.y, color: "red"},
          {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT , color: "red"},
          {x: s.blockpos.x , y: s.blockpos.y + 2*Block.HEIGHT, color: "red"},
          {x: s.blockpos.x , y: s.blockpos.y + 3*Block.HEIGHT, color: "red"}]
}

const createStraightLine3 = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 4
  s.blockpos.sizeY = 1
  s.blockpos.color = "red"
  return [{x:s.blockpos.x , y:s.blockpos.y, color: "red"}, {x:s.blockpos.x + Block.WIDTH,
    y: s.blockpos.y, color: "red"}, {x:s.blockpos.x + Block.WIDTH + Block.WIDTH , y:s.blockpos.y, color: "red"},
    {x:s.blockpos.x + Block.WIDTH + Block.WIDTH + Block.WIDTH ,y:s.blockpos.y, color: "red"}]
}

const createStraightLine4 = (s: State): Array<{x:number, y:number, color: string}> => {

  s.blockpos.sizeX = 1
  s.blockpos.sizeY = 4
  s.blockpos.color = "red"
  return [{x: s.blockpos.x, y: s.blockpos.y,  color: "red"},
          {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: "red"},
          {x: s.blockpos.x , y: s.blockpos.y + 2*Block.HEIGHT, color: "red"},
          {x: s.blockpos.x , y: s.blockpos.y + 3*Block.HEIGHT, color: "red"}]
  }

const createLShape = (s:State) : Array<{x:number, y:number, color: string}> => {
  s.blockpos.sizeX = 3
  s.blockpos.sizeY = 2
  s.blockpos.color = "pink"
  return  [{x: s.blockpos.x, y:s.blockpos.y, color: "pink"}, 
           {x:s.blockpos.x + Block.WIDTH, y: s.blockpos.y , color: "pink"},
           {x: s.blockpos.x + Block.WIDTH + Block.WIDTH, y: s.blockpos.y , color: "pink"}, 
           {x: s.blockpos.x + Block.WIDTH + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT , color: "pink"}]
}

const createLShape2 = (s:State): Array<{x:number, y:number, color: string}>  => {
  s.blockpos.sizeX = 2
  s.blockpos.sizeY = 3
  s.blockpos.color = "pink"
  return [{x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color: "pink"}, 
          {x:s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color:"pink"}
          ,{x: s.blockpos.x, y: s.blockpos.y  + Block.HEIGHT + Block.HEIGHT, color:"pink"}, 
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT + Block.HEIGHT, color:"pink"}]
}

const createLShape3 = (s:State): Array<{x:number, y:number, color: string}>  => {
  s.blockpos.sizeX = 3
  s.blockpos.sizeY = 2
  s.blockpos.color = "pink"
  return [{x: s.blockpos.x, y: s.blockpos.y, color: "pink"}, 
          {x:s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color:"pink"}
          ,{x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y  + Block.HEIGHT, color:"pink"}, 
          {x: s.blockpos.x + Block.WIDTH + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT , color:"pink"}]
}

const createLShape4 = (s:State): Array<{x:number, y:number, color: string}>  => {
s.blockpos.sizeX = 2
s.blockpos.sizeY = 3
s.blockpos.color = "pink"
return [{x: s.blockpos.x, y: s.blockpos.y, color: "pink"}, 
        {x:s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color:"pink"}
        ,{x: s.blockpos.x, y: s.blockpos.y  + Block.HEIGHT, color:"pink"}, 
        {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT + Block.HEIGHT, color:"pink"}]
}

const createZShape = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 3
  s.blockpos.sizeY = 2
  s.blockpos.color = "yellow"
  return [{x: s.blockpos.x, y:s.blockpos.y, color: "yellow"}, 
          {x:s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color: "yellow"},
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "yellow"}, 
          {x: s.blockpos.x + Block.WIDTH + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "yellow"}]
}

const createZShape2 = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 2
  s.blockpos.sizeY = 3
  s.blockpos.color = "yellow"
  return [{x: s.blockpos.x + Block.WIDTH, y:s.blockpos.y, color: "yellow"}, 
          {x:s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: "yellow"},
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "yellow"}, 
          {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT + Block.HEIGHT, color: "yellow"}]
}

const createZShape3 = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 3
  s.blockpos.sizeY = 2
  s.blockpos.color = "yellow"
  return [{x: s.blockpos.x, y:s.blockpos.y, color: "yellow"}, 
          {x:s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color: "yellow"},
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "yellow"}, 
          {x: s.blockpos.x + Block.WIDTH + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "yellow"}]
}

const createZShape4 = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 2
  s.blockpos.sizeY = 3
  s.blockpos.color = "yellow"
  return [{x: s.blockpos.x + Block.WIDTH, y:s.blockpos.y, color: "yellow"}, 
          {x:s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: "yellow"},
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "yellow"}, 
          {x: s.blockpos.x , y: s.blockpos.y + Block.HEIGHT + Block.HEIGHT, color: "yellow"}]
}
const createTShape = (s:State): Array<{x:number, y:number, color: string}> =>{
  s.blockpos.sizeX = 3
  s.blockpos.sizeY = 2
  s.blockpos.color = "purple"
  return [{x: s.blockpos.x, y:s.blockpos.y, color:"purple"}, 
          {x:s.blockpos.x + Block.WIDTH, y: s.blockpos.y , color:"purple"},
          {x: s.blockpos.x + Block.WIDTH + Block.WIDTH, y: s.blockpos.y , color:"purple"}, 
          {x: s.blockpos.x + Block.WIDTH,
           y: s.blockpos.y + Block.HEIGHT, color:"purple"}] 
}

const createTShape2 = (s: State): Array<{x:number, y:number, color: string}> => {
  s.blockpos.sizeX = 2
  s.blockpos.sizeY = 3
  s.blockpos.color = "purple"
  return [{x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color:"purple"}, 
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color:"purple"},
          {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color:"purple"},
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + 2*Block.HEIGHT, color:"purple"}]

}

const createTShape3 = (s: State): Array<{x:number, y:number, color: string}> => {
  s.blockpos.sizeX = 3
  s.blockpos.sizeY = 2
  s.blockpos.color = "purple"
  return [{x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y , color:"purple"}, 
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color:"purple"},
          {x: s.blockpos.x , y: s.blockpos.y + Block.HEIGHT, color:"purple"},
          {x: s.blockpos.x + 2*Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color:"purple"}]

}

const createTShape4 = (s: State): Array<{x:number, y:number, color: string}> => {
  s.blockpos.sizeX = 2
  s.blockpos.sizeY = 3

  return [{x: s.blockpos.x, y: s.blockpos.y, color:"purple"}, 
          {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color:"purple"},
          {x: s.blockpos.x, y: s.blockpos.y + 2*Block.HEIGHT, color:"purple"},
          {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color:"purple"}]
  }

  const createSShape = (s: State) :Array<{x:number, y:number, color: string}>  => {
      s.blockpos.sizeX = 3
      s.blockpos.sizeY = 2
      s.blockpos.color = "blue"
    
      return [{x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color: s.blockpos.color}, 
              {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: s.blockpos.color},
              {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: s.blockpos.color},
              {x: s.blockpos.x + 2*Block.WIDTH, y: s.blockpos.y, color: s.blockpos.color}]
    }
    
    const createSShape2 = (s: State) : Array<{x:number, y:number, color: string}> => {
      s.blockpos.sizeX = 2
      s.blockpos.sizeY = 3
      s.blockpos.color = "blue"
    
      return [{x: s.blockpos.x, y: s.blockpos.y, color: "blue"}, 
              {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: "blue"},
              {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "blue"},
              {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y +Block.HEIGHT +Block.HEIGHT, color: "blue"}]
    }
    
    const createSShape3 = (s: State) : Array<{x:number, y:number, color: string}> => {
      s.blockpos.sizeX = 3
      s.blockpos.sizeY = 2
      s.blockpos.color = "blue"
    
      return [{x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y, color: "blue"}, 
              {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: "blue"},
              {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "blue"},
              {x: s.blockpos.x + Block.WIDTH +Block.WIDTH, y: s.blockpos.y, color: "blue"}]
    }
    
    const createSShape4 = (s: State) : Array<{x:number, y:number, color: string}> => {
      s.blockpos.sizeX = 2
      s.blockpos.sizeY = 3
      s.blockpos.color = "blue"
    
      return [{x: s.blockpos.x, y: s.blockpos.y, color: "blue"}, 
              {x: s.blockpos.x, y: s.blockpos.y + Block.HEIGHT, color: "blue"},
              {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT, color: "blue"},
              {x: s.blockpos.x + Block.WIDTH, y: s.blockpos.y + Block.HEIGHT +Block.HEIGHT, color: "blue"}]
    }

/**
 * put all shape into a list for rotation and identify shapes when render
 */
const blockFunctionList: Array<Function> = [createLShape,createSquare,createStraightLine,createTShape,createZShape,createSShape]
const rotationLShape: Array<Function>  = [createLShape, createLShape2, createLShape3, createLShape4]
const rotationZShape : Array<Function> = [createZShape, createZShape2, createZShape3, createZShape4]
const rotationTShape : Array<Function> = [createTShape, createTShape2, createTShape3, createTShape4]
const rotationIShape : Array<Function> = [createStraightLine, createStraightLine2, createStraightLine3, createStraightLine4]
const rotationSShape : Array<Function> = [createSShape,createSShape2,createSShape3,createSShape4]
/** State processing */

type State = Readonly<{
  gameEnd: boolean;
  collidedBlocks: CollidedBlock
  blockpos: Block 
}>;

type Block = {
  x: number
  y: number
  sizeX: number
  sizeY: number  
  gameContinue: boolean
  twoDArray: Array<Array<boolean>>
  shape: Function
  seed: number
  color: string
  rotation: number
  nextPreview: Function
}

type CollidedBlock = {
  collidedBlock: Array<{x:number,y:number, color:string}>
}

type GameState = {
  currentScore: number
  currentLevel: number
  currentHighScore: number
}

const initialState: State = {
  gameEnd: false,
  collidedBlocks: {collidedBlock:[]},
  blockpos: 
  { x:80, 
    y:0 , 
    sizeX: 2, 
    sizeY: 2,
    gameContinue: true,
    twoDArray: Array.from({ length: Constants.GRID_HEIGHT }, () =>
    Array.from({ length: Constants.GRID_WIDTH }, () => false)),
    shape: createSquare,
    seed: 1000,
    color: "green",
    rotation: 0,
    nextPreview: function(){}
}
}

const gameState: GameState = {
  currentScore: 0,
  currentLevel: 1,
  currentHighScore: 0
}

abstract class RNG {
  // LCG using GCC's constants
  private static m = 0x80000000; // 2**31
  private static a = 1103515245;
  private static c = 12345;

  
  /** From FIT2102 Applied Tute 4
   * Call `hash` repeatedly to generate the sequence of hashes.
   * @param seed 
   * @returns a hash of the seed
   */
  public static hash = (seed: number) => (RNG.a * seed + RNG.c) % RNG.m;

  /**
    * Takes hash value and scales it to the range [1, 6]
   */
  public static scale = (hash: number) => (6 * hash) / (RNG.m ) + 1;
 
}

/** From FIT2102 Applied Tute 4
 * To generate random numbers
 * @param source$ observable for generate a stream of random number
 * @returns 
 */
export function createRngStreamFromSource<T>(source$: Observable<T>) {
  return function createRngStream(
    seed: number = 0
  ): Observable<number> {
    
    const randomNumberStream = source$.pipe(
      scan((acc,n)=> RNG.hash(acc), RNG.hash(seed)),
      map(n=> RNG.scale(RNG.hash(n)))
    );

    return randomNumberStream;
  };
}

const rngStream = createRngStreamFromSource(interval(50));   

/**
 * Generate random Nuber and take the first from the stream
 * @param s: block state
 * @param blockList: list of all shape
 * @param seed: a number for generating random number
 */
const randomNumber = (s:State) => (blockList: Array<Function>) =>(seed: number): Function =>{
  rngStream(seed).pipe(take(1)).subscribe((randomNumber)=> s.blockpos.nextPreview = blockList[Math.floor(randomNumber) - 1])
  return s.blockpos.nextPreview //take the first random number from the stream -> prevent changing when moving 
}

/**
 * Check function is empty
 * @param f function to check
 * @returns boolean expression saying the function is empty or no
 */
function isFunctionEmpty(f :Function): boolean {
  const functionString = f.toString();
  // Remove whitespace and check if the remaining string is empty
  const filteredString = functionString.replace(/\s+/g, '');
  return filteredString === 'function(){}' || filteredString === 'function (){}'; //check these 2 conditions
}

/**
 * Reset the current coordinate block and next block preview
 * @param s Block state
 */
function reset (s:State) {
  s.blockpos.x = 80
  s.blockpos.y = 0
  s.blockpos.nextPreview = function(){}
}
  
/** 
 * Check block in viewport 
 * 
 * @param x x axis
 * @param y y axis
 * @param sizeX size of square 
 */
const incanvas = (x: number)=>(y: number)=>(sizeX: number)=>(sizeY: number): boolean => 
    x + (Block.WIDTH * sizeX) <= Viewport.CANVAS_WIDTH  && 
    x >= 0 && //check in square? if yes then return true else false
    y + (Block.HEIGHT *sizeY) <= Viewport.CANVAS_HEIGHT 


  /**
  * Convert coordinate To Grid and save it as a list
  * @param x: x axis amount
  * @param y: x axis amount
  * @param blockWidth: width of block
  * 
  * @returns array with row and col index for each block
  */
  const coordinateToGrid = (x: number)=>(y: number)=>(blockWidth: number)=>(blockHeight: number): {row: number, col: number} =>{
    const b1x1 = Math.floor(x / blockWidth),
          b1y1 = Math.floor(y / blockHeight)
        return {row:b1y1, col:b1x1}
  }

  /**
  * Convert grid to coordinate 
  * @param row: row of that grid
  * @param y: y amount
  * @param blockWidth: block width
  * 
  * @returns array with row and col index for each block
  */
  const gridToCoordinate = (row: number) => (blockWidth: number): number=>{
    const selectedRow = Math.floor(row * blockWidth)
    return selectedRow
  }

  /**
   * Set all the coordinate to 2d array
   *
   * @param s block state
   */
  const updateGrid = (s: State) => {
    s.collidedBlocks.collidedBlock.forEach(n => {
      const positions = [coordinateToGrid(n.x)(n.y)(Block.WIDTH)(Block.HEIGHT)]
      //update array values 
      positions.forEach(
        (pos) => (s.blockpos.twoDArray[pos.row][pos.col] = true) 
      
      )
    }
    )
  }
  
  /**
   * Check collision between blocks 
   * @param s Block state
   * @returns boolean representing game continue/ no
   */
  const checkCollide = (s:State) =>(twoDArray: Array<Array<boolean>>)=> (createFunction: Function)=>(collisionTop: boolean = false): boolean =>{
    // const tempTwoDArray = setTwoDArray(s)(twoDArray)
    //create all coordinate as s only pass one coordinate
    //generate moving block grid
    const shape = createFunction(s)
    const grid = shape.map((n:{x: number, y:number}) => coordinateToGrid(n.x)(n.y)(Block.WIDTH)(Block.HEIGHT))
                  
    updateGrid(s) //put all existing block to the 2d Array except the moving one
    const collideResults = grid.forEach((n:{row: number, col:number})=>
      { 
        if (s.blockpos.y + Block.HEIGHT * s.blockpos.sizeY < Viewport.CANVAS_HEIGHT && twoDArray[n.row + 1][n.col] && s.blockpos.y != 0){ //to avoid two collision block at the start
        if(s.blockpos.gameContinue){
          addToCollideList(s) //add to collide list when there is collision
        }
       
        if (s.blockpos.y <= Block.HEIGHT){ //stop when y less/equal than width and collides
          collisionTop = true //indicate it reach top and end game
        }
        //check the function is empty is to prevent errors -> empty list entering the loops and create errors
        isFunctionEmpty(s.blockpos.nextPreview)? s.blockpos.nextPreview : s.blockpos.shape = s.blockpos.nextPreview //if collide then generate the next preview block on top
        reset(s) //reset coordinate and nextpreview function
      }
    })
    return collisionTop   
  }



  /**
   * prevent from intesecting the blocks from side 
   * @param s block state
   * @returns acc indicating blocks not allow to move left when there is a left block
   */
  const sideCollision = (s:State)=>(amount: number) => (createShape: Function): boolean=> {
    //convert coordinate to grid for moving square
    
    const grid = createShape(s).map((n: {x: number,y: number}, index: number)=> 
    coordinateToGrid(n.x)(n.y)(Block.WIDTH)(Block.HEIGHT))  

    return grid.reduce((acc: boolean, index:{row: number,col: number}) => {
    if (amount < 0){ //this check-> allow blocks move right although there is a left side collision
    if ((s.blockpos.x >= Block.WIDTH && s.blockpos.x < Viewport.CANVAS_WIDTH - Block.WIDTH * s.blockpos.sizeX) &&  
        s.blockpos.twoDArray[index.row][index.col - 1]){
      acc = false
    }
    }
    else{
      if ((s.blockpos.x < Viewport.CANVAS_WIDTH - Block.WIDTH * s.blockpos.sizeX) && 
          s.blockpos.twoDArray[index.row][index.col + 1] ){
        acc = false
      }
    }
    return acc;
    }
    ,true
    )
  }
  
  

/** Rendering (side effects) */

/**
 * Displays a SVG element on the canvas. Brings to foreground.
 * @param elem SVG element to display
 */
const show = (elem: SVGGraphicsElement) => {
  elem.setAttribute("visibility", "visible");
  elem.parentNode!.appendChild(elem);
};

/**
 * Hides a SVG element on the canvas.
 * @param elem SVG element to hide
 */
const hide = (elem: SVGGraphicsElement) =>
  elem.setAttribute("visibility", "hidden");

/**
 * Creates an SVG element with the given properties.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/SVG/Element for valid
 * element names and properties.
 *
 * @param namespace Namespace of the SVG element
 * @param name SVGElement name
 * @param props Properties to set on the SVG element
 * @returns SVG element
 */
const createSvgElement = (
  namespace: string | null,
  name: string,
  props: Record<string, string> = {}
) => {
  const elem = document.createElementNS(namespace, name) as SVGElement;
  Object.entries(props).forEach(([k, v]) => elem.setAttribute(k, v));
  
  return elem;
};

/**
 * keep track of collided blocks when there is a collision
 * @param s block state
 * @returns s, s representing block state
 */
const addToCollideList = (s:State): State =>{
  const bottomBlocks = s.blockpos.shape(s)
        const collideList = s.collidedBlocks.collidedBlock
        s.collidedBlocks.collidedBlock = collideList.concat(bottomBlocks)
  return s
}

/**
 * This is the function called on page load. Your main game loop
 * should be called here.
 */
export function main() {
  // Canvas elements
  const svg = document.querySelector("#svgCanvas") as SVGGraphicsElement &
    HTMLElement;
  const preview = document.querySelector("#svgPreview") as SVGGraphicsElement &
    HTMLElement;
  const gameover = document.querySelector(" #gameOver") as SVGGraphicsElement &
    HTMLElement;
  const container = document.querySelector("#main") as HTMLElement;

  svg.setAttribute("height", `${Viewport.CANVAS_HEIGHT}`);
  svg.setAttribute("width", `${Viewport.CANVAS_WIDTH}`);
  preview.setAttribute("height", `${Viewport.PREVIEW_HEIGHT}`);
  preview.setAttribute("width", `${Viewport.PREVIEW_WIDTH}`);

  // Text fields
  const levelText = document.querySelector("#levelText") as HTMLElement;
  const scoreText = document.querySelector("#scoreText") as HTMLElement;
  const highScoreText = document.querySelector("#highScoreText") as HTMLElement;

  const updateGameInfo = (gameState: GameState) =>{
    scoreText.textContent = `${gameState.currentScore}`;
    levelText.textContent = `${gameState.currentLevel}`;
    highScoreText.textContent = `${gameState.currentHighScore}`;

  }

  /**
   * Check score and update score when there is a line of blocks
   * @param s block state
   * @param gameState contains all the scores and level
   * @returns 
   */
  const checkScore = (s: State) => (gameState: GameState) => {
    updateGameInfo(gameState)
    s.blockpos.twoDArray.forEach((n, index) => {
      const isAllTrue = n.every(element => element)
      const coordinate = gridToCoordinate(index)(Block.HEIGHT)
      
      if (isAllTrue) { // If there is a full row
        const newArray = Array.from({ length: Constants.GRID_WIDTH }, () => false) //a new array
        
        // Remove the row from s.blockpos.twoDArray using filter
        s.blockpos.twoDArray = s.blockpos.twoDArray.filter((_, i) => i !== index)
        
        // Add a new empty row at the beginning
        s.blockpos.twoDArray.unshift(newArray)
        
        gameState.currentScore += 500
        
        if (gameState.currentScore > gameState.currentLevel * 500) {
          gameState.currentLevel += 1
        }
        
        gameState.currentHighScore < gameState.currentScore? gameState.currentHighScore = gameState.currentScore : gameState.currentScore //change this later
        updateGameInfo(gameState)
        
        // Remove matching rows from s.collidedBlocks.collidedBlock
        s.collidedBlocks.collidedBlock = s.collidedBlocks.collidedBlock.filter((block) => block.y !== coordinate)
        s.collidedBlocks.collidedBlock = s.collidedBlocks.collidedBlock.map((block) => {
          if(block.y < coordinate){ //if the block is above coordinate then let it drop by minus block height
            return { ...block, y:block.y + Block.HEIGHT  };
          }
          return { ...block};//if no then remain 
        })
      
        svg.innerHTML = "" // set to empty string to refresh the blocks 
      }                    //remove the deleted blocks from svg
    });
  }
  
  /** User input */

  const key$ = fromEvent<KeyboardEvent>(document, "keypress");

  const fromKey = (keyCode: Key, axis: string, amount: number = 0) =>
    key$.pipe(filter(({ code }) => code === keyCode),
              map(()=> ({axis, amount})));

  const left$ = fromKey("KeyA", "x", -Block.WIDTH);
  const right$ = fromKey("KeyD", "x", Block.WIDTH);
  const down$ = fromKey("KeyS", "y", Block.HEIGHT);
  const up$ = fromKey("KeyW", "w", Block.HEIGHT)

 
  /** Determines the rate of time steps */
  const tick$ = interval(Constants.TICK_RATE_MS/gameState.currentLevel);//higher level higher dropping speed
  initialState.blockpos.shape = createSquare

  
  /** Observables */
  
  merge(left$,right$,down$,up$).pipe(
    
    scan((acc, prop) => {
      acc.blockpos.seed += 100000000 //to generate a random huge seed for the blocks-> each move sum to the seed

      //is the function empty? if is it then create a random function block for it
      isFunctionEmpty(acc.blockpos.nextPreview)? randomNumber(acc)(blockFunctionList)(acc.blockpos.seed) : void(0) 
      updateGrid(acc) //update the coordinate to 2d array everytime keypress
      const x = acc.blockpos.x + (prop.axis === "x"? prop.amount : 0)//check keypress and update amount
      const y = acc.blockpos.y + (prop.axis === "y"? prop.amount : 0)
      const w =  prop.axis === "w"? true: false
      
      if(w){//if "w" is press then rotate the block accordingly
        acc.blockpos.rotation += 1 // += 1 to the rotation -> rotate 90 once
        const index = acc.blockpos.rotation % rotationLShape.length //mod it so it stays within the length
        acc.blockpos.rotation = index //index for access
        
        switch(acc.blockpos.shape){
            case createLShape: //for Lshape 
            case createLShape2:
            case createLShape3:
            case createLShape4:
              acc.blockpos.shape = rotationLShape[acc.blockpos.rotation];
              break;
            case createZShape://for Z shape
            case createZShape2:
            case createZShape3:
            case createZShape4:
              acc.blockpos.shape = rotationZShape[acc.blockpos.rotation];
              break;
            
            case createTShape: //for T shape
            case createTShape2:
            case createTShape3:
            case createTShape4:
              acc.blockpos.shape = rotationTShape[acc.blockpos.rotation]
              break;

            case createStraightLine:
            case createStraightLine2:// for Straight line
            case createStraightLine3:
            case createStraightLine4:
              acc.blockpos.shape =rotationIShape[acc.blockpos.rotation]
              break;

            case createSShape:
            case createSShape2://for S shape
            case createSShape3:
            case createSShape4:
              acc.blockpos.shape = rotationSShape[acc.blockpos.rotation]
              break;
        }
      }

      const inCanvasCheck = incanvas(x)(y)(acc.blockpos.sizeX)(acc.blockpos.sizeY) //check in canvas
      const bottomCheck = acc.blockpos.y + (Block.HEIGHT * acc.blockpos.sizeY) >= Viewport.CANVAS_HEIGHT //check bottom

      if (bottomCheck){ //if at bottom
        addToCollideList(acc) //add the bottom block to the list for render and keep track
        acc.blockpos.shape = acc.blockpos.nextPreview //assign next preview to current
        reset(acc)
        
      }
      else{
        //x put sidecollision -> y can move when there is a block beside 
        acc.blockpos.x = inCanvasCheck && sideCollision(initialState)(prop.amount)(acc.blockpos.shape) && acc.blockpos.gameContinue? x : acc.blockpos.x,
        acc.blockpos.y = inCanvasCheck && acc.blockpos.gameContinue? y : acc.blockpos.y
        
        if(checkCollide(acc)(acc.blockpos.twoDArray)(acc.blockpos.shape)(false)){
          acc.blockpos.gameContinue = false//stop the render and gameplay
          const bottomBlocks = acc.blockpos.shape(acc) //add blocks to collideblocks list when reach the top
          const collideList = acc.collidedBlocks.collidedBlock
          acc.collidedBlocks.collidedBlock = collideList.concat(bottomBlocks) //add x and y coordinate to list when it reaches top 
        }
        
      }
      return acc
      
      }
    , initialState)
    )
  .subscribe((state) => {

    updateGrid(state) //update to 2d array
    checkScore(state)(gameState) //check is there any forms a line  
    render(state)(state.blockpos.x)(state.blockpos.y)(false)//render the blocks
    previewRender(state) //render next preview block
    
    
  }); 
  
    
  /**
   * Renders the current state to the canvas.
   *
   * In MVC terms, this updates the View using the Model.
   *
   * @param s Current states
   */
  const render = (s: State)=> (x: number)=> (y: number) => (check: boolean) =>{
   
    // Add blocks to the main grid canvas
    check = s.blockpos.gameContinue//continue to render if the game continue 
    if (s.blockpos.shape == createStraightLine){
      // y is 0 -> this is to prevent it stops at second row instead of first row for straight line shape
      check = s.blockpos.gameContinue || s.blockpos.y == 0
    }
    if(check){ //continue to render if the game continue or
      renderShape(s)(x)(y)(s.blockpos.shape)          

    // create collided blocks 
    s.collidedBlocks.collidedBlock.forEach((n)=> {
      const collideBlocks = createSvgElement(svg.namespaceURI, "rect", {
      height: `${Block.HEIGHT}`,
      width: `${Block.WIDTH}`,
      x: `${n.x}`,
      y: `${n.y}`,
      style: `fill: ${n.color}`,
    })
    svg.appendChild(collideBlocks)
    })
    } 
  }

  /**
   * Render shape according to state's shape
   * @param s block state
   * @param x x axis amount
   * @param y y axis amount
   * @param createFunction function for creating a shape
   * 
   */
  const renderShape = (s:State) => (x:number) => (y:number) => (createFunction: Function) =>{
    const renderfunction = createFunction(s) //returns all the coordinate of that block

    //loop through the coordinates
    renderfunction.forEach((shape:{x: number,y: number, color: string},index: number)=> {
      
      const cube = createSvgElement(svg.namespaceURI, "rect", { //every coordinate has their own index and block
      height: `${Block.HEIGHT}`,
      width: `${Block.WIDTH}`,
      x: `${shape.x}`,
      y: `${shape.y}`,
      style: `fill: ${"white"}`,
      id: `${index}`
    })
    const elem = document.getElementById(`${index}`) //get it by index 
    if(elem){                                        //to set the x and y value
    elem?.setAttribute("x", `${shape.x}`)
    elem?.setAttribute("y", `${shape.y}`)
    }
    else{
      svg.appendChild(cube); //if there wasnt an elem of that id then append that cubee to svg
    }
  })
}


/**
 * render the next block onto the preview canvas
 * @param s block state
 */
    const previewRender = (s:State) =>{
      preview.innerHTML = "" //clear the preview and ready for the next block
      //from chatGPT
      const previewState: State = JSON.parse(JSON.stringify(s)); //deep copy to prevent modifying s 
      previewState.blockpos.x = 60 //middle of preview canvas
      previewState.blockpos.y = 25

      if (!isFunctionEmpty(s.blockpos.nextPreview)){ //check, if is empty then dont render
      const coordinates= s.blockpos.nextPreview(previewState) //get coordinates that need to be render in the preview
      coordinates.forEach((n:{x:number,y:number,color: string},index: number)=>{
        const previewCubes = createSvgElement(preview.namespaceURI, "rect", {//create shapes for the preview
          height: `${Block.HEIGHT}`,
          width: `${Block.WIDTH}`,
          x: `${n.x}`,
          y: `${n.y}`,
          style: `fill: ${n.color}`,
          id: `${index}`
        })
        preview.appendChild(previewCubes);
      })
    }
    }
    

  /**
   * let the current moving block drop automatically and check 
   * collisions 
   */    
  const source$ = merge(tick$)
    .pipe(scan((s: State) => {
      const updatedPosY = s.blockpos.y + Block.HEIGHT
      //check next preview empty? then add a random shape
      isFunctionEmpty(s.blockpos.nextPreview)? randomNumber(s)(blockFunctionList)(s.blockpos.seed) : void(0) 
      if(updatedPosY + (Block.HEIGHT * s.blockpos.sizeY) <= Viewport.CANVAS_HEIGHT 
      && s.blockpos.gameContinue){   //if updatedPosY within canvas height and game still continue then 
        checkScore(s)(gameState)
        return UpdateState(s)(updatedPosY)  //update y return state s
      }
      else if(!s.blockpos.gameContinue){
             return {...s, gameEnd:true}      //if game stop then return with gameEnd: true to show gameover and restart
      }
      return s
                               
    }, initialState))
    .subscribe((s: State) => {
      updateGrid(s) //update 2D array every single drop down
      render(s)(s.blockpos.x)(s.blockpos.y)(false); //render blockpos
      previewRender(s) //to let the preview pops out automatically
      
      if (s.gameEnd) {
        svg.appendChild(gameover) //append gameover as score check will clear the svg once it clear a line of blocks
        show(gameover);//show gameover word
        document.addEventListener('keydown', function(event) { //press r to restart
          if (event.key === "r") {                //add event listener call the restart function by pressing r
            restart(s)(gameState);                //set everything to initial state
          }
        });
      } 
       else {
        hide(gameover); //if game is not end then hide gameover
      }
    });
  
    /**
     * Update y value and the collide blocks 
     * @param s block state
     * @returns s state with gameEnd: false
     */
  const UpdateState = (s:State)=>(updatedPosY: number): State=> {
    s.blockpos.y = updatedPosY //drop the block automatically
    const bottomCheck = s.blockpos.y + (Block.HEIGHT * s.blockpos.sizeY) >= Viewport.CANVAS_HEIGHT //check bottom
    if (bottomCheck){
        addToCollideList(s) 
        //check next preview is empty, if yes then return if it has a function then assign to shape 
        //this is to prevent errors like throwing empty list to loops like reduce, map and foreach
        isFunctionEmpty(s.blockpos.nextPreview)? s.blockpos.nextPreview : s.blockpos.shape = s.blockpos.nextPreview
        reset(s)
      }
    
      //if the block touches the top then it stops
    if(checkCollide(s)(s.blockpos.twoDArray)(s.blockpos.shape)(false)){
      s.blockpos.gameContinue = false //gamecont = false -> stop
      // addToCollideList(s)// 
    }
  
    return {...s, gameEnd:false} //return s with gameend false
  }

  /**
   * Restart everything to initial state
   * @param s block state
   * @param gameState contain level, highscore and score
   * 
   */
  const restart = (s:State)=> (gameState: GameState) =>{
    reset(s)
    gameState.currentLevel = 1
    gameState.currentScore = 0
    s.collidedBlocks.collidedBlock = []
    s.blockpos.sizeX = 2
    s.blockpos.sizeY = 2
    s.blockpos.gameContinue = true
    s.blockpos.twoDArray = Array.from({ length: Constants.GRID_HEIGHT }, () =>
    Array.from({ length: Constants.GRID_WIDTH }, () => false))
    s.blockpos.nextPreview = createSquare
    svg.innerHTML = ""
    preview.innerHTML =  "" //clear all the cubes in preview and svg
  }

};

  // const setTwoDArray = (s:State)=>(twoDArray: Array<Array<boolean>>): Array<Array<boolean>>=>{
  //   const tempTwoDArray = twoDArray
  //   s.collidedBlocks.collidedBlock.forEach(n=> 
  //     {
  //       const {row, column} = coordinateToGrid(n.x)(n.y)(Block.WIDTH)(Block.HEIGHT)
  //       tempTwoDArray[row][column] = true
  //     })
  //   return tempTwoDArray
  // }

// }
// The following simply runs your main function on window load.  Make sure to leave it in place.
if (typeof window !== "undefined") {
  window.onload = () => {
    main();
  };
  }

