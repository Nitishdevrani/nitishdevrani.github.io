# -*- coding: utf-8 -*-

import numpy as np
from scipy.stats import norm
import math
import matplotlib.pyplot as plt

"""
returns the distance to the closest intersection between a beam and an array of circles
the beam starts at (x,y) and has the angle theta (rad) to the x-axis
circles is a numpy array with the structure [circle1, circle2,...]
where each element is a numpy array [x_c, y_c, r] describing a circle 
with the center (x_c, y_c) and radius r
"""
def distance_to_closest_intersection(x, y, theta, circles):
    # your implementation goes here
    # converting ray to line
    x_dir = np.cos(theta)
    y_dir = np.sin(theta)
    closest_dist = float('inf')
    for circle in circles:
        x_c = circle[0]
        y_c = circle[1]
        r = circle[2]
        # compute the intersection between line and circle
        # line: (x, y) + t * (x_dir, y_dir)
        # circle: (x - x_c)^2 + (y - y_c)^2 = r^2
        A = x_dir**2 + y_dir**2
        B = 2 * (x_dir * (x - x_c) + y_dir * (y - y_c))
        C = (x - x_c)**2 + (y - y_c)**2 - r**2
        discriminant = B**2 - 4 * A * C
        if discriminant < 0:
            continue  # no intersection
        sqrt_discriminant = math.sqrt(discriminant)
        t1 = (-B + sqrt_discriminant) / (2 * A)
        t2 = (-B - sqrt_discriminant) / (2 * A)
        for t in [t1, t2]:
            if t >= 0:  # only consider intersections in the ray direction
                dist = t * math.sqrt(x_dir**2 + y_dir**2)
                if dist < closest_dist:
                    closest_dist = dist
    return closest_dist


"""
returns the normalizer value in the hit-probability function
z_exp is the expected range (in cm)
b the variance
z_max is the maximum range (in cm) 
"""
def normalizer(z_exp, b, z_max):
    std_dev = np.sqrt(b)
    return 1.0/(norm(z_exp, std_dev).cdf(z_max) - norm(z_exp, std_dev).cdf(0.0))


"""
z_scan and z_scan_exp are numpy arrays containing the measured and expected range values (in cm)
b is the variance parameter of the measurement noise
z_max is the maximum range (in cm)
returns the probability of the scan according to the simplified beam-based model
"""
def beam_based_model(z_scan, z_scan_exp, b, z_max):
    # your implementation goes here
    p = 1.0
    for i in range(len(z_scan)):
        z_meas = z_scan[i]
        z_exp = z_scan_exp[i]
        if z_meas < 0 or z_meas > z_max:
            continue  # ignore invalid measurements
        norm_factor = normalizer(z_exp, b, z_max)
        gaussian_formula = (1.0 / math.sqrt(2 * math.pi * b)) * math.exp(-0.5 * ((z_meas - z_exp) ** 2) / b)
        p *= norm_factor * gaussian_formula
    return p if p > 0 else 0.0


def main():
    # define the circles in the map
    circles = np.array([[3.0, 0.0, 0.5], [4.0, 1.0, 0.8], [5.0, 0.0, 0.5], [0.7, -1.3, 0.5]])
    # robot pose
    pose = np.array([1.0, 0.0, 0.0])
    beam_directions = np.linspace(-np.pi/2, np.pi/2, 21)
    # load measurements
    z_scan = np.load('z_scan.npy')

    # compute the expected ranges using the intersection function
    # if you are not able to make it work, comment out the following three lines and load the values from file
    z_scan_exp = np.zeros(beam_directions.shape)
    for i in range(beam_directions.size):
        z_scan_exp[i] = distance_to_closest_intersection(pose[0], pose[1], beam_directions[i], circles)

    #z_scan_exp = np.load('z_scan_exp.npy')

    z_max = 10.0
    b = 1.0
    # compute the scan probability using the beam-based model
    # *100.0 is conversion from meters to centimeters
    print("the scan probability is ", beam_based_model(z_scan*100.0, z_scan_exp*100.0, b, z_max*100.0))

    ########### visualization #################################
    plt.axes().set_aspect('equal')
    plt.xlim([-0, 6])
    plt.ylim([-2, 2])
    plt.plot(pose[0], pose[1], "bo")

    fig = plt.gcf()
    axes = fig.gca()
    for i in range(beam_directions.size):
        theta = beam_directions[i]
        x_points = [pose[0], pose[0] + 10*np.cos(theta)]
        y_points = [pose[1], pose[1] + 10*np.sin(theta)]
        plt.plot(x_points, y_points, linestyle='dashed', color='red', zorder=0)

    for circle in circles:
        circle_plot = plt.Circle((circle[0], circle[1]), radius=circle[2], color='black', zorder=1)
        axes.add_patch(circle_plot)

    for i in range(beam_directions.size):
        if z_scan_exp[i] > z_max:
            continue
        theta = beam_directions[i]
        hit_x = pose[0] + np.cos(theta) * z_scan_exp[i]
        hit_y = pose[1] + np.sin(theta) * z_scan_exp[i]
        plt.plot(hit_x, hit_y, "ro")
        #meas_x = pose[0] + np.cos(theta) * z_scan[i]
        #meas_y = pose[1] + np.sin(theta) * z_scan[i]
        #plt.plot(meas_x, meas_y, "go")

    plt.xlabel("x-position [m]")
    plt.ylabel("y-position [m]")

    plt.show()


if __name__ == "__main__":
    main()