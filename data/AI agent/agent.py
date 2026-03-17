from openai import OpenAI
from typing import Dict, Any, Tuple, Optional
import numpy as np
from minigrid.core.constants import IDX_TO_OBJECT, IDX_TO_COLOR, STATE_TO_IDX
from collections import deque

IDX_TO_STATE = {v: k for k, v in STATE_TO_IDX.items()}

ACTION_MAP = {
    0: "turn left",
    1: "turn right",
    2: "move forward",
    3: "pick up",
    4: "drop",
    5: "toggle",
    6: "done",
}


def usage_from_response(response):
    usage = getattr(response, "usage", None)
    if usage is None:
        return None
    return {
        "prompt_tokens": getattr(usage, "prompt_tokens", None),
        "completion_tokens": getattr(usage, "completion_tokens", None),
        "total_tokens": getattr(usage, "total_tokens", None),
    }


def relative_to_absolute(agent_direction, relative_direction):
    if agent_direction == "north":
        if relative_direction == "left":
            return "west"
        elif relative_direction == "right":
            return "east"
        elif relative_direction == "front":
            return "north"
    elif agent_direction == "south":
        if relative_direction == "left":
            return "east"
        elif relative_direction == "right":
            return "west"
        elif relative_direction == "front":
            return "south"
    elif agent_direction == "east":
        if relative_direction == "left":
            return "north"
        elif relative_direction == "right":
            return "south"
        elif relative_direction == "front":
            return "east"
    elif agent_direction == "west":
        if relative_direction == "left":
            return "south"
        elif relative_direction == "right":
            return "north"
        elif relative_direction == "front":
            return "west"
    else:
        raise ValueError(f"Invalid agent direction: {agent_direction}")


class Agent:
    def __init__(
        self, api_key: str, model: str = "gpt-5-mini", api_url: Optional[str] = None
    ):
        """
        Initialize the agent.

        Args:
            api_key: API key
            model: model to use
        """
        self.client = OpenAI(api_key=api_key, base_url=api_url)
        self.model = model
        self.temperature = 0.0
        self.past_states = deque(maxlen=2)  # [state, response]
        self.current_step = 0
        self.api_call_count = 0
        self.memory_map = {}
        self.visited_cells = set()
        self.agent_pos = (0, 0)
        self.last_action = None
        self.last_direction = None
        self.last_wall_in_front = None
        self.initial_scan_remaining = 4
        self.last_obs_image = None
        self.last_map_signature = None
        self.on_door = False
        self.drop_key_phase = None
        self.drop_key_turns = 0
        self.drop_key_restore_turns = 0
        self.ignore_keys = False

    def find_last_action(self, action_text, action_map):
        action_idx = None
        last_position = -1
        found_action = None

        # Check each possible action
        for idx, text in action_map.items():
            # Find the last position of this action in the text
            position = action_text.rfind(text)

            # If found and it's later than our previous match
            if position != -1 and position > last_position:
                last_position = position
                action_idx = idx
                found_action = text

        return action_idx, found_action

    def _direction_to_vector(self, direction: str) -> Tuple[int, int]:
        if direction == "north":
            return (0, 1)
        if direction == "south":
            return (0, -1)
        if direction == "east":
            return (1, 0)
        if direction == "west":
            return (-1, 0)
        raise ValueError(f"Invalid direction: {direction}")

    def _relative_to_global(self, dx: int, dy: int, direction: str) -> Tuple[int, int]:
        if direction == "north":
            return dx, dy
        if direction == "south":
            return -dx, -dy
        if direction == "east":
            return dy, -dx
        if direction == "west":
            return -dy, dx
        raise ValueError(f"Invalid direction: {direction}")

    def _target_visible(self, obs: Dict[str, Any], mission: str) -> bool:
        mission_l = mission.lower()
        target_color = None
        target_obj = None
        for color in IDX_TO_COLOR.values():
            if color in mission_l:
                target_color = color
                break
        for obj in IDX_TO_OBJECT.values():
            if obj in mission_l:
                target_obj = obj
                break
        if target_obj is None:
            return False
        grid = obs["image"]
        for x in range(7):
            for y in range(7):
                obj_id, color_id, _ = grid[x, y]
                if obj_id > 2 and IDX_TO_OBJECT[obj_id] == target_obj:
                    if target_color is None or IDX_TO_COLOR[color_id] == target_color:
                        return True
        return False

    def _parse_put_next_to_mission(self, mission: str) -> Optional[Tuple[str, str]]:
        mission_l = mission.lower()
        if "put" not in mission_l or "next to" not in mission_l:
            return None

        colors = list(IDX_TO_COLOR.values())
        objects = list(IDX_TO_OBJECT.values())

        def find_color_obj(text: str) -> Optional[str]:
            found_color = None
            found_obj = None
            for color in colors:
                if color in text:
                    found_color = color
                    break
            for obj in objects:
                if obj in text:
                    found_obj = obj
                    break
            if found_obj is None:
                return None
            return f"{found_color + ' ' if found_color else ''}{found_obj}".strip()

        if "next to" in mission_l:
            parts = mission_l.split("next to", 1)
            left = parts[0].replace("put", "").strip()
            right = parts[1].strip()
            left_obj = find_color_obj(left)
            right_obj = find_color_obj(right)
            if left_obj and right_obj:
                return left_obj, right_obj
        return None

    def _get_actionable_object(self, obs: Dict[str, Any]) -> str:
        grid = obs["image"]
        if grid[3, 5, 0] > 2:
            obj = f"{IDX_TO_COLOR[grid[3, 5, 1]]} {IDX_TO_OBJECT[grid[3, 5, 0]]}"
            if self.ignore_keys and obj.endswith("key"):
                return "none"
            return obj
        return "none"

    def _get_holding_object(self, obs: Dict[str, Any]) -> str:
        grid = obs["image"]
        if grid[3, 6, 0] > 2:
            return f"{IDX_TO_COLOR[grid[3, 6, 1]]} {IDX_TO_OBJECT[grid[3, 6, 0]]}"
        return "none"

    def _open_door_visible(self, obs: Dict[str, Any]) -> bool:
        grid = obs["image"]
        for x in range(7):
            for y in range(7):
                obj_id, _, door_state = grid[x, y]
                if obj_id == 4 and IDX_TO_STATE[door_state] == "open":
                    return True
        return False

    def update_memory_map(self, obs: Dict[str, Any], direction: str) -> None:
        if self.last_action == 2 and self.last_direction is not None:
            if self.last_obs_image is not None:
                moved = not np.array_equal(obs["image"], self.last_obs_image)
            else:
                moved = True
            if moved:
                dx, dy = self._direction_to_vector(self.last_direction)
                ax, ay = self.agent_pos
                self.agent_pos = (ax + dx, ay + dy)

        if self.last_action == 3 and self.last_direction is not None:
            dx, dy = self._direction_to_vector(self.last_direction)
            ax, ay = self.agent_pos
            picked_pos = (ax + dx, ay + dy)
            self.memory_map.pop(picked_pos, None)

        ax, ay = self.agent_pos
        grid = obs["image"]
        for x in range(7):
            for y in range(7):
                dx = x - 3
                dy = 6 - y
                gdx, gdy = self._relative_to_global(dx, dy, direction)
                pos = (ax + gdx, ay + gdy)
                obj_id, color_id, door_state = grid[x, y]
                label = None
                if obj_id == 2:
                    label = "wall"
                elif obj_id == 4:
                    label = f"{IDX_TO_STATE[door_state]} {IDX_TO_COLOR[color_id]} door"
                elif obj_id > 2:
                    obj_label = f"{IDX_TO_COLOR[color_id]} {IDX_TO_OBJECT[obj_id]}"
                    if self.ignore_keys and obj_label.endswith("key"):
                        label = None
                    else:
                        label = obj_label
                if label is not None:
                    self.memory_map[pos] = label

        self.visited_cells.add(self.agent_pos)
        self.last_wall_in_front = grid[3, 5, 0] == 2
        self.last_direction = direction
        self.last_obs_image = obs["image"].copy()
        self.on_door = bool(self.memory_map.get(self.agent_pos, "").endswith("door"))

    def render_memory_map(self, radius: int = 5) -> str:
        symbols = {
            "wall": "#",
            "door": "D",
            "key": "K",
            "ball": "B",
            "box": "X",
            "goal": "G",
        }
        ax, ay = self.agent_pos
        lines = []
        for y in range(ay + radius, ay - radius - 1, -1):
            row = []
            for x in range(ax - radius, ax + radius + 1):
                pos = (x, y)
                if pos == self.agent_pos:
                    row.append("A")
                    continue
                label = self.memory_map.get(pos)
                if label:
                    label_obj = label.split()[-1]
                    row.append(symbols.get(label_obj, "?"))
                elif pos in self.visited_cells:
                    row.append("·")
                else:
                    row.append(" ")
            lines.append("".join(row))
        legend = "Legend: A=agent, #=wall, D=door, K=key, B=ball, X=box, ·=visited"
        return f"{legend}\n" + "\n".join(lines)

    def get_system_prompt(self, direction):
        return f"""You are an agent in a grid-world environment. The goal is to navigate the world and interact with objects to complete the mission.

You must choose one of these actions:
- turn left (rotates towards {relative_to_absolute(direction, 'left')})
- turn right (rotates towards {relative_to_absolute(direction, 'right')})
- move forward (moves towards {direction})
- pick up
- drop
- toggle (opens a door with a key or opens a box)

Additional information:
- You can face FOUR different directions: north, south, east, west
- Your vision is a cone: you can see 6 cells in front and 3 cells to the left and right, but visibility is blocked by walls
- You cannot step on objects; you need to go around them
- Locked doors can be toggled with a key if they are one cell in front of you
- If a door is open and in front of you, move forward to enter the next room
- Keys can be picked up
- Boxes can contain a key or another object; toggle a box to reveal its content if it's one cell in front of you
- You can pick up and toggle only actionable objects (exactly one cell in front of you)

Main approach:
- Build a mental map by moving around and remembering explored cells
- If you reach a previously visited cell, do not circle; choose a different path among unvisited directions
- If you don't see the target object, explore systematically to cover new areas
- Example: In an I-shaped grid, move to the upper area first; if the target isn't there, move downward to the bottom area to look for the door or ball
- If the task is to put an object next to another object, find the target object and stop one step before it, then drop the object in front of you

What action should you take? Respond ONLY with the action you want to take, exactly as written above."""

    def parse_observation(
        self, obs: Dict[str, Any], mission: str
    ) -> Tuple[str, str, str]:
        """
        Convert the observation into a text prompt for the model.

        Args:
            obs: Observation from the environment
            mission: Current mission string

        Returns:
            Formatted prompt string
        """
        # Convert direction number to cardinal direction
        directions = ["east", "south", "west", "north"]
        direction = directions[obs["direction"]]

        # Parse the grid to find visible objects
        visible_objects = []
        grid = obs["image"]

        # Convert object types to descriptions
        for x in range(7):
            for y in range(7):
                if x == 3 and y == 6:
                    continue  # skip for agent position - it's the object being held
                obj_id, color_id, door_state = grid[x, y]
                if obj_id > 2:
                    obj_state = ""
                    if obj_id == 4:  # it's a door
                        obj_state = f"{IDX_TO_STATE[door_state]} "
                    obj_repr = f"\n * {obj_state}{IDX_TO_COLOR[color_id]} {IDX_TO_OBJECT[obj_id]} -"
                    obj_pos = ""
                    if x < 3:
                        obj_pos += f" {3 - x} cells to the left"
                    elif x > 3:
                        obj_pos += f" {x - 3} cells to the right"
                    if y < 6:
                        if obj_pos != "":
                            obj_pos += " AND"
                        obj_pos += f" {6 - y} cells in the front"
                    obj_repr = obj_repr + obj_pos
                    visible_objects.append(obj_repr)

        actionable_object = "none"
        if grid[3, 5, 0] > 2:
            actionable_object = (
                f"{IDX_TO_COLOR[grid[3, 5, 1]]} {IDX_TO_OBJECT[grid[3, 5, 0]]}"
            )
        holding_object = "none"
        if grid[3, 6, 0] > 2:
            holding_object = (
                f"{IDX_TO_COLOR[grid[3, 6, 1]]} {IDX_TO_OBJECT[grid[3, 6, 0]]}"
            )

        # Create the prompt
        past_states_str = "\n".join(self.past_states)
        current_state = f"""[Step {self.current_step}]
- Facing '{direction}'
- Wall on the left: {"yes" if grid[2, 6, 0] == 2 else "no"}
- Wall on the right: {"yes" if grid[4, 6, 0] == 2 else "no"}
- Wall in front (blocking): {"yes" if grid[3, 5, 0] == 2 else "no"}
- Visible objects: {', '.join(visible_objects) if visible_objects else 'none'}
- Actionable object: {actionable_object}
- Holding object: {holding_object}
- Mission: {mission}"""
        prompt = f"""Recent states:
{past_states_str}
{current_state}
Response:"""

        return prompt, current_state, direction

    def get_action(self, obs: Dict[str, Any], mission: str, verbose: bool) -> int:
        """
        Get the next action from the model.

        Args:
            obs: Observation from the environment
            mission: Current mission string

        Returns:
            Action index
        """
        prompt, current_state, direction = self.parse_observation(obs, mission)
        self.update_memory_map(obs, direction)

        actionable_object = self._get_actionable_object(obs)
        holding_object = self._get_holding_object(obs)
        grid = obs["image"]

        # Complete a key-drop sequence (turn around, drop behind, restore facing)
        if self.drop_key_phase is not None:
            if self.drop_key_phase == "turn_around":
                if self.drop_key_turns < 2:
                    self.drop_key_turns += 1
                    action_idx = 0  # turn left
                else:
                    self.drop_key_phase = "drop"
                    action_idx = 4  # drop
                    self.ignore_keys = True
            elif self.drop_key_phase == "drop":
                action_idx = 4  # drop
                self.drop_key_phase = "restore"
                self.drop_key_restore_turns = 0
                self.ignore_keys = True
            else:
                if self.drop_key_restore_turns < 2:
                    self.drop_key_restore_turns += 1
                    action_idx = 0  # turn left
                else:
                    self.drop_key_phase = None
                    self.drop_key_turns = 0
                    self.drop_key_restore_turns = 0
                    action_idx = None

            if action_idx is not None:
                action_text = ACTION_MAP[action_idx]
                self.past_states += [
                    current_state,
                    f"Response: {action_text}",
                ]
                self.current_step += 1
                self.last_action = action_idx
                metadata = {
                    "final_prompt": None,
                    "response": "drop_key_sequence",
                    "action_text": action_text,
                    "usage": None,
                }
                return action_idx, metadata

        # If an open door is directly in front, cross it to enter the next room
        if grid[3, 5, 0] == 4 and IDX_TO_STATE[grid[3, 5, 2]] == "open":
            action_idx = 2  # move forward
            action_text = ACTION_MAP[action_idx]
            self.past_states += [
                current_state,
                f"Response: {action_text}",
            ]
            self.current_step += 1
            self.last_action = action_idx
            metadata = {
                "final_prompt": None,
                "response": "cross_open_door",
                "action_text": action_text,
                "usage": None,
            }
            return action_idx, metadata

        mission_put = self._parse_put_next_to_mission(mission)
        if (
            holding_object.endswith("key")
            and (self.on_door or self._open_door_visible(obs))
            and "key" not in mission.lower()
        ):
            if self.drop_key_phase is None:
                self.drop_key_phase = "turn_around"
                self.drop_key_turns = 0

        if mission_put is not None:
            object_to_move, target_object = mission_put
            if holding_object != object_to_move:
                if actionable_object == object_to_move:
                    action_idx = 3  # pick up
                    action_text = ACTION_MAP[action_idx]
                    self.past_states += [
                        current_state,
                        f"Response: {action_text}",
                    ]
                    self.current_step += 1
                    self.last_action = action_idx
                    metadata = {
                        "final_prompt": None,
                        "response": "subgoal_pick_target_object",
                        "action_text": action_text,
                        "usage": None,
                    }
                    return action_idx, metadata
                if actionable_object == target_object:
                    action_idx = 2  # move forward (avoid picking target)
                    action_text = ACTION_MAP[action_idx]
                    self.past_states += [
                        current_state,
                        f"Response: {action_text}",
                    ]
                    self.current_step += 1
                    self.last_action = action_idx
                    metadata = {
                        "final_prompt": None,
                        "response": "avoid_picking_target_object",
                        "action_text": action_text,
                        "usage": None,
                    }
                    return action_idx, metadata

        map_signature = (
            self.agent_pos,
            tuple(sorted(self.memory_map.items())),
            tuple(sorted(self.visited_cells)),
        )

        if self.initial_scan_remaining > 0:
            if not self._target_visible(obs, mission):
                self.initial_scan_remaining -= 1
                action_idx = 1  # turn right
                action_text = ACTION_MAP[action_idx]
                self.past_states += [
                    current_state,
                    f"Response: {action_text}",
                ]
                self.current_step += 1
                self.last_action = action_idx
                self.last_map_signature = map_signature
                metadata = {
                    "final_prompt": None,
                    "response": "initial_scan_turn_right",
                    "action_text": action_text,
                    "usage": None,
                }
                return action_idx, metadata
            self.initial_scan_remaining = 0

        # no forced random action; allow model to decide even when map is unchanged

        stuck_feedback = ""
        if self.last_map_signature is not None and map_signature == self.last_map_signature:
            if self.last_action is not None:
                last_action_text = ACTION_MAP.get(self.last_action, str(self.last_action))
                stuck_feedback = (
                    f"\n\nNote: The previous action '{last_action_text}' did not change the state. "
                    "Choose a different action than last time and avoid oscillating left/right."
                )

        map_info = self.render_memory_map()
        final_prompt = (
            f"{self.get_system_prompt(direction)}\n\n{prompt}"
            f"\n\nMemory map:\n{map_info}{stuck_feedback}"
        )
        self.last_map_signature = map_signature

        self.api_call_count += 1
        response_obj = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "user", "content": final_prompt},
            ],
            max_completion_tokens=2000,
        )
        usage = usage_from_response(response_obj)
        if verbose:
            print("==================================")
            print("OpenAI API calls so far:", self.api_call_count)
            print("final_prompt:\n", final_prompt)
            print("response:\n", response_obj.choices[0].message.content)

        response = response_obj.choices[0].message.content.strip().lower()

        action_idx, action_text = self.find_last_action(response, ACTION_MAP)

        if action_idx is None:
            print(
                f"Warning: Invalid action '{action_text}', defaulting to move forward"
            )
            print("response was:", response)
            action_idx = 2  # Default to move forward
            action_text = ACTION_MAP[2]

        self.past_states += [
            current_state,
            f"Response: {action_text}",
        ]
        self.current_step += 1
        self.last_action = action_idx

        # dict with metadata to log during eval
        metadata = {
            "final_prompt": final_prompt,
            "response": response,
            "action_text": action_text,
            "usage": usage,
        }

        return action_idx, metadata


def handle_state(
    obs: Dict[str, Any], mission: str, agent: Agent, verbose: bool = False
) -> int:
    """
    Process the current state and get the next action.

    Args:
        obs: Current observation from the environment
        mission: Current mission string
        agent: Agent instance
        verbose: Whether to print debug information

    Returns:
        Action index to take
    """

    action, metadata = agent.get_action(obs, mission, verbose)

    if verbose:
        print("Chosen Action:", ACTION_MAP[action])

    return action, metadata