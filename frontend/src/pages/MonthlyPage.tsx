import type { FC } from "react";
import type { MonthData } from "../types/app.types";

interface MonthlyPageProps {
	year: string;
	month: string;
	data: MonthData;
}

export const MonthlyPage: FC<MonthlyPageProps> = ({ year, month, data }) => (
	<div>
		<div>
			<p>Monthly Page</p>
		</div>
	</div>
);
