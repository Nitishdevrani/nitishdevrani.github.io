# -*- Devrani Nitish Sensor Modal with Explanation -*-

import numpy as np
from scipy.stats import norm
import matplotlib.pyplot as plt

"""
Now we're finding the distance to the closest point where a beam hits any of the circles.
The beam starts from (x, y) and points in the direction of an angle theta (in radians).
The circles array has all the circles as [x_center, y_center, radius] where each represents a circle's center and size.
"""
def distance_to_closest_intersection(x, y, theta, circles):
    """
    First, let's calculate the shortest distance from the robot's position to the closest intersection point
    where the beam hits any of the circles.

    Parameters:
    - x (float): the x position of the robot
    - y (float): the y position of the robot
    - theta (float): the angle of the beam in radians, from the x-axis
    - circles (np.array): array of circles, each circle has [x_center, y_center, radius]

    Returns:
    - float: the distance to the closest intersection, or infinity if there’s no hit
    """
    # Start by setting the closest distance to infinity (no intersection yet)
    closest_dist = float('inf')
    # Calculate the x and y direction components of the beam
    beam_x = np.cos(theta)
    beam_y = np.sin(theta)
    
    # Now we’ll go through each circle and see if the beam hits it
    for circle in circles:
        x_center, y_center, radius = circle
        # Move the circle's center to the origin to make calculations easier
        dx = x - x_center
        dy = y - y_center
        
        # Set up the quadratic equation coefficients
        A = beam_x**2 + beam_y**2
        B = 2 * (dx * beam_x + dy * beam_y)
        C = dx**2 + dy**2 - radius**2
        
        # Now calculate the discriminant to check for intersections
        discriminant = B**2 - 4 * A * C
        
        if discriminant < 0:
            # If the discriminant is less than 0, there’s no intersection for this circle
            continue
        elif discriminant == 0:
            # If the discriminant is 0, there's exactly one intersection point (tangent)
            t = -B / (2 * A)
            if t > 0:
                # Calculate the distance to this intersection and update the closest if it's smaller
                intersection_dist = t * np.sqrt(beam_x**2 + beam_y**2)
                closest_dist = min(closest_dist, intersection_dist)
        else:
            # If the discriminant is positive, there are two intersection points
            sqrt_discriminant = np.sqrt(discriminant)
            t1 = (-B + sqrt_discriminant) / (2 * A)
            t2 = (-B - sqrt_discriminant) / (2 * A)
            
            # Now, we only consider positive t values (those in front of the robot)
            for t in [t1, t2]:
                if t > 0:
                    # Calculate distance for this intersection and update closest if it's the shortest
                    intersection_dist = t * np.sqrt(beam_x**2 + beam_y**2)
                    closest_dist = min(closest_dist, intersection_dist)
    
    # If closest_dist is still infinity, there was no intersection; otherwise, return the closest distance
    return closest_dist if closest_dist != float('inf') else float('inf')


"""
Now let's get the normalization factor for the hit probability.
Here, z_exp is the expected range (in cm), b is the variance, and z_max is the maximum range we can measure (in cm).
"""
def normalizer(z_exp, b, z_max):
    std_dev = np.sqrt(b)
    # Return the normalization value between the bounds
    return 1.0 / (norm(z_exp, std_dev).cdf(z_max) - norm(z_exp, std_dev).cdf(0.0))


"""
Here we calculate the probability of a scan based on the measured and expected values.
z_scan and z_scan_exp are the actual and expected range values in cm.
b is the variance of the measurement noise, and z_max is the maximum range in cm.
"""
def beam_based_model(z_scan, z_scan_exp, b, z_max):
    """
    Let's find the probability of the whole scan by combining each beam's probability.

    Parameters:
    - z_scan (np.array): Array of actual measured distances (in cm)
    - z_scan_exp (np.array): Array of expected distances (in cm) for each beam
    - b (float): Variance of measurement noise
    - z_max (float): Maximum distance that can be measured (in cm)

    Returns:
    - float: Probability of the full scan
    """
    total_prob = 1.0
    for measured, expected in zip(z_scan, z_scan_exp):
        if measured > z_max:
            # If the measured distance is more than z_max, set probability to 1 for this beam
            beam_prob = 1.0
        else:
            # Otherwise, calculate the probability with a Gaussian model
            beam_prob = (1 / np.sqrt(2 * np.pi * b)) * np.exp(- (measured - expected)**2 / (2 * b))
        
        # Multiply the probability for this beam to the total probability
        total_prob *= beam_prob
    
    return total_prob


def main():
    # First, let’s define some circles on the map
    circles = np.array([[3.0, 0.0, 0.5], [4.0, 1.0, 0.8], [5.0, 0.0, 0.5], [0.7, -1.3, 0.5]])
    # Now set the robot's starting position
    pose = np.array([1.0, 0.0, 0.0])
    beam_angles = np.linspace(-np.pi/2, np.pi/2, 21)
    # Load the actual measurements from a file
    z_scan = np.load('z_scan.npy')

    # Now, let's calculate the expected distances using our intersection function
    z_scan_exp = np.zeros(beam_angles.shape)
    for i in range(beam_angles.size):
        z_scan_exp[i] = distance_to_closest_intersection(pose[0], pose[1], beam_angles[i], circles)

    z_max = 10.0
    b = 1.0
    # Calculate the scan probability with the beam-based model, converting meters to cm
    print("The scan probability is:", beam_based_model(z_scan * 100.0, z_scan_exp * 100.0, b, z_max * 100.0))

    ########### Visualization #################################
    plt.axes().set_aspect('equal')
    plt.xlim([-0, 6])
    plt.ylim([-2, 2])
    plt.plot(pose[0], pose[1], "bo")

    fig = plt.gcf()
    axes = fig.gca()
    for i in range(beam_angles.size):
        theta = beam_angles[i]
        x_points = [pose[0], pose[0] + 10 * np.cos(theta)]
        y_points = [pose[1], pose[1] + 10 * np.sin(theta)]
        plt.plot(x_points, y_points, linestyle='dashed', color='red', zorder=0)

    for circle in circles:
        circle_plot = plt.Circle((circle[0], circle[1]), radius=circle[2], color='black', zorder=1)
        axes.add_patch(circle_plot)

    for i in range(beam_angles.size):
        if z_scan_exp[i] > z_max:
            continue
        theta = beam_angles[i]
        hit_x = pose[0] + np.cos(theta) * z_scan_exp[i]
        hit_y = pose[1] + np.sin(theta) * z_scan_exp[i]
        plt.plot(hit_x, hit_y, "ro")

    plt.xlabel("x-position [m]")
    plt.ylabel("y-position [m]")

    plt.show()


if __name__ == "__main__":
    main()
