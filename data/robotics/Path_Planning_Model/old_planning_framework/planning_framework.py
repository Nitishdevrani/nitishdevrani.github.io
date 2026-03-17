import numpy as np
import matplotlib.pyplot as plt

def get_neighborhood(cell, occ_map_shape):
  '''
  Arguments:
  cell -- cell coordinates as [y, x]
  occ_map_shape -- shape of the occupancy map (ny, nx)

  Output:
  neighbors -- list of up to eight neighbor coordinate tuples [(y1, x1), (y2, x2), ...]
  '''
  adjacent_cells = []
  row, col = cell
  total_rows, total_cols = occ_map_shape
  neighbor_offsets = [(-1, -1), (-1, 0), (-1, 1),
                      (0, -1),  (0, 1),
                      (1, -1),  (1, 0),  (1, 1)]
  
  for d_row, d_col in neighbor_offsets:
        new_row, new_col = row + d_row, col + d_col
        if 0 <= new_row < total_rows and 0 <= new_col < total_cols:  # Check bounds
            adjacent_cells.append((new_row, new_col))
  
  return adjacent_cells

def get_edge_cost(parent, child, occ_map):
  '''
  Calculate cost for moving from parent to child.

  Arguments:
  parent, child -- cell coordinates as [y, x]
  occ_map -- occupancy probability map

  Output:
  edge_cost -- calculated cost
  '''
  
  movement_penalty = 0
  penalty_factor = 10  # Weight for occupancy penalty
  
  travel_cost = np.sqrt((parent[0] - child[0])**2 + (parent[1] - child[1])**2)
  threshold_for_obstacle = 0.4
  occupancy_probability = occ_map[child[0], child[1]]
  if occupancy_probability >= threshold_for_obstacle:
    return np.inf
  movement_penalty = travel_cost * (1 + penalty_factor * occupancy_probability)

  return movement_penalty

def get_heuristic(cell, goal):
  '''
  Estimate cost for moving from cell to goal based on heuristic.

  Arguments:
  cell, goal -- cell coordinates as [y, x]

  Output:
  cost -- estimated cost
  '''
  
  heuristic_cost = 0
  heuristic_scaling_factor = 2  # Change this to 1, 2, 5, or 10 for experiments
  
  euclidean_distance = np.sqrt((goal[0] - cell[0])**2 + (goal[1] - cell[1])**2)
  heuristic_cost = euclidean_distance * heuristic_scaling_factor

  return heuristic_cost

def plot_map(occ_map, start, goal):
  plt.imshow(occ_map.T, cmap=plt.cm.gray, interpolation='none', origin='upper')
  plt.plot([start[0]], [start[1]], 'ro')
  plt.plot([goal[0]], [goal[1]], 'go')
  plt.axis([0, occ_map.shape[0]-1, 0, occ_map.shape[1]-1])
  plt.xlabel('x')
  plt.ylabel('y')

def plot_expanded(expanded, start, goal):
  if np.array_equal(expanded, start) or np.array_equal(expanded, goal):
    return
  plt.plot([expanded[0]], [expanded[1]], 'yo')
  plt.pause(1e-6)

def plot_path(path, goal):
  if np.array_equal(path, goal):
    return
  plt.plot([path[0]], [path[1]], 'bo')
  plt.pause(1e-6)

def plot_costs(cost):
  plt.figure()
  plt.imshow(cost.T, cmap=plt.cm.gray, interpolation='none', origin='upper')
  plt.axis([0, cost.shape[0]-1, 0, cost.shape[1]-1])
  plt.xlabel('x')
  plt.ylabel('y')

def run_path_planning(occ_map, start, goal):
  '''
  This implements the
  - Dikstra algorithm (in case heuristic is 0)
  - A* algorithm (in case heuristic is not 0)
  '''
 
  plot_map(occ_map, start, goal)

  # cost values for each cell, filled incrementally. 
  # Initialize with infinity
  costs = np.ones(occ_map.shape) * np.inf
  
  # cells that have already been visited
  closed_flags = np.zeros(occ_map.shape)
  
  # store predecessors for each visited cell 
  predecessors = -np.ones(occ_map.shape + (2,), dtype=int)

  # heuristic for A*
  heuristic = np.zeros(occ_map.shape)
  for x in range(occ_map.shape[0]):
    for y in range(occ_map.shape[1]):
      heuristic[x, y] = get_heuristic([x, y], goal)

  # start search
  parent = start
  costs[start[0], start[1]] = 0

  # loop until goal is found
  while not np.array_equal(parent, goal):
    
    # costs of candidate cells for expansion (i.e. not in the closed list)
    open_costs = np.where(closed_flags==1, np.inf, costs) + heuristic

    # find cell with minimum cost in the open list
    x, y = np.unravel_index(open_costs.argmin(), open_costs.shape)
    
    # break loop if minimal costs are infinite (no open cells anymore)
    if open_costs[x, y] == np.inf:
      break
    
    # set as parent and put it in closed list
    parent = np.array([x, y])
    closed_flags[x, y] = 1;
    
    # update costs and predecessor for neighbors
    '''your code here'''
    '''***        ***'''
    neighbors = get_neighborhood(parent, occ_map.shape)
    
    for neighbor in neighbors:
        ny, nx = neighbor
        
        if closed_flags[ny, nx] == 1:
            continue  # Skip already visited cells

        # Compute tentative cost from start
        tentative_cost = costs[parent[0], parent[1]] + get_edge_cost(parent, neighbor, occ_map)

        # If new cost is lower, update cost and predecessor
        if tentative_cost < costs[ny, nx]:
            costs[ny, nx] = tentative_cost
            predecessors[ny, nx] = tuple(parent)



    #visualize grid cells that have been expanded
    plot_expanded(parent, start, goal)
  
  # rewind the path from goal to start (at start predecessor is [-1,-1])
  if np.array_equal(parent, goal):
    path_length = 0
    while predecessors[parent[0], parent[1]][0] >= 0:
      plot_path(parent, goal)
      predecessor = predecessors[parent[0], parent[1]]
      path_length += np.linalg.norm(parent - predecessor)
      parent = predecessor

    print("found goal     : " + str(parent)) 
    print("cells expanded : " + str(np.count_nonzero(closed_flags)))
    print("path cost      : " + str(costs[goal[0], goal[1]]))
    print("path length    : " + str(path_length))
  else:
    print("no valid path found")

  #plot the costs 
  plot_costs(costs)
  plt.waitforbuttonpress()

def main():
  # load the occupancy map
  occ_map = np.loadtxt('map.txt')
  
  # start and goal position [x, y]
  start = np.array([22, 33])
  goal = np.array([40, 15])

  run_path_planning(occ_map, start, goal)

if __name__ == "__main__":
  main()
