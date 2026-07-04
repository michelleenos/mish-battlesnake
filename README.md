# lil snek friend!

a nodejs/typescript [battlesnake](https://battlesnake.com/) created for a [local philly event](https://luma.com/q7gs3hsj?tk=KMzfj7)

**includes**:

- a few different snek configs with different behaviors including:
    - seeking out food
    - sometimes chasing its own tail
    - sometimes attacking weaker snake heads
    - avoiding walls, potentially
- pathfinding using A\* algorithm (mostly ported from [redblobgames' python version](https://www.redblobgames.com/pathfinding/a-star/implementation.html#python-astar) minus an actual priority queue because i was lazy)
- flood fill for avoiding enclosed spaces

**does not include**:

- priority queue for A\*
- as much optimization / avoidance of reduncancies as it could
