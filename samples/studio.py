from dataclasses import dataclass
from typing import Literal


# Compare comments, decorators, types, strings and numeric values.
@dataclass(frozen=True)
class Project:
    name: str
    progress: float = 0.75
    status: Literal["active", "paused"] = "active"


def describe(project: Project) -> str:
    if project.status != "active":
        return "Taking a thoughtful pause."
    return f"{project.name}: {round(project.progress * 100)}% complete"


if __name__ == "__main__":
    print(describe(Project(name="A useful idea")))
