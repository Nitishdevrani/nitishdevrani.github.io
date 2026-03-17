# -*- coding: utf-8 -*-

import numpy as np
import math
import matplotlib.pyplot as plt

# Sample from a normal distribution using 12 uniform samples.
def sample_normal_distribution(mu, sigma):
  #return sample from normal distribution with mean = a and standard deviation b
  return mu + (sum(np.random.uniform(-sigma, sigma) for _ in range(12)) / 2)
  # return 0.0 # replace


  """ Sample odometry motion model.
  
  Arguments:
  x -- pose of the robot before moving [x, y, theta]
  u -- odometry reading obtained from the robot [rot1, rot2, trans]
  a -- noise parameters of the motion model [a1, a2, a3, a4]
  
  """
def sample_motion_model(x, u, a):
  # replace with your computation of x_prime, y_prime, and theta_prime
  x_prime = 0.0
  y_prime = 0.0
  theta_prime = 0.0

  delta_rot1, delta_rot2, delta_trans = u
  x_curr, y_curr, theta_curr = x
  a1, a2, a3, a4 = a

  delta_rot1_hat = delta_rot1 + sample_normal_distribution(0, a1 * abs(delta_rot1) + a2 * abs(delta_trans))
  delta_trans_hat = delta_trans + sample_normal_distribution(0, a3 * abs(delta_trans) + a4 * (abs(delta_rot1) + abs(delta_rot2)))
  delta_rot2_hat = delta_rot2 + sample_normal_distribution(0, a1 * abs(delta_rot2) + a2 * abs(delta_trans))

  x_prime = x_curr + delta_trans_hat * math.cos(theta_curr + delta_rot1_hat)
  y_prime = y_curr + delta_trans_hat * math.sin(theta_curr + delta_rot1_hat)
  theta_prime = theta_curr + delta_rot1_hat + delta_rot2_hat

  return np.array([x_prime, y_prime, theta_prime])


""" Evaluate motion model """

def main():
  # start pose
  x = [0.0, 0.0, 0.0]
  # odometry
  u = [[0.0, 0.0, 1.0],
       [0.0, 0.0, 1.0],
       [np.pi/2, 0.0, 1.0],
       [0.0, 0.0, 1.0],
       [0.0, 0.0, 1.0],
       [np.pi/2, 0.0, 1.0],
       [0.0, 0.0, 1.0],
       [0.0, 0.0, 1.0],
       [0.0, 0.0, 1.0],
       [0.0, 0.0, 1.0]]
  # noise parameters
  a = [0.02, 0.02, 0.01, 0.01]

  num_samples = 1000
  x_prime = np.zeros([num_samples, 3])
  # 1000 samples with initial pose
  for i in range(0, num_samples):
      x_prime[i,:] = x

  plt.axes().set_aspect('equal')
  plt.xlim([-5, 5])
  plt.ylim([-3, 7])
  plt.plot(x[0], x[1], "bo")
  
  # incrementally apply motion model
  for i in range(0,10):
      for j in range(0, num_samples):
        x_prime[j,:] = sample_motion_model(x_prime[j,:],u[i],a)        
      plt.plot(x_prime[:,0], x_prime[:,1], "r,")

  
  plt.xlabel("x-position [m]")
  plt.ylabel("y-position [m]")

  plt.show()

if __name__ == "__main__":
  main()


