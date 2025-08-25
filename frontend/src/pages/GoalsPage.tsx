import type { FC } from "react";
import type { FormattedGoal } from "../types/app.types";
import { Target } from "lucide-react";

interface GoalPageProps {
	goals: FormattedGoal[];
}

export const GoalsPage: FC<GoalPageProps> = ({ goals }) => (
	<div>
		<div>
			<Target />
		</div>
	</div>
);
