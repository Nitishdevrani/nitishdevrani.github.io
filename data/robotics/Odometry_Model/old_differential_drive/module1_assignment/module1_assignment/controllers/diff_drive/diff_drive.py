"""diff_drive controller."""

from controller import Robot
import math

MAX_SPEED = 12.3  
WHEELS_DISTANCE = 0.325  
DIAMETER = 0.195  
RADIUS = DIAMETER / 2  


robot = Robot()

timestep = int(robot.getBasicTimeStep())

leftMotor = robot.getDevice('left wheel')
rightMotor = robot.getDevice('right wheel')

leftMotor.setPosition(float('inf'))
rightMotor.setPosition(float('inf'))


# function to wait for specific time
def wait(timing):
    current_time = robot.getTime()
    while robot.getTime() - current_time < timing:
        if robot.step(timestep) == -1:
            break
            
# function to stop the robot
def stop():
    leftMotor.setVelocity(0)
    rightMotor.setVelocity(0)

#function to rotate the robot in left of right direction                
def turn(degree):
    angle_rad = math.radians(degree)
    slow_speed = 0.10 * MAX_SPEED
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


def move_forward():
    DISTANCE = 4 + 0.1
    local_speed = 0.15 * MAX_SPEED
    time_required = DISTANCE/local_speed * 10

    leftMotor.setVelocity(local_speed)  
    rightMotor.setVelocity(local_speed)
    print('time_required',time_required)
    wait(time_required)
    leftMotor.setVelocity(0)
    rightMotor.setVelocity(0)
     
def calculate_curve_velocities(R, omega):
    v_left = omega * (R - WHEELS_DISTANCE / 2) 
    v_right = omega * (R + WHEELS_DISTANCE / 2) 
    return v_left, v_right
           
def move_in_curve():
    R = 2.0
    v = 0.3 * MAX_SPEED
    
    v_r = v * (R + (WHEELS_DISTANCE / 2)) / R  
    v_l = v * (R - (WHEELS_DISTANCE / 2)) / R 
    print(v_r,v_l)
    leftMotor.setVelocity(v_l)
    rightMotor.setVelocity(v_r)
    
    curve_duration = 17.5
    wait(curve_duration)
    turn(180)
 
 
def three_step_solution():
    print('Comment this function and uncomment 2 step function on line 106 to see 2 step version of this')
    turn(90)
    move_forward()
    turn(-90)
    stop()
    
def two_step_solution():
    move_in_curve()
    stop()


# Main loop:

# Please comment three_step_solution function and uncomment two_step_solution
# to check both the answers

three_step_solution()

# uncomment the below line to see the answer for 2 step function
two_step_solution()