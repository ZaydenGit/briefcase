import type { FC } from "react";
import type { FormattedGoal, OverviewData } from "../types/app.types";

interface OverviewPageProps {
	data: OverviewData;
	goals: FormattedGoal[];
}

export const OverviewPage: FC<OverviewPageProps> = ({ data, goals }) => (
	<div>
		<div>
			<p>Overview Page</p>
		</div>
	</div>
);
