from controller import Robot
import math

MAX_SPEED = 12.3  
WHEELS_DISTANCE = 0.325  
DIAMETER = 0.19  
RADIUS = DIAMETER / 2  


robot = Robot()

timestep = int(robot.getBasicTimeStep())

leftMotor = robot.getDevice('left wheel')
rightMotor = robot.getDevice('right wheel')

leftMotor.setPosition(float('inf'))
rightMotor.setPosition(float('inf'))
leftMotor.setVelocity(0.0)
rightMotor.setVelocity(0.0)

lidar = robot.getDevice('Sick LMS 291')
lidar.enable(60)  
lidar.enablePointCloud()  

def wait(timing):
    current_time = robot.getTime()
    while robot.getTime() - current_time < timing:
        if robot.step(timestep) == -1:
            break
        
def turn(degree = 90):
    angle_rad = math.radians(degree)
    slow_speed = 0.50 * MAX_SPEED

    turning_speed = (2 * slow_speed * RADIUS) / WHEELS_DISTANCE 

    slow_turn_time = abs(angle_rad)/turning_speed
    
    if degree > 0:
        leftMotor.setVelocity(-slow_speed)
        rightMotor.setVelocity(slow_speed)
    elif degree < 0:
        leftMotor.setVelocity(slow_speed)
        rightMotor.setVelocity(-slow_speed)
    else:
        return
    wait(slow_turn_time)
    leftMotor.setVelocity(0)
    rightMotor.setVelocity(0)
                
def move_forward(distance):
    # Ideally I should use 0.42m in below line as lidar is 0.08m ahead of robot center
    # but due to some unknown errors, i need to add some extra value to make it stop at 50cm ahead of wall.
    
    target_distance = distance - 0.47
    curr_speed = 0.50 * MAX_SPEED;
    leftMotor.setVelocity(curr_speed)  
    rightMotor.setVelocity(curr_speed)
    # speed = distance / time
    # time = distance / speed
    req_time = target_distance / curr_speed
    wait(req_time * 10)
    leftMotor.setVelocity(0) 
    rightMotor.setVelocity(0)
    current_distance = lidar.getRangeImage()[len(lidar.getRangeImage()) // 2]
    print(current_distance,req_time, distance)

# Main loop:
while robot.step(timestep) != -1:
    wait(1)
    first_scan = lidar.getRangeImage()
    front_closest = min(first_scan)
    angle_front = first_scan.index(front_closest)
    print(front_closest,first_scan)

    turn(180)
    wait(1)
    last_scan = lidar.getRangeImage()
    back_closest = min(last_scan)
    angle_back = last_scan.index(back_closest)
    
    print(front_closest,back_closest)
    if front_closest <= back_closest:
        closest_point = front_closest
        angle = 180 + (90 - angle_front)
    else:
        closest_point = back_closest
        angle = 90 - angle_back
        
    angle = (angle + 180) % 360 - 180
    print("Turn to:",angle)
    
    turn(angle)
    wait(1)
    move_forward(closest_point)
    
    

    break

# Enter exit cleanup code if needed
